import express, { Application } from 'express';
import * as env from 'dotenv'
import cookieParser from 'cookie-parser';
import { connectDatabase } from './utils/functions';
import cors from 'cors';
import * as auth from './controllers/authentication'
import * as movies from './controllers/movie'
env.config()
const app: Application = express()

// Use json parser
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000"
    })
);
const PORT = process.env.PORT
connectDatabase()

// Authentication routes

// Get all users
app.get("/api/v1/users", auth.getUsers)
// Register user 
app.post("/api/v1/users/register", auth.register)
// Login user
app.post("/api/v1/users/login", auth.login)
// Refresh User token
app.post("/api/v1/users/refresh_token", auth.refreshToken)


// Movie routes

// Get all movies
app.get("/api/v1/movies", movies.getMovies);
// New movie
app.post("/api/v1/movies/create", movies.createMovie);
// Upload movie file
app.post("/api/v1/movies/upload", movies.uploadEndpoint)
// Get movie by id
app.get("/api/v1/movies/get/:id", movies.getMovie);
// Delete movie by id
app.delete("/api/v1/movies/delete", movies.deleteMovie);
// Update movie
app.patch("/api/v1/movies/update/:id")

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})