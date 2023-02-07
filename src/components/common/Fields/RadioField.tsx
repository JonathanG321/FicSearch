/* eslint-disable react/function-component-definition */
import classNames from 'classnames';
import { RadioButton } from 'primereact/radiobutton';
import { CommonFormFunctions } from '../../../types';
import { isFormFieldValid } from '../../../utils/formUtils';
import FormGroup from '../FormGroup';
import UnsavedFieldWarning from '../UnsavedFieldWarning';

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
  vertical?: boolean;
  options: { label: string; value: string | boolean }[];
}

function RadioField<T>({
  fieldPath,
  label,
  vertical,
  options,
  disabled = false,
  onChange,
  getFieldMeta,
  unSavedFields,
}: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);

  return (
    <div className={classNames('mr-4 mb-3 pt-2 last:mr-0 w-full')}>
      <FormGroup error={touched ? error : undefined} label={label}>
        <div className={classNames({ flex: !vertical })}>
          {options.map((option) => (
            <div
              key={option.label}
              className={classNames('first:ml-0 relative', {
                'ml-0 mb-2 last:mb-0': vertical,
                'ml-8': !vertical,
                'hover:cursor-default': disabled,
              })}
            >
              <RadioButton
                id={fieldPath}
                name={fieldPath}
                value={option.value}
                checked={option.value === value}
                disabled={disabled}
                className={classNames('text-sm', {
                  'p-invalid': isFormFieldValid(touched, error),
                  'hover:cursor-default': disabled,
                })}
                onChange={(e) => onChange(e, fieldPath)}
              />
              <label
                className={classNames('ml-2', { 'p-error': isFormFieldValid(touched, error) })}
                htmlFor={fieldPath}
              >
                {option.label}
              </label>
              {unSavedFields.includes(fieldPath) && (
                <div className="inline-block ml-8 absolute -bottom-0.5">
                  <UnsavedFieldWarning fieldPath={`${fieldPath}-${option.label}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </FormGroup>
    </div>
  );
}

export default RadioField;
