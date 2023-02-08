import classNames from "classnames";
import { SelectButton } from "primereact/selectbutton";
import { type CommonFormFunctions } from "../../../types/forms";
import { isFormFieldValid } from "../../../utils/formUtils";
import FormGroup from "../FormGroup";

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
  options: { label: string; value: string | boolean }[];
}

function SelectField<T>({ fieldPath, label, options, disabled = false, getFieldMeta, onChange }: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames("mr-4 mb-3 w-full pt-2 last:mr-0")}>
      <FormGroup error={touched ? error : undefined} label={label}>
        <SelectButton
          id={fieldPath}
          value={value}
          options={options}
          disabled={disabled}
          className={classNames("text-sm", {
            "p-invalid": isFormFieldValid(touched, error),
          })}
          onChange={(e) => onChange({ target: { name: fieldPath, value: e.value } }, fieldPath)}
        />
      </FormGroup>
    </div>
  );
}

export default SelectField;
