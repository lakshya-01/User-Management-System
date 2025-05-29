import express, { Application } from "express";
import cors from "cors";
import connectDB from "./db/connect";
import userRoutes from "./routes/userRoutes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
