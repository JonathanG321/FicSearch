import { type Session } from "../../types/sessions";
import { trpc } from "../../utils/trpc";
import { type ExternalLoginFormSubmit } from "./externalLoginForm";
import SessionDisplay from "./sessionDisplay";

export type NavBarType = {
  user: {
    username: string;
    sessions: {
      ao3: Session;
      ffn: Session;
      sb: Session;
      sv: Session;
      qq: Session;
    };
  };
};

function NavBar({ user }: NavBarType) {
  const ao3Login: ExternalLoginFormSubmit = function (username, password) {
    const req = trpc.AO3.login.useQuery({ username, password });
    console.log({ req });
  };
  const siteData = {
    ao3: { siteName: "AO3", label: "Archive of Our Own", session: user.sessions.ao3, onSubmit: ao3Login },
    ffn: { siteName: "FFN", label: "FanFiction.Net", session: user.sessions.ffn, onSubmit: ao3Login },
    qq: { siteName: "QQ", label: "Questionable Questing", session: user.sessions.qq, onSubmit: ao3Login },
    sb: { siteName: "SB", label: "Space Battles", session: user.sessions.sb, onSubmit: ao3Login },
    sv: { siteName: "SV", label: "Sufficient Velocity", session: user.sessions.sv, onSubmit: ao3Login },
  };
  return (
    <div className="sticky top-0 z-50 flex h-10 items-center justify-between border-b-2 bg-blue-300">
      <h1 className="px-3 font-bold">FicSearch</h1>
      <div className="flex h-full items-center">
        <div className="flex h-full items-center border-x-2 px-4 font-bold">{user.username}</div>
        <SessionDisplay {...siteData.ao3} />
        <SessionDisplay {...siteData.ffn} />
        <SessionDisplay {...siteData.qq} />
        <SessionDisplay {...siteData.sb} />
        <SessionDisplay {...siteData.sv} />
      </div>
    </div>
  );
}

export default NavBar;
