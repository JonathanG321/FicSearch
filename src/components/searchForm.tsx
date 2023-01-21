import Input from "./common/input";
import { type AO3Search, type SpaceBattlesSearch } from "../types/search";
import { useState } from "react";

export type SearchFormType = { test: string };

function SearchForm({}: SearchFormType) {
  const [AO3Data, setAO3Data] = useState<AO3Search>({});
  const [SpaceBattlesData, setSpaceBattlesData] = useState<SpaceBattlesSearch>({});
  return (
    <div>
      <h3>AO3 Search</h3>
      <div className="rounded border p-4">
        <Input
          fieldName="anyField"
          value="test"
          onChange={(e) => setAO3Data({ ...AO3Data, anyField: e.currentTarget.value })}
        />
      </div>
    </div>
  );
}

export default SearchForm;
