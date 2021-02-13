import {verify} from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'
import { throwError } from '../utils/functions';
import User from '../models/User';
import { IUser } from '../utils/types';

export let adminauth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        if (!req.header('Authorization')) {
            throw new Error()
        }
        let token:string = req.header('Authorization')!.replace('Bearer ', '');
        console.log(token)
        let {id} = verify(token, process.env.ACCESS_TOKEN_SECRET!) as {id: string}
        let user:IUser = User.findById(id);
        if (!user) {
            throw new Error;
        } else {
            if (user.role === "admin") {
                next();
            } else {
                throw new Error;
            }
        }
    } catch (error) {
        throwError(res, 403, "USER NOT AUTHENTICATED")
    }
}
