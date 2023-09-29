import { NextFunction, Request, Response } from "express";
import { client } from "./database";


export const isCreateBodyValid = (req: Request, res: Response, next: NextFunction) => {
  const errors = [];

  if(!req.body.name) {
    errors.push("Name is required");
  }

  if(!req.body.category) {
    errors.push("Category is required");
  }

  if(!req.body.duration) {
    errors.push("Duration is required");
  }

  if(!req.body.price) {
    errors.push("Price is required");
  }

  if(req.body.name?.length > 50 ) {
    errors.push("The name cannot contain more than 50 characters");
  }

  if(req.body.category?.length > 20 ) {
    errors.push("The category cannot contain more than 20 characters");
  }

  if(errors.length > 0 ) {
    return res.status(409).json(errors);
  }

  return next();
}

export const isMoviesNameExists = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  const queryString = 'SELECT COUNT(*) FROM movies WHERE name = $1';
  const result = await client.query(queryString, [name]);
  const count = parseInt(result.rows[0].count);

  if (count > 0) {
    return res.status(409).json({ message: 'Movie name already exists!' });
  }

  next();
}

export const isIdExists = async (req: Request, res: Response, next: NextFunction) => {
  const requestedMovieId = Number(req.params.id);

  //// faz uma consulta SQL para verificar se o filme com o ID especificado existe //
  const queryString = 'SELECT COUNT(*) FROM movies WHERE id = $1';
  const result = await client.query(queryString, [requestedMovieId]);
  const count = parseInt(result.rows[0].count);

  if (count === 0) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  next();
}