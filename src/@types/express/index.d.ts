import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      validateBody: {
        name: string;
        description?: string;
        duration: number;
        price: number;
      };
    }
  }
}
