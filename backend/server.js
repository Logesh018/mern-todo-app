import express from 'express';
import dotenv from 'dotenv';
import todoRoutes from "./routes/todo-route.js"
import { connectDB } from './config/db.js';
import path from "path";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;
//app.use(cors());

app.use("/api/todos", todoRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT,()=> {
  connectDB();
  console.log("Server is running on http://localhost:5000");
});