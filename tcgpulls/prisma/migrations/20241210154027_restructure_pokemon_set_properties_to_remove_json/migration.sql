/*
  Warnings:

  - You are about to drop the column `images` on the `PokemonSet` table. All the data in the column will be lost.
  - You are about to drop the column `legalities` on the `PokemonSet` table. All the data in the column will be lost.
  - Added the required column `logo` to the `PokemonSet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `PokemonSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PokemonSet" DROP COLUMN "images",
DROP COLUMN "legalities",
ADD COLUMN     "logo" TEXT NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL;
