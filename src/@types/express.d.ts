import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Definimos que todo Request pode ter um userId opcional
    }
  }
}
