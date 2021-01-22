import {Document, ObjectId} from 'mongoose';

export interface IUser extends Document {
    _id: ObjectId;
    email: string;
    username: string;
    role: "admin" | "user";
    password: string;
}

export interface IMovie extends Document {
    userId: ObjectId,
    title: string
    description: string,
    url: URL,
    coverPicture: URL,
    score: number
}