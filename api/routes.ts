import { Router } from "express";
import auth from "./auth";
import userRoutes from "./user";

export default function api() {
    const router = Router()

    router
        .use((req, res, next) => {
            console.log(req.body)
            if (!req.body) {
                return next(new Error('Bad Request'))
            }
            next()
        })

        .use('/', auth())

        .use('/users', userRoutes())

    return router
}