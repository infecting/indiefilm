import { VerifyCallback } from 'jsonwebtoken';
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
    url: string,
    coverPicture: URL,
    score: number
}

export interface jwt extends VerifyCallback {
    id: string
}

