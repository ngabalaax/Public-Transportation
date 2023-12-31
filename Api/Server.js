import express, { json } from 'express';

const server = express();

import adminRoute from './users/admin.js'
import userRoute from './users/users.js'
import busesRoute from './buses.js'
import routes from './routes.js'
import schedulesRoute from './schedule.js'
import bookingRoute from './booking.js'
import locationRoute from './location.js'


server.use(json());
server.use('/admin', adminRoute)
server.use('/user', userRoute)
server.use('/buses', busesRoute)
server.use('/routes', routes)
server.use('/schedules', schedulesRoute)
server.use('/booking', bookingRoute)
server.use('/location', locationRoute)

export default server;