import { type Session } from "../../types/sessions";
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
  const ao3Login: ExternalLoginFormSubmit = async function (username, password) {
    const req = await fetch(
      `https://archiveofourown.org/users/login?authenticity_token=9riXYn8UdReE4RFxZ1NLlhAM6L8h1iOzoXYJfIc2fAv3ORK99Vjn6ql4524ZmXuZFF%2Fj8fEVOaekNkzgWJMicw%3D%3D&user%5Blogin%5D=${username}&user%5Bpassword%5D=${password}&user%5Bremember_me%5D=1&commit=Log+In`,
      { method: "POST", headers: { "sec-fetch-mode": "navigate", origin: "https://archiveofourown.org" } }
    );
    console.log({ req });
  };
  const ffnLogin: ExternalLoginFormSubmit = async function (username, password) {
    const req = await fetch(
      `https://www.fanfiction.net/login.php?email=${username}&password=${password}&g-recaptcha-response=&notop=0&refer=&state=55d880c41f95c98b4f50336e47bee1c1903170aaa4f0cc325474cc8cee6342d7&remember=1`,
      { method: "POST", mode: "same-origin" }
    );
    console.log({ req });
  };
  const siteData = {
    ao3: { siteName: "AO3", label: "Archive of Our Own", session: user.sessions.ao3, onSubmit: ao3Login },
    ffn: { siteName: "FFN", label: "FanFiction.Net", session: user.sessions.ffn, onSubmit: ffnLogin },
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
