-- CreateTable
CREATE TABLE "QuickBooksToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "realmId" TEXT NOT NULL,
    "obtainedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresIn" INTEGER NOT NULL,
    "xRefreshTokenExpiresIn" INTEGER,
    "tokenType" TEXT NOT NULL,
    "idToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
