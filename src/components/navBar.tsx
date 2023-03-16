import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { type FormEvent, useState, type SetStateAction, type Dispatch } from "react";
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

type LoginFormSubmit = (e: FormEvent<HTMLFormElement>, username: string, password: string) => void;

function LoginForm({ onSubmit }: { onSubmit: LoginFormSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Card className="hover:cursor-default">
      <form onSubmit={(e) => onSubmit(e, username, password)}>
        <FormGroup label="Username">
          <InputText value={username} name="username" onChange={(e) => setUsername(e.target.value)} />
        </FormGroup>
        <FormGroup className="mb-4" label="Password">
          <InputText value={password} name="password" onChange={(e) => setPassword(e.target.value)} />
        </FormGroup>
        <Button type="submit">Login</Button>
      </form>
    </Card>
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
  showSiteInfo: boolean,
  onSubmit: LoginFormSubmit
) {
  return (
    <div
      onClick={(_) => setSiteInfo(!showSiteInfo)}
      className="flex h-full items-center border-r-2 px-4 hover:cursor-pointer hover:bg-blue-400"
    >
      <div className="flex items-center">{IconDisplay(!!session)}</div>
      <span className="flex items-center font-bold">{siteName}</span>
      <div className={showSiteInfo ? "absolute top-5" : "hidden"}>
        <LoginForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}

function NavBar({ user }: NavBarType) {
  const [ao3SiteInfo, setAO3SiteInfo] = useState(false);
  const [ffnSiteInfo, setFFNSiteInfo] = useState(false);
  const [qqSiteInfo, setQQSiteInfo] = useState(false);
  const [sbSiteInfo, setSBSiteInfo] = useState(false);
  const [svSiteInfo, setSVSiteInfo] = useState(false);

  // function handleClick(setState: Dispatch<SetStateAction<boolean>>, state: boolean) {
  //   if (!state) {
  //     document.addEventListener("click", handleOutsideClick, false);
  //   } else {
  //     document.removeEventListener("click", handleOutsideClick, false);
  //   }
  //   setState(!state);
  // }
  // function handleOutsideClick(e: MouseEvent, setState: Dispatch<SetStateAction<boolean>>, state: boolean) {
  //   if (!this.node.contains(e.target)) handleClick(setState, state);
  // }

  const ao3Login: LoginFormSubmit = function (e, username, password) {
    console.log({ username, password });
  };
  return (
    <div className="sticky top-0 flex h-10 items-center justify-between border-b-2 bg-blue-300">
      <h1 className="px-3 font-bold">FicSearch</h1>
      <div className="flex h-full items-center">
        <div className="flex h-full items-center border-x-2 px-4 font-bold">{user.username}</div>
        {SessionDisplay("AO3", user.sessions.ao3, setAO3SiteInfo, ao3SiteInfo, ao3Login)}
        {SessionDisplay("FFN", user.sessions.ffn, setFFNSiteInfo, ffnSiteInfo, ao3Login)}
        {SessionDisplay("QQ", user.sessions.qq, setQQSiteInfo, qqSiteInfo, ao3Login)}
        {SessionDisplay("SB", user.sessions.sb, setSBSiteInfo, sbSiteInfo, ao3Login)}
        {SessionDisplay("SV", user.sessions.sv, setSVSiteInfo, svSiteInfo, ao3Login)}
      </div>
    </div>
  );
}

export default NavBar;
