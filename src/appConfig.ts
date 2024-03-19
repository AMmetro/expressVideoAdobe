import dotenv from 'dotenv';
dotenv.config()

export const appConfig = {
PORT: process.env.PORT || 5001, // на 80 порту работает versel внутренний сервис 
mongoURI: process.env.MONGO_URL || "mongodb://0.0.0.0:27017",
JWT_ACSS_SECRET: process.env.JWT_ACSS_SECRET || "123",
JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "456",
LOGIN: process.env.LOGIN || "admin",
PASS: process.env.PASS || "qwerty",
}
