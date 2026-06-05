import "dotenv/config";
import { PrismaClient } from ".prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";

const adapter = new PrismaMssql(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

export default prisma;
