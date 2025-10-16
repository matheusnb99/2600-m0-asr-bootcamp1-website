import { PrismaClient } from "@prisma/client";

// Déclaration pour éviter de créer de nouvelles instances de PrismaClient à chaque rechargement
// en développement (hot-reloading).
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Utilise la variable globale si elle existe, sinon crée une nouvelle instance.
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Active le logging des requêtes
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Pour des raisons de simplicité et de sécurité, nous n'incluons pas les informations d'authentification ici.
// Dans un vrai projet, l'ID utilisateur serait extrait d'un jeton de session sécurisé.
// Pour la démonstration, nous utilisons un ID mocké.
export const USER_ID_MOCK = 1;
