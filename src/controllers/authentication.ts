import {Request, Response} from 'express';
import User from '../models/User';
import { IUser } from '../utils/types';
import {auth, ok, throwError} from '../utils/functions'
import * as argon2 from 'argon2'
import {sign, verify} from 'jsonwebtoken';
import {__prod__} from '../constants'

export let getUsers = async (req: Request, res: Response) => {
    try {
        const users: Array<IUser> = await User.find()
        ok(res, "users", users)
    } catch (e) {
        throwError(res, 500, e)
    }
}

export let register = async(req:Request, res:Response) => {
    try {
        let userCheck: IUser = await User.findOne({email: req.body.email})
        if (userCheck) {
            throwError(res, 400, "USER EXISTS")
        }
        const hash:string = await argon2.hash(req.body.password)
        await User.create({
            email: req.body.email,
            username: req.body.username,
            profilePicture: req.body.profilePicture,
            password: hash
        })
        ok(res, "newUser", "USER REGISTERED")
    } catch (e) {
        throwError(res, 500, e)
    }
}

export let login = async(req: Request, res: Response) => {
    try {
        let userCheck: IUser = await User.findOne({email: req.body.email})
        let isValid = await argon2.verify(userCheck.password, req.body.password)
        if (isValid) {
            const token:string = sign({id: userCheck.id}, process.env.ACCESS_TOKEN_SECRET!, {
                expiresIn: "15m"
            })
            const cookie:string = sign({id: userCheck.id}, process.env.REFRESH_TOKEN_SECRET!, {
                expiresIn: "7d"
            })
            res.cookie("jid",cookie, {
                httpOnly: true,
                path: "/",
                domain: __prod__ ? ".api.indiefilms.surf": undefined,
                secure: __prod__,
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            })
            auth(res, token, userCheck)
        } else {
            throwError(res, 403, "PASSWORD INCORRECT")
        }
    } catch(e) {
        throwError(res, 500, e)
    }
}

export let refreshToken = async(req: Request, res: Response) => {
    try {
        let isUser:any = verify(req.cookies.jid, process.env.REFRESH_TOKEN_SECRET!)
        if (isUser) {
            const token:string = sign({id: isUser.id}, process.env.ACCESS_TOKEN_SECRET!, {
                expiresIn: "15m"
            })
            const currentDate = Date.now()
            let {exp} = isUser;
            if (exp < currentDate / 1000) {
                throwError(res, 403, "LOGIN")
            } else {
                const user:IUser = await User.findById(isUser.id)
                auth(res, token, user)
            }
        } else {
            throwError(res, 403, "USER NOT FOUND")
        }
    } catch(e) {
        console.error(e)
        throwError(res, 500, e)
    }
}