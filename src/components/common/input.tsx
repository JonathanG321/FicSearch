export type InputType = { value: string };

function Input({ value }: InputType) {
  return <input className="rounded border px-2 py-1" value={value} />;
}

export default Input;
