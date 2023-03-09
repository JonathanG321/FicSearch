/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearch } from "../hooks/useSearch";
import { type SearchSchema } from "../utils/search/schema";
import { type CommonFormFunctions } from "../types/forms";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import TextField from "./common/Fields/TextField";
import NumberField from "./common/Fields/NumberField";
import { languages } from "../utils/languages";
import ChipField from "./common/Fields/ChipField";
import DropdownField from "./common/Fields/DropdownField";
import CalendarField from "./common/Fields/CalendarField";
import CheckboxField from "./common/Fields/CheckboxField";
import MultiStateCheckboxField from "./common/Fields/MultiStateCheckboxField";
import { sortByOptions } from "../utils/ao3";

function SearchForm() {
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

  function onChangeMulti(e: any, paths: (keyof SearchSchema)[]) {
    paths.forEach((path) => {
      const { setTouched: setFieldTouched } = getFieldHelpers(path);
      setFieldTouched(true);
      setFieldValue(path, e.target.value);
    });
  }

  function onChangeTuple(e: any, path: keyof SearchSchema, order: "min" | "max") {
    const { setTouched: setFieldTouched } = getFieldHelpers(path);
    const otherValue = rawValues[path];
    setFieldTouched(true);
    if (otherValue && Array.isArray(otherValue) && order === "min") {
      setFieldValue(path, [e.target.value, otherValue[1]]);
    } else if (otherValue && Array.isArray(otherValue) && order === "max") {
      setFieldValue(path, [otherValue[0], e.target.value]);
    } else {
      setFieldValue(path, rawValues[path]);
    }
  }

  const commonFormFunctions: CommonFormFunctions<SearchSchema> = {
    rawValues,
    onChange,
    handleFocus,
    getFieldHelpers,
    getFieldMeta,
  };

  const crossoversLabel =
    rawValues.crossovers === null
      ? "Include Crossovers"
      : rawValues.crossovers === "T"
      ? "Only Crossovers"
      : "No Crossovers";
  const completionLabel =
    rawValues.completionStatus === null
      ? "All Works"
      : rawValues.completionStatus === "T"
      ? "Only Complete Works"
      : "Only In Progress Works";

  return (
    <div className="w-9/12 py-10 text-white lg:w-9/12">
      <form onSubmit={handleSubmit}>
        <h2 className="mb-2 text-2xl">Universal</h2>
        <Card className="w-full bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <TextField<SearchSchema>
            {...commonFormFunctions}
            label="Key Words"
            fieldPath="keyWords"
            onChange={(e) => onChangeMulti(e, ["anyField", "keyWords"])}
          />
          <TextField<SearchSchema> {...commonFormFunctions} label="Title" fieldPath="title" />
          <ChipField<SearchSchema>
            {...commonFormFunctions}
            label="Authors"
            fieldPath="users"
            onChange={(e) => {
              const { setTouched: setFieldTouched1 } = getFieldHelpers("users");
              const { setTouched: setFieldTouched2 } = getFieldHelpers("author");
              setFieldTouched1(true);
              setFieldTouched2(true);
              setFieldValue("users", e.target.value);
              setFieldValue("author", e.target.value[0] || "");
            }}
          />
          <ChipField<SearchSchema> {...commonFormFunctions} label="Tags" fieldPath="tags" />
          <div className="flex">
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              label="Word Count"
              placeholder="Lower"
              fieldPath="wordCountLower"
              onChange={(e) => {
                const { setTouched: setFieldTouched1 } = getFieldHelpers("wordCountLower");
                const { setTouched: setFieldTouched2 } = getFieldHelpers("wordCount");
                setFieldTouched1(true);
                setFieldTouched2(true);
                setFieldValue("wordCountLower", e.target.value);
                setFieldValue("wordCount", [
                  e.target.value,
                  rawValues.wordCount ? rawValues.wordCount[1] : undefined,
                ]);
              }}
            />
            <span className="flex flex-col justify-center text-center text-5xl"> - </span>
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              label=" "
              placeholder="Upper"
              fieldPath="wordCountUpper"
              onChange={(e) => {
                const { setTouched: setFieldTouched1 } = getFieldHelpers("wordCountUpper");
                const { setTouched: setFieldTouched2 } = getFieldHelpers("wordCount");
                setFieldTouched1(true);
                setFieldTouched2(true);
                setFieldValue("wordCountUpper", e.target.value);
                setFieldValue("wordCount", [
                  rawValues.wordCount ? rawValues.wordCount[0] : undefined,
                  e.target.value,
                ]);
              }}
            />
          </div>
        </Card>
        <h2 className="my-2 text-2xl">Space Battles</h2>
        <Card className="w-full bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <ChipField<SearchSchema> {...commonFormFunctions} label="Exclude Tags" fieldPath="excludeTags" />
          <div className="flex">
            <CalendarField<SearchSchema> {...commonFormFunctions} label="Older Than" fieldPath="olderThan" />
            <CalendarField<SearchSchema> {...commonFormFunctions} label="Newer Than" fieldPath="newerThan" />
          </div>
          <div className="flex">
            <NumberField<SearchSchema> {...commonFormFunctions} label="Replies" fieldPath="replies" />
            <DropdownField<SearchSchema>
              {...commonFormFunctions}
              options={[
                {
                  label: "Last Update",
                  value: "last_update",
                },
                {
                  label: "Date",
                  value: "date",
                },
                {
                  label: "Relevance",
                  value: "relevance",
                },
                {
                  label: "Words",
                  value: "words",
                },
                {
                  label: "Replies",
                  value: "replies",
                },
              ]}
              filter={false}
              label="Order"
              fieldPath="order"
            />
          </div>
        </Card>
        <h2 className="my-2 text-2xl">Archive of Our Own</h2>
        <Card className="w-full bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <CheckboxField<SearchSchema>
            {...commonFormFunctions}
            label="Search for Oneshots only?"
            fieldPath="singleChapter"
          />
          <div className="flex">
            <span className="mx-2 my-4">Crossovers: </span>
            <MultiStateCheckboxField<SearchSchema>
              {...commonFormFunctions}
              label={crossoversLabel}
              fieldPath="crossovers"
              options={[
                { value: "T", icon: "pi pi-check" },
                { value: "F", icon: "pi pi-times" },
              ]}
            />
          </div>
          <div className="flex">
            <span className="mx-2 my-4">Completion Status: </span>
            <MultiStateCheckboxField<SearchSchema>
              {...commonFormFunctions}
              label={completionLabel}
              fieldPath="completionStatus"
              options={[
                { value: "T", icon: "pi pi-check" },
                { value: "F", icon: "pi pi-times" },
              ]}
            />
          </div>
          <DropdownField<SearchSchema>
            {...commonFormFunctions}
            options={languages.map((language) => ({
              label: language,
              value: language.toLowerCase(),
            }))}
            label="Language"
            fieldPath="language"
          />
          <ChipField<SearchSchema> {...commonFormFunctions} label="Fandoms" fieldPath="fandoms" />
          <div className="flex">
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              min={1}
              max={5}
              label="Min Rating"
              fieldPath="rating"
              useForceValue
              forceValue={Array.isArray(rawValues.rating) ? rawValues.rating[0] : null}
              onChange={(e) => onChangeTuple(e, "rating", "min")}
            />
            <span className="flex flex-col justify-center text-center text-5xl"> - </span>
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              min={1}
              max={5}
              label="Max Rating"
              fieldPath="rating"
              useForceValue
              forceValue={Array.isArray(rawValues.rating) ? rawValues.rating[1] : null}
              onChange={(e) => onChangeTuple(e, "rating", "max")}
            />
          </div>
          <div className="flex">
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              label="Min Hits"
              fieldPath="hits"
              useForceValue
              forceValue={Array.isArray(rawValues.hits) ? rawValues.hits[0] : null}
              onChange={(e) => onChangeTuple(e, "hits", "min")}
            />
            <span className="flex flex-col justify-center text-center text-5xl"> - </span>
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              label="Max Hits"
              fieldPath="hits"
              useForceValue
              forceValue={Array.isArray(rawValues.hits) ? rawValues.hits[1] : null}
              onChange={(e) => onChangeTuple(e, "hits", "max")}
            />
          </div>
          <div className="flex">
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              label="Min Kudos"
              fieldPath="kudos"
              useForceValue
              forceValue={Array.isArray(rawValues.kudos) ? rawValues.kudos[0] : null}
              onChange={(e) => onChangeTuple(e, "kudos", "min")}
            />
            <span className="flex flex-col justify-center text-center text-5xl"> - </span>
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              label="Max Kudos"
              fieldPath="kudos"
              useForceValue
              forceValue={Array.isArray(rawValues.kudos) ? rawValues.kudos[1] : null}
              onChange={(e) => onChangeTuple(e, "kudos", "max")}
            />
          </div>
          <div className="flex">
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              label="Min Bookmarks"
              fieldPath="bookmarks"
              useForceValue
              forceValue={Array.isArray(rawValues.bookmarks) ? rawValues.bookmarks[0] : null}
              onChange={(e) => onChangeTuple(e, "bookmarks", "min")}
            />
            <span className="flex flex-col justify-center text-center text-5xl"> - </span>
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              label="Max Bookmarks"
              fieldPath="bookmarks"
              useForceValue
              forceValue={Array.isArray(rawValues.bookmarks) ? rawValues.bookmarks[1] : null}
              onChange={(e) => onChangeTuple(e, "bookmarks", "max")}
            />
          </div>
          <div className="flex">
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              label="Min Comments"
              fieldPath="comments"
              useForceValue
              forceValue={Array.isArray(rawValues.comments) ? rawValues.comments[0] : null}
              onChange={(e) => onChangeTuple(e, "comments", "min")}
            />
            <span className="flex flex-col justify-center text-center text-5xl"> - </span>
            <NumberField<SearchSchema>
              {...commonFormFunctions}
              label="Max Comments"
              fieldPath="comments"
              useForceValue
              forceValue={Array.isArray(rawValues.comments) ? rawValues.comments[1] : null}
              onChange={(e) => onChangeTuple(e, "comments", "max")}
            />
          </div>
          <div className="flex">
            <DropdownField<SearchSchema>
              {...commonFormFunctions}
              options={sortByOptions}
              filter={false}
              label="Sort By"
              fieldPath="sortColumn"
            />
            <DropdownField<SearchSchema>
              {...commonFormFunctions}
              options={[
                {
                  label: "Descending",
                  value: "desc",
                },
                {
                  label: "Ascending",
                  value: "asc",
                },
              ]}
              filter={false}
              label="Sort Direction"
              fieldPath="sortDirection"
            />
            <CalendarField<SearchSchema> {...commonFormFunctions} label="Revised At" fieldPath="revisedAt" />
          </div>
          <ChipField<SearchSchema> {...commonFormFunctions} label="Characters" fieldPath="characters" />
          <ChipField<SearchSchema> {...commonFormFunctions} label="Relationships" fieldPath="relationships" />
        </Card>
        <div className="mt-4 flex justify-center">
          <Button className="block w-full text-center text-3xl font-bold" type="submit">
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
