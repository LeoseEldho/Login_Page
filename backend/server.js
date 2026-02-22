import "dotenv/config"
import express from 'express';
import cors from 'cors'
import DataBaseConnection from './database/db.js'
import router from "./routes/userRoute.js";
import cookieParser from "cookie-parser";


const app = express();
DataBaseConnection()

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://YOUR_FRONTEND.vercel.app",
    ],
    credentials: true,
  })
);

app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api',router)

export default app;