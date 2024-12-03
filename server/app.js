import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

//config for env vars to be loaded when working.
config();

export const app = express();

app.use(express.json());
app.use(cors());


// app.use('/api', userRouter);

app.get('/api', (req, res) => {
    res.sendJson({
        success: true,
        message: "Response from the server",
    })
    
})

app.get('/', (req, res) => {
    res.send('Welcome to the server')
})