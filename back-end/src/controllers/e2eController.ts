import { Request, Response } from 'express';
import * as e2eService from '../services/e2eService.js';

async function reset(req: Request, res: Response) {
  await e2eService.truncate();
  res.sendStatus(200);
}

export default reset