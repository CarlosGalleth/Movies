import express, { Application } from "express";
import { startDatabase } from "./database";
import { deleteMovie, getMovies, postMovie, updateMovie } from "./functions";
import { ensureDataIsValid, ensureMovieExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/movies", ensureDataIsValid, postMovie);
app.get("/movies", getMovies);
app.patch("/movies/:id", ensureMovieExists, updateMovie);
app.delete("/movies/:id", deleteMovie);

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server is running!");
});
