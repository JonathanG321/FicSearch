import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { type FormEvent, useState, type MouseEvent } from "react";
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

type ShowSiteInfo = { ao3: boolean; ffn: boolean; qq: boolean; sb: boolean; sv: boolean };
const defaultShowSiteInfo = { ao3: false, ffn: false, qq: false, sb: false, sv: false };

type LoginFormSubmit = (e: FormEvent<HTMLFormElement>, username: string, password: string) => void;

function LoginForm({ onSubmit, label }: { onSubmit: LoginFormSubmit; label: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Card
      className="z-50 hover:cursor-default"
      header={<div className="mt-3 flex justify-center">{label}</div>}
    >
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
  setShowSiteInfo: (siteInfo: ShowSiteInfo) => void,
  showSiteInfo: ShowSiteInfo,
  onSubmit: LoginFormSubmit,
  label: string
) {
  function clickListener() {
    setShowSiteInfo(defaultShowSiteInfo);
    document.removeEventListener("click", clickListener);
  }
  function handleClick(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();

    setShowSiteInfo({ ...defaultShowSiteInfo, [siteName.toLowerCase()]: true });
    document.addEventListener("click", clickListener);
    e.stopPropagation();
    // setShowSiteInfo({ showModal: true }, () => {
    //   document.addEventListener("click", this.closeMenu);
    // });
  }
  return (
    <>
      <div
        onClick={handleClick}
        className={`flex h-full items-center border-r-2 px-4 hover:cursor-pointer hover:bg-blue-400 ${label}`}
      >
        <div className="flex items-center">{IconDisplay(!!session)}</div>
        <span className="flex items-center font-bold">{siteName}</span>
      </div>
      <div
        className={
          showSiteInfo[siteName.toLowerCase() as keyof ShowSiteInfo] ? "absolute top-10 right-0" : "hidden"
        }
      >
        <LoginForm onSubmit={onSubmit} label={label} />
      </div>
    </>
  );
}

function NavBar({ user }: NavBarType) {
  const [showSiteInfo, setShowSiteInfo] = useState(defaultShowSiteInfo);
  const ao3Login: LoginFormSubmit = function (e, username, password) {
    console.log({ username, password });
  };
  return (
    <div className="sticky top-0 flex h-10 items-center justify-between border-b-2 bg-blue-300">
      <h1 className="px-3 font-bold">FicSearch</h1>
      <div className="flex h-full items-center">
        <div className="flex h-full items-center border-x-2 px-4 font-bold">{user.username}</div>
        {SessionDisplay(
          "AO3",
          user.sessions.ao3,
          setShowSiteInfo,
          showSiteInfo,
          ao3Login,
          "Archive of Our Own"
        )}
        {SessionDisplay("FFN", user.sessions.ffn, setShowSiteInfo, showSiteInfo, ao3Login, "FanFiction.Net")}
        {SessionDisplay(
          "QQ",
          user.sessions.qq,
          setShowSiteInfo,
          showSiteInfo,
          ao3Login,
          "Questionable Questing"
        )}
        {SessionDisplay("SB", user.sessions.sb, setShowSiteInfo, showSiteInfo, ao3Login, "Space Battles")}
        {SessionDisplay(
          "SV",
          user.sessions.sv,
          setShowSiteInfo,
          showSiteInfo,
          ao3Login,
          "Sufficient Velocity"
        )}
      </div>
    </div>
  );
}

export default NavBar;
