import { fetchAndStorePokemonSets } from "@/scripts/fetchAndStorePokemonSets";

export const POST = async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.TCGPULLS_API_KEY}`) {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const forceImageDownload = body?.forceImageDownload || false;

    await fetchAndStorePokemonSets(forceImageDownload);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Database seeded successfully!",
      }),
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error in database seeding:", error);

    // Check if the error is an instance of Error
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500 },
      );
    }

    // Handle unexpected non-Error types
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unknown error occurred.",
      }),
      { status: 500 },
    );
  }
};
