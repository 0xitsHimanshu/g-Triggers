import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

//config for env vars to be loaded when working.
config();

export const app = express();

app.use(cors());
app.use(express.json());

import authRoute from './routes/authRoutes.js';
import campaignRoute from "./routes/campaignRoute.js"

app.use('/api/auth', authRoute);
app.use('/api/campaign', campaignRoute);
// app.use('/api/youtube', youtubeRoute);

app.get('/', (req, res) => {
    res.send('Welcome to the server')
})