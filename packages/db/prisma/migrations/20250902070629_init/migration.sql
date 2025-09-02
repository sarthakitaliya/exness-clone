-- CreateEnum
CREATE TYPE "public"."OrderType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('open', 'closed', 'liquidated');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."OrderType" NOT NULL,
    "asset" TEXT NOT NULL,
    "pair" TEXT NOT NULL,
    "qty" DECIMAL(65,30),
    "stopLoss" BIGINT,
    "takeProfit" BIGINT,
    "margin" BIGINT NOT NULL,
    "leverage" INTEGER NOT NULL,
    "openPrice" BIGINT NOT NULL,
    "closePrice" BIGINT,
    "pnl" BIGINT,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'closed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
