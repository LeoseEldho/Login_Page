import "dotenv/config"
import express from 'express';
import cors from 'cors'
import DataBaseConnection from './database/db.js'
import router from "./routes/userRoute.js";
import cookieParser from "cookie-parser";


const app = express();
DataBaseConnection()

// ✅ CORS - This is the critical fix
const allowedOrigins = [
  "https://login-page-frontend-three.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // ✅ Required for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('API is running');
});
app.use('/api',router)

export default app;
