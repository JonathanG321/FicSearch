export type InputType = { value: string; onChange: () => void };

function Input({ value, onChange }: InputType) {
  return <input onChange={onChange} className="rounded border px-2 py-1" value={value} />;
}

export default Input;
