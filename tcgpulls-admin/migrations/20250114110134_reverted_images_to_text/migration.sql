/*
  Warnings:

  - You are about to drop the column `storageImageLarge_extension` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageImageLarge_filesize` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageImageLarge_height` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageImageLarge_id` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageImageLarge_width` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageImageSmall_extension` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageImageSmall_filesize` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageImageSmall_height` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageImageSmall_id` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageImageSmall_width` on the `PokemonCard` table. All the data in the column will be lost.
  - You are about to drop the column `storageLogo_extension` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `storageLogo_filesize` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `storageLogo_height` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `storageLogo_id` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `storageLogo_width` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `storageSymbol_extension` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `storageSymbol_filesize` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `storageSymbol_height` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `storageSymbol_id` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `storageSymbol_width` on the `PokemonSet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PokemonCard" DROP COLUMN "storageImageLarge_extension",
DROP COLUMN "storageImageLarge_filesize",
DROP COLUMN "storageImageLarge_height",
DROP COLUMN "storageImageLarge_id",
DROP COLUMN "storageImageLarge_width",
DROP COLUMN "storageImageSmall_extension",
DROP COLUMN "storageImageSmall_filesize",
DROP COLUMN "storageImageSmall_height",
DROP COLUMN "storageImageSmall_id",
DROP COLUMN "storageImageSmall_width",
ADD COLUMN     "storageImageLarge" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "storageImageSmall" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "PokemonSet" DROP COLUMN "storageLogo_extension",
DROP COLUMN "storageLogo_filesize",
DROP COLUMN "storageLogo_height",
DROP COLUMN "storageLogo_id",
DROP COLUMN "storageLogo_width",
DROP COLUMN "storageSymbol_extension",
DROP COLUMN "storageSymbol_filesize",
DROP COLUMN "storageSymbol_height",
DROP COLUMN "storageSymbol_id",
DROP COLUMN "storageSymbol_width",
ADD COLUMN     "storageLogo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "storageSymbol" TEXT NOT NULL DEFAULT '';
