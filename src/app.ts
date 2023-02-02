import express, { Application, Request, Response } from "express";
import { startDatabase } from "./database";
import { getMovies, postMovie, updateMovie } from "./functions";
import { ensureMovieExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/movies", postMovie);
app.get("/movies", getMovies);
app.patch("/movies/:id", ensureMovieExists, updateMovie);

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server is running!");
});
