/* eslint-disable react/function-component-definition */
import classNames from "classnames";
import { Checkbox } from "primereact/checkbox";
import { type CommonFormFunctions } from "../../../types/forms";
import { isFormFieldValid } from "../../../utils/formUtils";

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
}

function CheckboxField<T>({ fieldPath, label, onChange, getFieldMeta, disabled = false }: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames("field-checkbox relative my-4", { "hover:cursor-default": disabled })}>
      <Checkbox
        inputId={fieldPath}
        name={fieldPath}
        checked={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(
            {
              target: {
                name: e.target.name,
                value: e.checked,
              } /* passing through e directly does not work */,
            },
            fieldPath
          )
        }
        className={classNames("mr-2", {
          "p-invalid": isFormFieldValid(touched, error),
          "hover:cursor-default": disabled,
        })}
      />
      <label htmlFor={fieldPath} className={classNames({ "p-error": isFormFieldValid(touched, error) })}>
        {label}
      </label>
      {error && touched && <small className="p-error h-0">{error}</small>}
    </div>
  );
}

export default CheckboxField;
