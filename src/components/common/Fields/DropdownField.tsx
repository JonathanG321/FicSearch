/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { type CommonFormFunctions } from "../../../types/forms";
import { isFormFieldValid } from "../../../utils/formUtils";
import FormGroup from "../FormGroup";

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
  options: { value: any; label: string }[];
  placeholder?: string;
}

function DropdownField<T>({
  fieldPath,
  label,
  options,
  placeholder,
  onChange,
  getFieldMeta,
  disabled = false,
}: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames("relative mr-4 mb-3 w-full pt-2 last:mr-0")}>
      <FormGroup error={touched ? error : undefined} label={label}>
        <Dropdown
          id={fieldPath}
          name={fieldPath}
          value={value}
          filter
          disabled={disabled}
          filterBy="label"
          emptyFilterMessage="Filter"
          options={options}
          placeholder={placeholder}
          className={classNames("text-sm", {
            "p-invalid": isFormFieldValid(touched, error),
          })}
          onChange={(e) => onChange(e, fieldPath)}
        />
      </FormGroup>
    </div>
  );
}

export default DropdownField;