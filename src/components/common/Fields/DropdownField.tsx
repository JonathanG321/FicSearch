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
  filter?: boolean;
}

function DropdownField<T>({
  fieldPath,
  label,
  options,
  placeholder,
  onChange,
  getFieldMeta,
  filter = true,
}: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames("w-fill relative mx-2 mb-3 last:mr-0")}>
      <FormGroup error={touched ? error : undefined} label={label}>
        <Dropdown
          id={fieldPath}
          name={fieldPath}
          value={value}
          filter={filter}
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
