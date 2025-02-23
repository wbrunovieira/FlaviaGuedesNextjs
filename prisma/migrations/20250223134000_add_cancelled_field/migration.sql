-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GiftCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "amount" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "cancelled" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_GiftCard" ("amount", "createdAt", "id", "message", "name", "phone", "stripePaymentId", "stripeSessionId", "updatedAt") SELECT "amount", "createdAt", "id", "message", "name", "phone", "stripePaymentId", "stripeSessionId", "updatedAt" FROM "GiftCard";
DROP TABLE "GiftCard";
ALTER TABLE "new_GiftCard" RENAME TO "GiftCard";
CREATE UNIQUE INDEX "GiftCard_stripeSessionId_key" ON "GiftCard"("stripeSessionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
