import express from "express";
import cors from "cors";
const app = express();

const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: "http://localhost:3001"
};

app.use(cors(corsOptions));


app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});