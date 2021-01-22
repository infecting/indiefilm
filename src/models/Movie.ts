import { model, Model, Schema } from 'mongoose';
import { IMovie } from '../utils/types';

const movieSchema: Schema = new Schema({
    userId: {type: String, required: true},
    title: {type: String, required:true},
    description: {type:String, required:true},
    score: {type:Number, required:true, default: 0},
    coverPicture: {type:String, required: true},
    url: {type:String, required:true}
}, {timestamps:true})

const Movie: Model<IMovie> = model("Movie", movieSchema);
export default Movie;