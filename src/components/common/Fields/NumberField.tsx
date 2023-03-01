import classNames from "classnames";
import { InputNumber, type InputNumberChangeEvent } from "primereact/inputnumber";
import { type CommonFormFunctions } from "../../../types/forms";
import { isFormFieldValid } from "../../../utils/formUtils";
import FormGroup from "../FormGroup";

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
  placeholder?: string;
  iconLocation?: "left" | "right";
  touchedFields?: Extract<keyof T, string>[];
  icon?: string;
  max?: number;
  min?: number;
}

function NumberField<T>({
  fieldPath,
  label,
  placeholder,
  iconLocation,
  icon,
  max,
  min = 0,
  touchedFields,
  handleFocus,
  onChange,
  getFieldMeta,
}: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  const isTouched = touchedFields
    ? touchedFields.some((field: Extract<keyof T, string>) => getFieldMeta(field).touched)
    : touched;
  function numberChange(e: InputNumberChangeEvent) {
    let rangedValue = e.value;
    if (rangedValue && max && rangedValue > max) {
      rangedValue = max;
    } else if (rangedValue && min && rangedValue < min) {
      rangedValue = min;
    }
    onChange(
      {
        ...e.originalEvent,
        target: { ...e.originalEvent.target, value: rangedValue },
      },
      fieldPath
    );
  }
  return (
    <div className={classNames("mr-4 mb-3 w-full last:mr-0")}>
      <FormGroup error={isTouched ? error : undefined} label={label}>
        <div
          className={classNames("w-full", {
            "p-input-icon-left": iconLocation === "left",
            "p-input-icon-right": iconLocation === "right",
          })}
        >
          {!!icon && !!iconLocation && <i className={classNames("pi", icon)} />}
          <InputNumber
            id={fieldPath}
            name={fieldPath}
            value={typeof value === "string" ? parseInt(value.split(",").join(""), 10) : value}
            placeholder={placeholder}
            max={max}
            min={min}
            onFocus={handleFocus}
            className={classNames("w-full text-sm", {
              "p-invalid": isFormFieldValid(isTouched, error),
              "pl-8": !!icon && !!iconLocation,
            })}
            onChange={(e) => numberChange(e)}
          />
        </div>
      </FormGroup>
    </div>
  );
}

export default NumberField;
