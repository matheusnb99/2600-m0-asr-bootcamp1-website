import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  try {
    return new Response(
      JSON.stringify({
        status: "OK",
        server: "Running successfully",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache", // Important pour les health checks
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "ERROR",
        server: "Internal server error during health check process.",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
  }
};
