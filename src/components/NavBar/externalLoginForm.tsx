import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { type FormEvent, useState } from "react";
import FormGroup from "../common/FormGroup";

export type ExternalLoginFormSubmit = (
  e: FormEvent<HTMLFormElement>,
  username: string,
  password: string
) => void;

function ExternalLoginForm({ onSubmit, label }: { onSubmit: ExternalLoginFormSubmit; label: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Card
      className={`z-50 hover:cursor-default sub${label.replace(/ /g, "").replace(".", "")}`}
      header={<div className="mt-3 flex justify-center">{label}</div>}
    >
      <form onSubmit={(e) => onSubmit(e, username, password)}>
        <FormGroup label="Username">
          <InputText value={username} name="username" onChange={(e) => setUsername(e.target.value)} />
        </FormGroup>
        <FormGroup className="mb-4" label="Password">
          <InputText value={password} name="password" onChange={(e) => setPassword(e.target.value)} />
        </FormGroup>
        <Button type="submit">Login</Button>
      </form>
    </Card>
  );
}

export default ExternalLoginForm;
