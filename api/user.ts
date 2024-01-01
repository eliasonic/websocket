import { Router } from "express";
   
const users = [
    { id: '1', name: 'Elias', age: 30, career: 'Developer' },
    { id: '2', name: 'Annie', age: 28, career: 'Administrator' },
    { id: '3', name: 'Lizzy', age: 25, career: 'Teacher' },
]

export default function userRoutes() {
    const router = Router() 

    router
        .get('/', (req, res) => {
            res.send(users)
        })

        .get('/:id', (req, res, next) => {
            const id = req.params.id
            
            const user = users.find(user => {
                return user.id === id
            }) 
            if (!user) {
                return next(new Error('User Not Found'))
            }
            res.send(user)
        })

        .post('/', (req, res, next) => {
            const data = req.body

            const id = String(users.length + 1)
            users.push({ id, ...data})
            res.send(users)
        })

    return router
}