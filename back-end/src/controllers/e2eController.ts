import { Request, Response } from "express";
import * as e2eService from "../services/e2eService.js";

async function reset(req: Request, res: Response) {
  await e2eService.truncate();
  res.sendStatus(200);
}

async function findByName(req: Request, res: Response) {
  const name = req.params.name;
  const recommendation = await e2eService.getByName(name);
  res.send(recommendation);
}

async function updateScore(req: Request, res: Response) {
  const { name, score } = req.body;
  const numberScore = parseInt(score);

  await e2eService.updateScore(name, numberScore);
  res.sendStatus(200);
}

export { reset, findByName, updateScore }