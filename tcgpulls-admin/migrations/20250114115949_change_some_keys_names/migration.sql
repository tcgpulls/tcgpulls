/*
  Warnings:

  - You are about to drop the column `imageLargeRemoteUrl` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `imageSmallRemoteUrl` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageImageLarge` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageImageSmall` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `logoRemoteUrl` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `storageLogo` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `storageSymbol` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `symbolRemoteUrl` on the `PokemonSet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PokemonCard" DROP COLUMN "imageLargeRemoteUrl",
DROP COLUMN "imageSmallRemoteUrl",
DROP COLUMN "storageImageLarge",
DROP COLUMN "storageImageSmall",
ADD COLUMN     "imageLargeApiUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageLargeStorageUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageSmallApiUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageSmallStorageUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "PokemonSet" DROP COLUMN "logoRemoteUrl",
DROP COLUMN "storageLogo",
DROP COLUMN "storageSymbol",
DROP COLUMN "symbolRemoteUrl",
ADD COLUMN     "logoApiUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "logoStorageUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "symbolApiUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "symbolStorageUrl" TEXT NOT NULL DEFAULT '';
