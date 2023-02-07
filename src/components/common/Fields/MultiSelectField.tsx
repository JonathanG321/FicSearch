/* eslint-disable react/function-component-definition */
import classNames from 'classnames';
import { MultiSelect } from 'primereact/multiselect';
import { CommonFormFunctions } from '../../../types';
import { isFormFieldValid } from '../../../utils/formUtils';
import FormGroup from '../FormGroup';
import UnsavedFieldWarning from '../UnsavedFieldWarning';

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
  unSavedFields,
  onChange,
  getFieldMeta,
  selectAll = false,
  disabled = false,
}: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames('mr-4 mb-3 pt-2 last:mr-0 w-full relative')}>
      <FormGroup error={touched ? error : undefined} label={label}>
        <MultiSelect
          id={fieldPath}
          display="chip"
          name={fieldPath}
          value={Array.isArray(value) ? value : []}
          disabled={disabled}
          options={options}
          placeholder={placeholder}
          showSelectAll={selectAll}
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

export default MultiSelectField;
