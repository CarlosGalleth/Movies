export interface IMovie {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface IMovieData extends IMovie {
  id: number;
}

export type MovieRequiredKeys = "name" | "description" | "duration" | "price";
