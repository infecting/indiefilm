import {Request, Response} from 'express';
import Movie from '../models/Movie';
import { IMovie } from '../utils/types';
import {ok, throwError} from '../utils/functions';


// Creates movie
export const createMovie = async(req:Request, res:Response) => {
    try {
        // If one of params not sent send back 400 response
        if (!req.body.userId || !req.body.title || !req.body.description || !req.body.url || !req.body.coverPicture || !req.body.score) {
            throwError(res, 400, "Missing parameter.")
        }
        // Create new movie in database
        const newMovie: IMovie = await Movie.create({
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            coverPicture: req.body.coverPicture,
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
        const movies: IMovie = Movie.find({})
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