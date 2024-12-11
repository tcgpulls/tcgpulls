/*
  Warnings:

  - Added the required column `officialId` to the `PokemonSet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PokemonSet" ADD COLUMN     "officialId" TEXT NOT NULL;
