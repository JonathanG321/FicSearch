/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from "classnames";
import { MultiStateCheckbox, type MultiStateCheckboxOption } from "primereact/multistatecheckbox";
import { type CommonFormFunctions } from "../../../types/forms";
import { isFormFieldValid } from "../../../utils/formUtils";

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  options: any[] | MultiStateCheckboxOption[] | undefined;
  label?: string;
}

function MultiStateCheckboxField<T>({ fieldPath, label, onChange, getFieldMeta, options }: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames("field-checkbox relative mx-2 my-4")}>
      <MultiStateCheckbox
        name={fieldPath}
        value={value}
        options={options}
        optionValue="value"
        onChange={(e) => onChange(e, fieldPath)}
        className={classNames("mr-2", {
          "p-invalid": isFormFieldValid(touched, error),
        })}
      />
      <label htmlFor={fieldPath} className={classNames({ "p-error": isFormFieldValid(touched, error) })}>
        {label}
      </label>
      {error && touched && <small className="p-error h-0">{error}</small>}
    </div>
  );
}

export default MultiStateCheckboxField;
