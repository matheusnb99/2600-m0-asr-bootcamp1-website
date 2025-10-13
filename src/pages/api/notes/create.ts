import type { APIRoute } from "astro";
import { USER_ID_MOCK, prisma } from "../../../lib/prisma";

// Ce point d'extrémité retourne les rêves achetés et les notes d'un utilisateur spécifique.
export const GET: APIRoute = async ({ request }) => {
  // 1. Récupérer l'ID utilisateur (ici, mocké)
  const userId = USER_ID_MOCK;

  // Dans un vrai scénario, on ferait :
  // const userId = request.headers.get('x-user-id');
  // if (!userId) { return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }); }

  try {
    // 2. Récupérer l'utilisateur, ses rêves et ses notes en une seule requête
    const userDashboardData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        dreams: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
          },
        },
        notes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!userDashboardData) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(userDashboardData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données du tableau de bord:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
