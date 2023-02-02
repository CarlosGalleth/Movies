import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { MovieRequiredKeys } from "./interfaces";

export const ensureDataIsValid = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const keys: Array<string> = Object.keys(request.body);
  const requiredKeys: Array<MovieRequiredKeys> = ["name", "duration", "price"];

  const containsAllRequired: boolean = requiredKeys.every((key: string) => {
    return keys.includes(key);
  });

  if (!containsAllRequired) {
    return response.status(400).json({
      message: `Required keys are: ${requiredKeys}`,
    });
  }

  const { name, description, duration, price } = request.body;
  request.validateBody = {
    name,
    description,
    duration,
    price,
  };

  return next();
};

export const ensureNameIsUnique = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const movieName: string = request.body.name;

  const queryString: string = `
    SELECT
      *
    FROM
      movies
    WHERE
      name = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [movieName],
  };

  const queryResult = await client.query(queryConfig);

  console.log(queryResult);

  if (queryResult.rowCount) {
    return response.status(409).json({
      message: "Movie name already in use",
    });
  }

  return next();
};
