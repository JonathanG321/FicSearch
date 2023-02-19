/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearch } from "../hooks/useSearch";
import { SearchForm, type SearchSchema } from "../utils/search/schema";
import { type CommonFormFunctions } from "../types/forms";
import TextField from "./common/Fields/TextField";
import NumberField from "./common/Fields/NumberField";
import SelectField from "./common/Fields/SelectField";
import { languages } from "../utils/languages";
import ChipField from "./common/Fields/ChipField";
import { SearchProvider } from "../contexts/SearchContext";
import { useState } from "react";
import { createBlankSearch } from "../utils/search/createBlankSearch";

export type SearchFormType = { test: string };

function SearchForm({}: SearchFormType) {
  const [localSearch, setLocalSearch] = useState<SearchForm>(createBlankSearch);
  const {
    rawValues,
    setFieldValue,
    handleSubmit,
    getFieldHelpers,
    handleChange,
    setOnFocusValue,
    getFieldMeta,
  } = useSearch();
  const handleFocus = ({ target }: { target: { value: any } }) => {
    setOnFocusValue(target.value);
  };
  function onChange(e: any, path: keyof SearchSchema) {
    const { setTouched: setFieldTouched } = getFieldHelpers(path);
    setFieldTouched(true);
    if (e && e.target && e.target.value && typeof e.target.value === "number") {
      setFieldValue(path, e.target.value);
    } else {
      handleChange(e);
    }
  }
  const commonFormFunctions: CommonFormFunctions<SearchSchema> = {
    rawValues,
    onChange,
    handleFocus,
    getFieldHelpers,
    getFieldMeta,
  };
  return (
    <div className="text-white">
      <SearchProvider search={localSearch} updateSearch={setLocalSearch}>
        <form onSubmit={handleSubmit}>
          <h2 className="mb-2 text-2xl">Universal</h2>
          <div className="mb-4 flex rounded border p-4">
            <TextField<SearchSchema> {...commonFormFunctions} label="Key Words" fieldPath="keyWords" />
            <ChipField<SearchSchema> {...commonFormFunctions} label="Tags" fieldPath="tags" />
          </div>
          <h2 className="mb-2 text-2xl">Space Battles</h2>
          <div className="mb-4 flex rounded border p-4">
            <ChipField<SearchSchema> {...commonFormFunctions} label="Exclude Tags" fieldPath="excludeTags" />
            <NumberField<SearchSchema> {...commonFormFunctions} label="Replies" fieldPath="replies" />
            <ChipField<SearchSchema> {...commonFormFunctions} label="Users" fieldPath="users" />
          </div>
          <h2 className="mb-2 text-2xl">Archive of Our Own</h2>
          <div className="mb-4 flex rounded border p-4">
            <SelectField<SearchSchema>
              {...commonFormFunctions}
              options={languages.map((language) => ({
                label: language,
                value: language.toLowerCase().replaceAll(" ", ""),
              }))}
              label="Language"
              fieldPath="language"
            />
          </div>
        </form>
      </SearchProvider>
    </div>
  );
}

export default SearchForm;
