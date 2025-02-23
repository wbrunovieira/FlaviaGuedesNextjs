-- CreateTable
CREATE TABLE "GiftCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "amount" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentId" TEXT
);
