import express from "express";
import { router } from "./routes/auth";
const app = express();

app.use(express.json());
app.use("/api/user", router);
app.listen(3000, () => console.log("Server running on port 3000"));
