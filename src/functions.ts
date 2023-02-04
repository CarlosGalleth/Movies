import { Request, response, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./database";
import { IMovie, IMovieQuery } from "./interfaces";

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
  let perPage = Number(request.query.perPage) || 5;
  let page = Number(request.query.page) || 1;

  if (perPage <= 0) {
    perPage = 5;
  }

  if (page <= 0) {
    page = 1;
  }

  const moduleParam = request.params.module;

  const queryString: string = `
        SELECT 
            *
        FROM
            movies
        OFFSET $1 LIMIT $2;
    `;

  const queryStringAll: string = `
    SELECT 
      *
    FROM
      movies
  `;

  const queryResult2 = await client.query(queryStringAll);
  const pages: number = Math.ceil(queryResult2.rowCount / perPage);

  if (page > pages) {
    page = pages;
  }

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [perPage * (page - 1), perPage],
  };

  const baseUrl: string = `http://localhost:3000/movies/${moduleParam}`;

  const prevPage: string | null =
    page === 1 ? null : `${baseUrl}?page=${page - 1}$perPage=${perPage}`;

  const nextPage: string | null =
    page === pages || page > pages
      ? null
      : `${baseUrl}?page=${page + 1}$perPage=${perPage}`;

  const queryResult = await client.query(queryConfig);
  const count = queryResult.rowCount;

  const pagination = {
    prevPage,
    nextPage,
    count,
    data: queryResult.rows,
  };

  return response.status(200).json(pagination);
};

export const updateMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = Number(request.params.id);
  const movieData: any = Object.values(request.body);
  const dataKeys: any = Object.keys(request.body);

  const queryString: string = format(
    `
    UPDATE
      movies
    SET
     (%I) = row (%L) 
    WHERE
      id = $1
    RETURNING *;
  `,
    dataKeys,
    movieData
  );

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
