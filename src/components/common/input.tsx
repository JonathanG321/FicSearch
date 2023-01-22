import { type ChangeEventHandler } from "react";
import { type AO3Search, type SpaceBattlesSearch } from "../../types/search";

export type InputType = {
  value?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  fieldName: keyof AO3Search | keyof SpaceBattlesSearch;
  fieldText: string;
};

function Input({ value = "", onChange, fieldName, fieldText }: InputType) {
  return (
    <div className="flex flex-col">
      <label className="hidden" htmlFor={fieldName}>
        {fieldText}
      </label>
      <input
        name={fieldName}
        onChange={onChange}
        className="rounded border px-2 py-1 text-black"
        value={value}
        placeholder={fieldText}
      />
    </div>
  );
}

export default Input;
