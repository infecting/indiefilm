import { model, Model, Schema } from 'mongoose';
import { IUser } from '../utils/types';

const userSchema: Schema = new Schema({
    username: {type:String, required:true},
    email: {type:String, required:true},
    profilePicture: {type:String, required:true},
    role: {type:String, enum:["admin", "user"], default:"user"},
    password: {type:String, required:true},
    movies: {type:Number, default: 0}
}, {timestamps:true})

const User: Model<IUser> = model("User", userSchema);
export default User;