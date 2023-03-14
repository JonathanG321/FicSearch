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

function iconDisplay(sessionValid: boolean) {
  return sessionValid ? (
    <i className="mr-2 flex h-4 w-4 items-center rounded-full border-2 border-black bg-green-600" />
  ) : (
    <i className="mr-2 flex h-4 w-4 items-center rounded-full border-2 border-black bg-red-600" />
  );
}

function sessionDisplay(siteName: string, session: Session) {
  return (
    <div className="flex h-full items-center border-r-2 px-4">
      <div className="flex items-center">{iconDisplay(!!session)}</div>
      <span className="flex items-center font-bold">{siteName}</span>
    </div>
  );
}

function NavBar({ user }: NavBarType) {
  return (
    <div className="sticky top-0 flex h-10 items-center justify-between border-b-2 bg-blue-300">
      <h1 className="px-3 font-bold">FicSearch</h1>
      <div className="flex h-full items-center">
        <div className="flex h-full items-center border-x-2 px-4 font-bold">{user.username}</div>
        {sessionDisplay("AO3", user.sessions.ao3)}
        {sessionDisplay("FFN", user.sessions.ffn)}
        {sessionDisplay("QQ", user.sessions.qq)}
        {sessionDisplay("SB", user.sessions.sb)}
        {sessionDisplay("SV", user.sessions.sv)}
      </div>
    </div>
  );
}

export default NavBar;
