import {Request, Response} from 'express';
import Movie from '../models/Movie';
import { IMovie } from '../utils/types';
import {ok, throwError} from '../utils/functions';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3'
import path from 'path'
// AWS S3 settings
AWS.config.loadFromPath(__dirname + '/config.json');
const s3 = new AWS.S3()

let date:string = "";

var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "indiefilm101",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (_req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (_req, _file, cb) {
        cb(null, date)
      }
    })
  })
const singleFileUpload = upload.single('file');

export const movieUpload: any = (req:Request, res: Response) => {
    date = Date.now().toString() + ".mp4"
    let downloadUri = `https://s3-us-east-2.amazonaws.com/indiefilm101/${date}`
    console.log(downloadUri)
    return new Promise((resolve, reject) => {
    return singleFileUpload(req, res, (err: any) => {
        if(err) return reject(err);
            return resolve(downloadUri)
        })
    })
}

export const uploadEndpoint = async(req:Request, res: Response):Promise<void> => {
    movieUpload(req, res).then((uri: string) => {return ok(res, "downloadUri", uri)}).catch((e:any) => {
        console.error(e)
        return throwError(res, 500, e)
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
            coverPicture: req.body.coverPicture
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
        const movies: IMovie = await Movie.find()
        ok(res, "movies", movies)
    } catch(e) {
        throwError(res, 500, e)
    }
}

// Delete movie by ID specified in params
export const deleteMovie = async(req: Request, res:Response) => {
    try {
        const deletedMovie:IMovie = Movie.findByIdAndDelete(req.params.id)
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
            throwError(res, 400, "Missing parameter.")
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