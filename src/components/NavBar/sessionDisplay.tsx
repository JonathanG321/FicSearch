import { type MouseEvent, useState } from "react";
import { type Session } from "../../types/sessions";
import ExternalLoginForm, { type ExternalLoginFormSubmit } from "./externalLoginForm";

function IconDisplay(sessionValid: boolean) {
  const bgColor = sessionValid ? "bg-green-600" : "bg-red-600";
  return <i className={`mr-2 flex h-4 w-4 items-center rounded-full border-2 border-black ${bgColor}`} />;
}

type SessionDisplayArgs = {
  siteName: string;
  label: string;
  session: Session;
  onSubmit: ExternalLoginFormSubmit;
};

function SessionDisplay({ siteName, label, session, onSubmit }: SessionDisplayArgs) {
  const [showSiteInfo, setShowSiteInfo] = useState(false);
  function clickListener(e: globalThis.MouseEvent) {
    const formNode = document.querySelector(`.sub${label.replace(/ /g, "").replace(".", "")}`);
    const siteLabelNode = document.querySelector(`.${label.replace(/ /g, "").replace(".", "")}`);
    if (
      e.target instanceof Node &&
      formNode &&
      !formNode?.contains(e.target) &&
      !siteLabelNode?.contains(e.target)
    ) {
      setShowSiteInfo(false);
      document.removeEventListener("click", clickListener);
    }
  }
  function handleClick(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setShowSiteInfo(true);
    document.addEventListener("click", clickListener);
  }
  return (
    <>
      <div
        onClick={handleClick}
        className={`flex h-full items-center border-r-2 px-4 hover:cursor-pointer hover:bg-blue-400 ${label
          .replace(/ /g, "")
          .replace(".", "")}`}
      >
        <div className="flex items-center">{IconDisplay(!!session)}</div>
        <span className="flex items-center font-bold">{siteName}</span>
      </div>
      <div className={showSiteInfo ? "absolute top-10 right-0" : "hidden"}>
        <ExternalLoginForm onSubmit={onSubmit} label={label} />
      </div>
    </>
  );
}

export default SessionDisplay;
