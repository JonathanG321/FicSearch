import { type ChangeEventHandler } from "react";

export type InputType = { value: string; onChange: ChangeEventHandler<HTMLInputElement>; fieldName: string };

function Input({ value, onChange, fieldName }: InputType) {
  return (
    <div>
      <label htmlFor={fieldName}>{fieldName}</label>
      <input name={fieldName} onChange={onChange} className="rounded border px-2 py-1" value={value} />
    </div>
  );
}

export default Input;
