-- CreateEnum
CREATE TYPE "Operation" AS ENUM ('ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE');

-- CreateTable
CREATE TABLE "Calculation" (
    "id" SERIAL NOT NULL,
    "a" INTEGER NOT NULL,
    "b" INTEGER NOT NULL,
    "result" INTEGER NOT NULL,
    "type" "Operation" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calculation_pkey" PRIMARY KEY ("id")
);
