/*
  Warnings:

  - A unique constraint covering the columns `[stripeSessionId]` on the table `GiftCard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GiftCard_stripeSessionId_key" ON "GiftCard"("stripeSessionId");
