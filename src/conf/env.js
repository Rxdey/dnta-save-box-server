import dotenv from 'dotenv';
import path from 'path';

const customPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
// console.log(process.env);
dotenv.config({ path: customPath });