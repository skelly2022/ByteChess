import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ContextProvider } from "../providers/ContextProvider";
import { ContentContainer } from "~/components/ContentContainer";
import "~/styles/globals.css";
require("@solana/wallet-adapter-react-ui/styles.css");

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ContextProvider>
      <SessionProvider session={session}>
        <ContentContainer>
          <Component {...pageProps} />
        </ContentContainer>
      </SessionProvider>
    </ContextProvider>
  );
};

export default api.withTRPC(MyApp);
