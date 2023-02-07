/* eslint-disable react/function-component-definition */
import classNames from 'classnames';
import { SelectButton } from 'primereact/selectbutton';
import { CommonFormFunctions } from '../../../types';
import { isFormFieldValid } from '../../../utils/formUtils';
import FormGroup from '../FormGroup';
import UnsavedFieldWarning from '../UnsavedFieldWarning';

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
  options: { label: string; value: string | boolean }[];
}

function SelectField<T>({
  fieldPath,
  label,
  options,
  unSavedFields,
  disabled = false,
  getFieldMeta,
  onChange,
}: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames('mr-4 mb-3 pt-2 last:mr-0 w-full')}>
      <FormGroup error={touched ? error : undefined} label={label}>
        <SelectButton
          id={fieldPath}
          value={value}
          options={options}
          disabled={disabled}
          className={classNames('text-sm', {
            'p-invalid': isFormFieldValid(touched, error),
            'border-orange-300': unSavedFields.includes(fieldPath),
          })}
          onChange={(e) => onChange({ target: { name: fieldPath, value: e.value } }, fieldPath)}
        />
        {unSavedFields.includes(fieldPath) && <UnsavedFieldWarning fieldPath={fieldPath} />}
      </FormGroup>
    </div>
  );
}

export default SelectField;
