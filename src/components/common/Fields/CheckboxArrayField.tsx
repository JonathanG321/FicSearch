import classNames from "classnames";
import { Checkbox, type CheckboxChangeEvent } from "primereact/checkbox";
import { type CommonFormFunctions } from "../../../types/forms";
import { isFormFieldValid } from "../../../utils/formUtils";

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  vertical?: boolean;
  options: { label: string; value: string }[];
}

function CheckboxArrayField<T>({ fieldPath, onChange, getFieldMeta, vertical, options }: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);

  function isCheckedOnEvent(e: CheckboxChangeEvent) {
    return !!e.checked;
  }

  function handleChange(e: CheckboxChangeEvent, option: { label: string; value: string }) {
    let newValue: string[] = value;
    if (isCheckedOnEvent(e)) {
      newValue = newValue.concat([option.value]);
    } else {
      newValue = newValue.filter((val: string) => val !== option.value);
    }
    const newEvent = { target: { name: fieldPath, value: newValue } };

    onChange(newEvent, fieldPath);
  }

  return (
    <div className={classNames({ flex: !vertical })}>
      {error && touched && <small className="p-error h-0">{error}</small>}
      {options.map((option, i) =>
        option.value !== "" ? (
          <div
            key={option.label}
            className={classNames("field-checkbox mx-2 my-4", {
              "ml-0 mb-2 first:mt-0 last:mb-0": vertical,
            })}
          >
            <Checkbox
              inputId={`${fieldPath}[${i}]`}
              name={`${fieldPath}[${i}]`}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(e, option)}
              className={classNames("mr-2", {
                "p-invalid": isFormFieldValid(touched, error),
              })}
            />
            <div className="relative inline">
              <label
                htmlFor={`${fieldPath}[${i}]`}
                className={classNames({ "p-error": isFormFieldValid(touched, error) })}
              >
                {option.label}
              </label>
            </div>
          </div>
        ) : undefined
      )}
    </div>
  );
}

export default CheckboxArrayField;
