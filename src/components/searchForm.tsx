import Input from "./common/input";
import { type AO3Search, type SpaceBattlesSearch } from "../types/search";
import { useState } from "react";

export type SearchFormType = { test: string };

function SearchForm({}: SearchFormType) {
  const [AO3Data, setAO3Data] = useState<AO3Search>({});
  const [SpaceBattlesData, setSpaceBattlesData] = useState<SpaceBattlesSearch>({});
  return (
    <div className="text-white">
      <h2 className="mb-2 text-2xl">Universal</h2>
      <div className="mb-4 rounded border p-4">
        <Input
          fieldName="keyWords"
          fieldText="Key Words"
          value={AO3Data.anyField || SpaceBattlesData.keyWords}
          onChange={(e) => {
            setAO3Data({ ...AO3Data, anyField: e.currentTarget.value });
            setSpaceBattlesData({ ...SpaceBattlesData, keyWords: e.currentTarget.value });
          }}
        />
      </div>
    </div>
  );
}

export default SearchForm;
