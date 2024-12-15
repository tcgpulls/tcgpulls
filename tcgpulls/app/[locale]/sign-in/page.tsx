import { signIn, providerMap } from "@/auth";
import { AuthError } from "next-auth";
import { Heading } from "@/components/catalyst-ui/heading";
import { Button } from "@/components/catalyst-ui/button";

type Props = {
  params: { locale: string };
  searchParams: { callbackUrl: string | undefined };
};

export default async function SignInPage({ params, searchParams }: Props) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="container flex justify-center items-center mx-auto min-h-screen">
      <div className="w-full max-w-sm p-8 space-y-8">
        <Heading level={3} className="text-center">
          Sign in
        </Heading>
        {Object.values(providerMap).map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              "use server";
              try {
                await signIn(provider.id, {
                  redirectTo: callbackUrl ?? `/${params.locale}/app`,
                });
              } catch (error) {
                if (error instanceof AuthError) {
                  // Handle AuthError
                }
                throw error;
              }
            }}
          >
            <Button type="submit" className="w-full mt-4">
              Sign in with {provider.name}
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}
