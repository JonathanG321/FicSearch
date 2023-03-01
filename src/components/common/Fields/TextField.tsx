import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { isEqual } from "lodash";
import { InputText } from "primereact/inputtext";
import { type CommonFormFunctions } from "../../../types/forms";
import { isFormFieldValid } from "../../../utils/formUtils";
import FormGroup from "../FormGroup";

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
  placeholder?: string;
  iconLocation?: "left" | "right";
  icon?: string;
}

function TextField<T>({
  fieldPath,
  label,
  placeholder,
  iconLocation,
  icon,
  handleFocus,
  onChange,
  getFieldMeta,
}: Props<T>) {
  const { error: fieldError, touched: fieldTouched, value: fieldValue } = getFieldMeta(fieldPath);

  const [{ error, touched, value }, setState] = useState({
    error: fieldError,
    touched: fieldTouched,
    value: fieldValue,
  });

  useEffect(() => {
    setState({ error: fieldError, touched: fieldTouched, value: fieldValue });
  }, [fieldError, fieldTouched, fieldValue]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value: newVal } = event.target;
    setState((oldState) => ({ ...oldState, value: newVal }));
    onChange(event, fieldPath);
  };

  return (
    <div className={classNames("mr-4 mb-3 w-full last:mr-0")}>
      <FormGroup error={touched ? error : undefined} label={label}>
        <div
          className={classNames("flex w-full items-center", {
            "p-input-icon-left": iconLocation === "left",
            "p-input-icon-right": iconLocation === "right",
          })}
        >
          {!!icon && !!iconLocation && <i className={classNames("pi", icon)} />}
          <InputText
            id={fieldPath}
            name={fieldPath}
            value={value || ""}
            placeholder={placeholder}
            onFocus={handleFocus}
            className={classNames("w-full text-sm", {
              "p-invalid": isFormFieldValid(touched, error),
              "pl-8": !!icon && !!iconLocation,
            })}
            onChange={handleChange}
          />
        </div>
      </FormGroup>
    </div>
  );
}

export default React.memo(TextField, (prevProps, nextProps) => {
  const prevData = prevProps.getFieldMeta(prevProps.fieldPath);
  const nextData = nextProps.getFieldMeta(nextProps.fieldPath);
  return isEqual(prevData, nextData);
}) as typeof TextField;
