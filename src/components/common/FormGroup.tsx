import React from "react";
import classnames from "classnames";

type Props = {
  label?: string;
  error?: string | undefined;
  className?: string;
  children: React.ReactNode;
};

const FormGroup: React.FC<Props> = ({ children, label, error, className }) => {
  return (
    <div className={classnames("flex flex-col", className)}>
      {!!label && <label className="mb-1 text-sm">{label}</label>}
      {children}
      {error && <small className="p-error h-0">{error}</small>}
    </div>
  );
};

export default FormGroup;
