/* eslint-disable react/function-component-definition */
import classNames from "classnames";
import { Calendar } from "primereact/calendar";
import { CommonFormFunctions } from "../../../types";
import { isFormFieldValid } from "../../../utils/formUtils";
import FormGroup from "../FormGroup";
import UnsavedFieldWarning from "../UnsavedFieldWarning";

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
  placeholder?: string;
}

function CalendarField<T>({
  fieldPath,
  label,
  placeholder,
  disabled = false,
  onChange,
  getFieldMeta,
  unSavedFields,
}: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames("mr-4 mb-3 w-full pt-2 last:mr-0")}>
      <FormGroup error={touched ? error : undefined} label={label}>
        <div className="flex items-center">
          <Calendar
            id={fieldPath}
            name={fieldPath}
            value={new Date(value || "")}
            showIcon
            placeholder={placeholder}
            iconPos="left"
            monthNavigator
            disabled={disabled}
            yearRange="1930:2030"
            yearNavigator
            className={classNames("w-full text-sm", {
              "p-invalid": isFormFieldValid(touched, error),
            })}
            onChange={(e) => {
              // if user types in something that isn't a valid date, do not update
              if (Number.isNaN(Date.parse(e.target.value as any))) {
                return;
              }
              onChange(e, fieldPath);
            }}
          />
          {unSavedFields.includes(fieldPath) && <UnsavedFieldWarning fieldPath={fieldPath} />}
        </div>
      </FormGroup>
    </div>
  );
}

export default CalendarField;
