import 'reflect-metadata';
import 'dotenv/config'; // added on tsconfig.json: "allowJs": true (line 10)
import 'express-async-errors';

import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes/index';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter); // Não se aplica às rotas files
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
});

app.listen(3333, () => {
  console.log('Server running on port 3333')
});

// docker start gostack_postgres

// yarn init -y
// yarn add express
// yarn add typescript
// yarn tsc --init
// Alterar linhas 15 e 16 no tsconfig.json
// yarn add @types/express -D
// yarn add ts-node-dev (nodemon para typescript)
// yarn add uuidv4
// yarn add date-fns