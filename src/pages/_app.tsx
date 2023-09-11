import { type AppType } from "next/app";
import { api } from "~/utils/api";

import { ContextProvider } from "../providers/ContextProvider";
import { ContentContainer } from "~/components/ContentContainer";
import "~/styles/globals.css";
3;
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ContextProvider>
      <ContentContainer>
        <Component {...pageProps} />
      </ContentContainer>
    </ContextProvider>
  );
};

export default api.withTRPC(MyApp);
