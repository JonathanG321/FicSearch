import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.scss";
import NavBar from "../components/navBar";

const testUser = {
  username: "Test",
  sessions: {
    ao3: "hello",
    ffn: "hello",
    sb: "",
    sv: "hello",
    qq: "",
  },
};

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <NavBar user={testUser} />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
