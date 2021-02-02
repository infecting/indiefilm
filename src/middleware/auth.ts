import {verify} from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'
import User from '../models/User';
import { IUser } from '../utils/types';
import { throwError } from '../utils/functions';

export let authenticate = async (req:Request, res:Response, next:NextFunction) => {
    try {
        if (!req.header('Authorization')) {
            throw new Error()
        }
        let token:string = req.header('Authorization')!.replace('Bearer ', '');
        console.log(token)
        const decode = verify(token, process.env.ACCESS_TOKEN_SECRET!) as {id: string}
        const user: IUser = await User.findById(decode.id)
        if (!user) {
            throw new Error()
        }
        next();
    } catch (error) {
        throwError(res, 403, "USER NOT AUTHENTICATED")
    }
}
