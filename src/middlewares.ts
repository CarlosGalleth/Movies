import { NextFunction } from "express";
import { IMovie, MovieRequiredKeys } from "./interfaces";

export const middleware = (payload: any): IMovie => {
  const keys: Array<string> = Object.keys(payload);
  const requiredKeys: Array<MovieRequiredKeys> = ["name", "duration", "price"];
  const containsAllRequired: boolean = requiredKeys.every((key: string) => {
    return keys.includes(key);
  });

  if (!containsAllRequired) {
    throw new Error(`Required keys are: ${requiredKeys}`);
  }
  if (keys.length > requiredKeys.length) {
    throw new Error(`Required keys are: ${requiredKeys}`);
  }

  return payload;
};

export const ensureMovieExists = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const teste = request.body;
  console.log(teste);
  return next();
};
