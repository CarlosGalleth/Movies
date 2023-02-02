import { Request, response, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./database";
import { IMovie, IMovieData, IMovieQuery } from "./interfaces";

export const postMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const movieDataRequest: IMovie = request.body;

    const queryString: string = format(
      `
      INSERT INTO
        movies(%I)
      VALUES 
       (%L)
      RETURNING *;
    `,
      Object.keys(movieDataRequest),
      Object.values(movieDataRequest)
    );

    const queryResult: IMovieQuery = await client.query(queryString);
    return response.status(201).json(queryResult.rows[0]);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({
        message: `Internal server error`,
      });
    }
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const perPage: any =
    request.query.perPage === undefined ? 5 : Number(request.query.perPage);
  let page: any =
    request.query.page === undefined ? 1 : Number(request.query.page);

  page *= perPage;

  const queryString: string = `
        SELECT 
            *
        FROM
            movies
        LIMIT $1 OFFSET $2;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [perPage, page],
  };

  const queryResult = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows);
};

export const updateMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = Number(request.params.id);
  const movieData: any = Object.values(request.body);

  const queryString: string = format(`
    UPDATE
      movies
    SET
      name = $1,
      description = $2,
      duration = $3,
      price = $4
    WHERE
      id = $5
    RETURNING *;
  `);
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [...movieData, id],
  };

  const queryResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return response.status(404).json({
      message: "Movie not found",
    });
  }

  return response.status(200).json(queryResult.rows[0]);
};

export const deleteMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = Number(request.params.id);

  const queryString: string = `
        DELETE FROM
          movies
        WHERE
          id = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return response.status(404).json({
      message: "Movie not found",
    });
  }

  return response.status(204).json();
};
