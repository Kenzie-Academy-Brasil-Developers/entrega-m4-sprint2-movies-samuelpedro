import { Request, Response } from "express";
import { client } from "./database";
import { TMoviesUpdateData } from "./interfaces";
import { QueryConfig } from "pg";
import format from "pg-format";

export const readMovie = async (req: Request, res: Response) => {
  let queryConfig: string | QueryConfig;

  if (req.query.category) {
    const category = '%' + req.query.category + '%';
    queryConfig = format(`SELECT * FROM movies WHERE category ILIKE '%s';`, category);
  } else {
    //// Se a categoria não for especificada, retornar todos os filmes ////
    queryConfig = `SELECT * FROM movies;`;
  }

  const query = await client.query(queryConfig);

  // Verifique se a consulta retornou algum resultado
  if (query.rows.length === 0) {
    // Se a categoria não foi encontrada ou não foi especificada, retorne todos os filmes
    const allMoviesQuery = `SELECT * FROM movies;`;
    const allMovies = await client.query(allMoviesQuery);
    return res.status(200).json(allMovies.rows);
  }

  return res.status(200).json(query.rows);
};

let currentId: number = 1; /// Variável para rastrear o próximo ID ///

/// Esta função pega o próximo valor de ID após a exclusão de todos os registros /// 
const getNextId = async () => {
  const queryString = "SELECT MAX(id) AS max_id FROM movies";
  const query = await client.query(queryString);
  const maxId = query.rows[0].max_id;
  return maxId !== null ? maxId + 1 : 1;
};

export const createMovie = async (req: Request, res: Response) => {
  // Obtendo o próximo valor de ID usando a função getNextId
  const nextId = await getNextId();

  const queryString: string = `
  INSERT INTO "movies" (id, name, category, duration, price)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [nextId, req.body.name, req.body.category, req.body.duration, req.body.price]
  }

  const query = await client.query(queryConfig);

  return res.status(201).json(query.rows[0]);
};

export const getMoviesId = async (req: Request, res: Response) => {
  const queryString = `SELECT * FROM movies WHERE id = $1;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [req.params.id]
  }

  const query = await client.query(queryConfig);
  res.status(200).json(query.rows[0]);
};

export const updateMovie = async (req: Request, res: Response) => {
  const objectData: TMoviesUpdateData = {};
  
  Object.entries(req.body).forEach(([key, value]) => {
    if (key === "name" || key === "category" || key === "duration" || key === "price") {
      if ((key === "name" || key === "category") && typeof value === "string") {
        objectData[key] = value;
      } else if ((key === "duration" || key === "price") && typeof value === "number") {
        objectData[key] = value;
      }
    }
  });

  if (Object.keys(objectData).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update." });
  }

  const queryConfig = format(`
    UPDATE movies SET (%I) = ROW (%L) WHERE id = %L RETURNING *;
  `, Object.keys(objectData), Object.values(objectData), req.params.id);

  const query = await client.query(queryConfig);

  res.status(200).json(query.rows[0]);
};


export const deleteMovies = async (req: Request, res: Response) => {
  const queryString = `DELETE FROM movies WHERE id = $1;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [req.params.id]
  }

  await client.query(queryConfig);

  return res.status(204).end();
};
