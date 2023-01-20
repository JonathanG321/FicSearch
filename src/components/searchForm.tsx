import Input from "./common/input";
import { type AO3Search, type SpaceBattlesSearch } from "../types/search";
import { useState } from "react";

export type SearchFormType = { test: string };

function SearchForm({}: SearchFormType) {
  const [] = useState<AO3Search | SpaceBattlesSearch>({ anyField: "" });
  return (
    <div>
      <Input value="test" onChange={() => undefined} />
    </div>
  );
}

export default SearchForm;
