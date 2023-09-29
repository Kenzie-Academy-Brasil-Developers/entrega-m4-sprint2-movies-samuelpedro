import express from "express"
import "dotenv/config";
import { createMovie, deleteMovies, getMoviesId, readMovie, updateMovie } from "./logics";
import { isCreateBodyValid, isIdExists, isMoviesNameExists } from "./middlewares";
import { connectDataBase } from "./database";

const app = express();

app.use(express.json());

app.post("/movies", isCreateBodyValid, isMoviesNameExists, createMovie);

app.get("/movies", readMovie);

app.get("/movies/:id", isIdExists, getMoviesId);

app.patch("/movies/:id", isIdExists, isMoviesNameExists, updateMovie);

app.delete("/movies/:id", isIdExists, deleteMovies);

const PORT = 3000;

app.listen(PORT, async () => {
    console.log(`server started on port ${PORT}`);
    connectDataBase();
})