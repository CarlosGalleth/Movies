import { QueryResult } from "pg";

export interface IMovie {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface IMovieData extends IMovie {
  id: number;
}

export type MovieRequiredKeys = "name" | "duration" | "price";

export type IMovieQuery = QueryResult<IMovieData>;
