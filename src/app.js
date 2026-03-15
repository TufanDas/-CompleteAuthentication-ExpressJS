import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

export default app;







// const PORT = 3000;

// Home route
app.get("/", (req, res) => {
    res.send("Hello Rajib! Your Express server is running 🚀");
});

// About route
app.get("/about", (req, res) => {
    res.send("This is the about page");
});