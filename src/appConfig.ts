import dotenv from 'dotenv';
dotenv.config()

export const appConfig = {
PORT: process.env.PORT || 80,
mongoURI: process.env.MONGO_URL || "mongodb://0.0.0.0:27017",
JWT_SECRET: process.env.JWT_SECRET || "123",
LOGIN: process.env.LOGIN,
PASS: process.env.PASS,
}

