import express  from 'express'
import configure from './api/app'
import configureSocket from './sockets'

const app = express()
configure(app)

const port = process.env.PORT || 3000

const s = app.listen(port, () => console.log(`Server started on port ${port}`))
configureSocket(s)

// const { WebSocketServer } = require('ws')

// const server = new WebSocketServer({ port: 8080 })

// server.on('connection', (ws) => {
//     console.log('New client connected!')

//     ws.send('Hello this is welcome message')

//     ws.on('message', (data) => {
//         console.log(typeof data)
//         // if (data == 'hello') {
//         //     ws.send('hi')
//         // } else if (data == 'how are you?'){
//         //     ws.send('I am fine!')
//         // } else {
//         //     ws.send('you entered wrong message!')
//         // }           
//         ws.send(`Your message: ${data}`)
//     })

//     ws.on('error', err => console.error(err))
// })