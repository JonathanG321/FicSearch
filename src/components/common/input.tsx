import { type ChangeEventHandler } from "react";
import { type AO3Search, type SpaceBattlesSearch } from "../../types/search";

export type InputType = {
  value?: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  fieldName: keyof AO3Search | keyof SpaceBattlesSearch;
  fieldText: string;
  type?: string;
};

function Input({ value = "", onChange, fieldName, fieldText, type = "input" }: InputType) {
  return (
    <div className="flex flex-col">
      <label className="hidden" htmlFor={fieldName}>
        {fieldText}
      </label>
      {type === "input" && (
        <input
          name={fieldName}
          onChange={onChange}
          className="rounded border px-2 py-1 text-black"
          value={value}
          placeholder={fieldText}
        />
      )}
      {type === "select" && (
        <select
          name={fieldName}
          onChange={onChange}
          className="rounded border px-2 py-1 text-black"
          multiple
          value={value}
          placeholder={fieldText}
        />
      )}
    </div>
  );
}

export default Input;
