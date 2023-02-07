/* eslint-disable react/function-component-definition */
import classNames from 'classnames';
import { Dropdown } from 'primereact/dropdown';
import { CommonFormFunctions } from '../../../types';
import { isFormFieldValid } from '../../../utils/formUtils';
import FormGroup from '../FormGroup';
import UnsavedFieldWarning from '../UnsavedFieldWarning';

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
  unSavedFields,
  disabled = false,
}: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames('mr-4 mb-3 pt-2 last:mr-0 w-full relative')}>
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
          className={classNames('text-sm', {
            'p-invalid': isFormFieldValid(touched, error),
            'border-orange-300': unSavedFields.includes(fieldPath),
          })}
          onChange={(e) => onChange(e, fieldPath)}
        />
        {unSavedFields.includes(fieldPath) && (
          <div className="inline-block  absolute top-2 right-0">
            <UnsavedFieldWarning fieldPath={fieldPath} />
          </div>
        )}
      </FormGroup>
    </div>
  );
}

export default DropdownField;
