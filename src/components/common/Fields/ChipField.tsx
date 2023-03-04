/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from "classnames";
import { Chips } from "primereact/chips";
import { type CommonFormFunctions } from "../../../types/forms";
import { isFormFieldValid } from "../../../utils/formUtils";
import FormGroup from "../FormGroup";

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
  placeholder?: string;
}

function ChipField<T>({ fieldPath, label, placeholder, onChange, getFieldMeta }: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames("w-fill relative mx-2 mb-3 last:mr-0")}>
      <FormGroup error={touched ? error : undefined} label={label}>
        <Chips
          id={fieldPath}
          name={fieldPath}
          value={Array.isArray(value) ? value : []}
          placeholder={placeholder}
          removable
          separator=","
          className={classNames("text-sm", {
            "p-invalid": isFormFieldValid(touched, error),
          })}
          onChange={(e) => onChange(e, fieldPath)}
        />
      </FormGroup>
    </div>
  );
}

export default ChipField;
