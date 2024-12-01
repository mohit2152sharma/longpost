import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { checkAuthStatus } from "~/lib/auth";

const publicPaths = ["/login"];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Check authentication on route change
    const handleRouteChange = (url: string) => {
      const { isAuthenticated } = checkAuthStatus();
      const isPublicPath = publicPaths.includes(url);

      if (!isAuthenticated && !isPublicPath) {
        router.push("/login");
      }
    };

    // Check authentication on initial load
    handleRouteChange(router.pathname);

    // Listen for route changes
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
