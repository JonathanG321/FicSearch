import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FormEventHandler, useState } from "react";
import FormGroup from "./common/FormGroup";

/* eslint-disable @typescript-eslint/no-unused-vars */
type Session = string;

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

function LoginForm(onSubmit: FormEventHandler<HTMLFormElement>) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form onSubmit={onSubmit}>
      <FormGroup label="Username">
        <InputText value={username} name="username" onChange={(e) => setUsername(e.target.value)} />
      </FormGroup>
      <FormGroup label="Password">
        <InputText value={password} name="password" onChange={(e) => setPassword(e.target.value)} />
      </FormGroup>
      <Button value="Login" type="submit" />
    </form>
  );
}

function IconDisplay(sessionValid: boolean) {
  return sessionValid ? (
    <i className="mr-2 flex h-4 w-4 items-center rounded-full border-2 border-black bg-green-600" />
  ) : (
    <i className="mr-2 flex h-4 w-4 items-center rounded-full border-2 border-black bg-red-600" />
  );
}

function SessionDisplay(
  siteName: string,
  session: Session,
  setSiteInfo: (siteInfo: boolean) => void,
  siteInfo: boolean
) {
  return (
    <div
      onClick={(_) => setSiteInfo(!siteInfo)}
      className="flex h-full items-center border-r-2 px-4 hover:cursor-pointer hover:bg-blue-400"
    >
      <div className="flex items-center">{IconDisplay(!!session)}</div>
      <span className="flex items-center font-bold">{siteName}</span>
      <div className={siteInfo ? "absolute top-5" : "hidden"}>test</div>
    </div>
  );
}

function NavBar({ user }: NavBarType) {
  const [ao3SiteInfo, setAO3SiteInfo] = useState(false);
  const [ffnSiteInfo, setFFNSiteInfo] = useState(false);
  const [qqSiteInfo, setQQSiteInfo] = useState(false);
  const [sbSiteInfo, setSBSiteInfo] = useState(false);
  const [svSiteInfo, setSVSiteInfo] = useState(false);
  return (
    <div className="sticky top-0 flex h-10 items-center justify-between border-b-2 bg-blue-300">
      <h1 className="px-3 font-bold">FicSearch</h1>
      <div className="flex h-full items-center">
        <div className="flex h-full items-center border-x-2 px-4 font-bold">{user.username}</div>
        {SessionDisplay("AO3", user.sessions.ao3, setAO3SiteInfo, ao3SiteInfo)}
        {SessionDisplay("FFN", user.sessions.ffn, setFFNSiteInfo, ffnSiteInfo)}
        {SessionDisplay("QQ", user.sessions.qq, setQQSiteInfo, qqSiteInfo)}
        {SessionDisplay("SB", user.sessions.sb, setSBSiteInfo, sbSiteInfo)}
        {SessionDisplay("SV", user.sessions.sv, setSVSiteInfo, svSiteInfo)}
      </div>
    </div>
  );
}

export default NavBar;
