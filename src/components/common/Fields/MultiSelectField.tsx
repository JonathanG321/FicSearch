/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from "classnames";
import { MultiSelect } from "primereact/multiselect";
import { type CommonFormFunctions } from "../../../types/forms";
import { isFormFieldValid } from "../../../utils/formUtils";
import FormGroup from "../FormGroup";

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
  options: { value: any; label: string }[];
  selectAll?: boolean;
  placeholder?: string;
}

function MultiSelectField<T>({
  fieldPath,
  label,
  options,
  placeholder,
  onChange,
  getFieldMeta,
  selectAll = false,
}: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames("relative mr-4 mb-3 w-full pt-2 last:mr-0")}>
      <FormGroup error={touched ? error : undefined} label={label}>
        <MultiSelect
          id={fieldPath}
          display="chip"
          name={fieldPath}
          value={Array.isArray(value) ? value : []}
          options={options}
          placeholder={placeholder}
          showSelectAll={selectAll}
          className={classNames("bg-violet-900 text-sm", {
            "p-invalid": isFormFieldValid(touched, error),
          })}
          onChange={(e) => onChange(e, fieldPath)}
        />
      </FormGroup>
    </div>
  );
}

export default MultiSelectField;
