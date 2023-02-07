/* eslint-disable react/function-component-definition */
import classNames from 'classnames';
import { Checkbox, CheckboxChangeParams } from 'primereact/checkbox';
import { CommonFormFunctions } from '../../../types';
import { isFormFieldValid } from '../../../utils/formUtils';
import UnsavedFieldWarning from '../UnsavedFieldWarning';

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  vertical?: boolean;
  options: { label: string; value: string }[];
}

function CheckboxArrayField<T>({
  fieldPath,
  onChange,
  getFieldMeta,
  disabled = false,
  vertical,
  options,
  unSavedFields,
}: Props<T>) {
  const { error, touched, value } = getFieldMeta(fieldPath);

  function isCheckedOnEvent(e: CheckboxChangeParams) {
    return !!e.checked;
  }

  function handleChange(e: CheckboxChangeParams, option: { label: string; value: string }) {
    let newValue: string[] = value;
    if (isCheckedOnEvent(e)) {
      newValue = newValue.concat([option.value]);
    } else {
      newValue = newValue.filter((val: string) => val !== option.value);
    }
    const newEvent = { target: { name: fieldPath, value: newValue } };

    onChange(newEvent, fieldPath);
  }

  return (
    <div className={classNames({ flex: !vertical })}>
      {error && touched && <small className="h-0 p-error">{error}</small>}
      {options.map((option, i) =>
        option.value !== '' ? (
          <div
            key={option.label}
            className={classNames('field-checkbox my-4', {
              'first:mt-0 ml-0 mb-2 last:mb-0': vertical,
              'hover:cursor-default': disabled,
            })}
          >
            <Checkbox
              inputId={`${fieldPath}[${i}]`}
              name={`${fieldPath}[${i}]`}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(e, option)}
              disabled={disabled}
              className={classNames('mr-2', {
                'p-invalid': isFormFieldValid(touched, error),
                'hover:cursor-default': disabled,
              })}
            />
            <div className="inline relative">
              <label
                htmlFor={`${fieldPath}[${i}]`}
                className={classNames({ 'p-error': isFormFieldValid(touched, error) })}
              >
                {option.label}
              </label>
              {unSavedFields.includes(fieldPath) && (
                <div className="inline-block ml-10 absolute -bottom-1">
                  <UnsavedFieldWarning fieldPath={`${fieldPath}-${i}`} />
                </div>
              )}
            </div>
          </div>
        ) : undefined,
      )}
    </div>
  );
}

export default CheckboxArrayField;
