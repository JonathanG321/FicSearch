/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearch } from "../hooks/useSearch";
import { type SearchSchema } from "../utils/search/schema";
import { type CommonFormFunctions } from "../types/forms";
import { Card } from "primereact/card";
import TextField from "./common/Fields/TextField";
import NumberField from "./common/Fields/NumberField";
import { languages } from "../utils/languages";
import ChipField from "./common/Fields/ChipField";
import DropdownField from "./common/Fields/DropdownField";
import CalendarField from "./common/Fields/CalendarField";

export type SearchFormType = { test: string };

function SearchForm({}: SearchFormType) {
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
    <div className="py-10 text-white">
      <form onSubmit={handleSubmit}>
        <h2 className="mb-2 text-2xl">Universal</h2>
        <Card className="w-full bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <TextField<SearchSchema> {...commonFormFunctions} label="Key Words" fieldPath="keyWords" />
          <ChipField<SearchSchema> {...commonFormFunctions} label="Tags" fieldPath="tags" />
          <CalendarField<SearchSchema> {...commonFormFunctions} label="Older Than" fieldPath="olderThan" />
          <CalendarField<SearchSchema> {...commonFormFunctions} label="Newer Than" fieldPath="newerThan" />
        </Card>
        <h2 className="my-2 text-2xl">Space Battles</h2>
        <Card className="w-full bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <ChipField<SearchSchema> {...commonFormFunctions} label="Exclude Tags" fieldPath="excludeTags" />
          <NumberField<SearchSchema> {...commonFormFunctions} label="Replies" fieldPath="replies" />
          <ChipField<SearchSchema> {...commonFormFunctions} label="Users" fieldPath="users" />
        </Card>
        <h2 className="my-2 text-2xl">Archive of Our Own</h2>
        <Card className="w-full bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <DropdownField<SearchSchema>
            {...commonFormFunctions}
            options={languages.map((language) => ({
              label: language,
              value: language.toLowerCase(),
            }))}
            label="Language"
            fieldPath="language"
          />
        </Card>
      </form>
    </div>
  );
}

export default SearchForm;
