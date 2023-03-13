export type NavBarType = {
  user: {
    username: string;
    sessions: {
      ao3: string;
      ffn: string;
      sb: string;
      sv: string;
      qq: string;
    };
  };
};

function NavBar({ user }: NavBarType) {
  return (
    <div className="sticky top-0 flex h-10 items-center justify-between border-b-2 bg-blue-400">
      <h1 className="px-3">FicSearch</h1>
      <div className="pr-3">
        <span>{user.username}</span>
      </div>
    </div>
  );
}

export default NavBar;
