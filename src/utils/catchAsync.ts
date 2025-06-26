import { Response, Request, RequestHandler, NextFunction } from "express";

export function catchAsync(fn: RequestHandler) {
  return (req: any, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
