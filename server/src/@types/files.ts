declare namespace Express {
  export interface Request {
    file?: Multer.File & { location: string; key: string };
  }
}
