const express = require("express");
const mongoose = require("mongoose");
const postRoutes = require("./routes/postRoutes");

const app = express();
app.use(express.json());

const mongoUrl =
  process.env.MONGODB_URI || "mongodb://localhost:27017/rest-api-assignment-1";

mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });

app.use("/post", postRoutes);

app.get("/", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
