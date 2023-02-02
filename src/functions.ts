import { Request, response, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./database";
import { IMovie, IMovieData } from "./interfaces";
import { middleware } from "./middlewares";

export const postMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const movieDataRequest: IMovie = middleware(request.body);

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

    const queryResult = await client.query(queryString);
    return response.status(201).json(queryResult.rows[0]);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({
        message: error.message,
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

export const updateMovie = (request: Request, response: Response) => {
  return response;
};
