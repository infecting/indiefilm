import {Request, Response} from 'express';
import Movie from '../models/Movie';
import { IMovie } from '../utils/types';
import {ok, throwError} from '../utils/functions';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3'
import * as env from 'dotenv'
env.config()

// AWS S3 settings
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

let date:string = "";

// Multer upload via s3
var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "indiefilm101",
      // Content type
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (_req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (_req, _file, cb) {
        cb(null, date)
      }
    })
  })

// Upload a single file not array of files
const singleFileUpload = upload.single('file');

// Upload movie function returns a promise
export const movieUpload: any = (req:Request, res: Response) => {
    date = Date.now().toString() + ".mp4"
    let downloadUri = `https://d24d6i9n6m5ewq.cloudfront.net/${date}`
    console.log(downloadUri)
    return new Promise((resolve, reject) => {
    return singleFileUpload(req, res, (err: any) => {
        if(err) return reject(err);
            return resolve(downloadUri)
        })
    })
}

// Controller for the upload endpoint
export const uploadEndpoint = async(req:Request, res: Response):Promise<void> => {
    movieUpload(req, res).then((uri: string) => {ok(res, "downloadUri", uri)}).catch((e:any) => {
        console.error(e)
        return throwError(res, 500, e.message)
    })
    return;
}

// Creates movie
export const createMovie = async(req:Request, res:Response) => {
    try {
        // If one of params not sent send back 400 response
        if (!req.body.userId || !req.body.title || !req.body.description || !req.body.url || !req.body.coverPicture) {
            throwError(res, 400, "Missing parameter.")
        }
        // Create new movie in database
        const newMovie: IMovie = await Movie.create({
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            coverPicture: req.body.coverPicture,
            bannerPicture: req.body.bannerPicture,
            score: req.body.score
        })
        // Send back json response
        ok(res, "newMovie", newMovie)
    } catch(e) {
        throwError(res, 500, e)
    }
}

// Get all movies from database
export const getMovies = async(_req:Request, res:Response) => {
    try {
        // Find all Movies
        const movies: Array<IMovie> = await Movie.find({isConfirmed: true});
        ok(res, "movies", movies)
    } catch(e) {
        throwError(res, 500, e.message)
    }
}

// Delete movie by ID specified in params
export const deleteMovie = async(req: Request, res:Response) => {
    try {
        const movie: IMovie = await Movie.findById(req.params.id)
        const lastItem = movie.url.substring(movie.url.lastIndexOf('/') + 1)
        var params = {  Bucket: 'indiefilm101', Key: lastItem };
        await s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);  // error
        else     console.log();                 // deleted
        });
        const deletedMovie:IMovie = await Movie.findByIdAndDelete(req.params.id)
        ok(res, "deletedMovie", deletedMovie)
    } catch(e) {
        throwError(res, 500, e)
    }
}

// Get movie by id
export const getMovie = async(req: Request, res: Response) => {
    try {
        const movie: IMovie = await Movie.findById(req.params.id)
        ok(res, "movie", movie);
    } catch (e) {
        throwError(res, 500, e)
    }
}

// Update Movie
export const updateMovie = async(req: Request, res: Response) => {
    try {
        if (!req.body.userId || !req.body.title || !req.body.description || !req.body.url || !req.body.coverPicture || !req.body.score) {
            throw new Error("Missing parameters.")
        }
        const updatedMovie: IMovie = await Movie.findByIdAndUpdate(req.params.id, {
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            coverPicture: req.body.coverPicture,
            score: req.body.score
        });
        ok(res, "updatedMovie", updatedMovie);
    } catch (e) {
        throwError(res, 500, e);
    }
}

export const getUnconfirmedMovies = async(req:Request, res:Response) => {
    try {
        const movies: Array<IMovie> = Movie.find({isConfirmed:false})
        ok(res, "movies", movies)
    } catch(e) {
        throwError(res, 500, e)
    }
}

export const confirmMovie = async(req:Request, res: Response) => {
    try {
        const movie:IMovie = await Movie.findByIdAndUpdate(req.params.id, { $set: { isConfirmed: true } })
        ok(res, "confirmedMovie", movie)
    } catch(e) {
        throwError(res, 500, e)
    }
}