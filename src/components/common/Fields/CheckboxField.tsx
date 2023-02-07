/* eslint-disable react/function-component-definition */
import classNames from 'classnames';
import { Checkbox } from 'primereact/checkbox';
import { CommonFormFunctions } from '../../../types';
import { isFormFieldValid } from '../../../utils/formUtils';
import UnsavedFieldWarning from '../UnsavedFieldWarning';

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
}

function CheckboxField<T>({ fieldPath, unSavedFields, label, onChange, getFieldMeta, disabled = false }: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);
  return (
    <div className={classNames('field-checkbox my-4 relative', { 'hover:cursor-default': disabled })}>
      <Checkbox
        inputId={fieldPath}
        name={fieldPath}
        checked={value}
        disabled={disabled}
        onChange={(e) =>
          onChange(
            { target: { name: e.target.name, value: e.checked } /* passing through e directly does not work */ },
            fieldPath,
          )
        }
        className={classNames('mr-2', {
          'p-invalid': isFormFieldValid(touched, error),
          'hover:cursor-default': disabled,
          'border-orange-300': unSavedFields.includes(fieldPath),
        })}
      />
      <label htmlFor={fieldPath} className={classNames({ 'p-error': isFormFieldValid(touched, error) })}>
        {label}
      </label>
      {unSavedFields.includes(fieldPath) && (
        <div className="inline-block ml-10 absolute -bottom-0.5">
          <UnsavedFieldWarning fieldPath={fieldPath} />
        </div>
      )}
      {error && touched && <small className="h-0 p-error">{error}</small>}
    </div>
  );
}

export default CheckboxField;
