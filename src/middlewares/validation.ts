import { Request, Response, NextFunction, RequestHandler } from "express";
import { AnyZodObject, ZodEffects, ZodError } from "zod";

export const validate = (
  schema: AnyZodObject | ZodEffects<AnyZodObject>
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation error details:", error.errors);
        res.status(400).json({
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};
