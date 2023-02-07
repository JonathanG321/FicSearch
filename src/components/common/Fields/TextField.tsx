/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import { InputText } from 'primereact/inputtext';
import { CommonFormFunctions } from '../../../types';
import { isFormFieldValid } from '../../../utils/formUtils';
import FormGroup from '../FormGroup';
import UnsavedFieldWarning from '../UnsavedFieldWarning';

interface Props<T> extends CommonFormFunctions<T> {
  fieldPath: Extract<keyof T, string>;
  label?: string;
  placeholder?: string;
  iconLocation?: 'left' | 'right';
  icon?: string;
}

function TextField<T>({
  fieldPath,
  label,
  placeholder,
  iconLocation,
  icon,
  disabled = false,
  handleFocus,
  onChange,
  getFieldMeta,
  unSavedFields,
}: Props<T>) {
  const { error: fieldError, touched: fieldTouched, value: fieldValue } = getFieldMeta(fieldPath);

  const [{ error, touched, value }, setState] = useState({
    error: fieldError,
    touched: fieldTouched,
    value: fieldValue,
  });

  useEffect(() => {
    setState({ error: fieldError, touched: fieldTouched, value: fieldValue });
  }, [fieldError, fieldTouched, fieldValue]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value: newVal } = event.target;
    setState((oldState) => ({ ...oldState, value: newVal }));
    onChange(event, fieldPath);
  };

  return (
    <div className={classNames('mr-4 mb-3 pt-2 last:mr-0 w-full')}>
      <FormGroup error={touched ? error : undefined} label={label}>
        <div
          className={classNames('w-full flex items-center', {
            'p-input-icon-left': iconLocation === 'left',
            'p-input-icon-right': iconLocation === 'right',
          })}
        >
          {!!icon && !!iconLocation && <i className={classNames('pi', icon)} />}
          <InputText
            id={fieldPath}
            name={fieldPath}
            value={value || ''}
            placeholder={placeholder}
            onFocus={handleFocus}
            disabled={disabled}
            className={classNames('text-sm w-full', {
              'p-invalid': isFormFieldValid(touched, error),
              'pl-8': !!icon && !!iconLocation,
              'border-orange-300': unSavedFields.includes(fieldPath),
            })}
            onChange={handleChange}
          />
          {unSavedFields.includes(fieldPath) && <UnsavedFieldWarning fieldPath={fieldPath} />}
        </div>
      </FormGroup>
    </div>
  );
}

export default React.memo(TextField, (prevProps, nextProps) => {
  if (nextProps.disabled !== prevProps.disabled) {
    return false;
  }
  const prevData = prevProps.getFieldMeta(prevProps.fieldPath);
  const nextData = nextProps.getFieldMeta(nextProps.fieldPath);
  return isEqual(prevData, nextData) && isEqual(prevProps.unSavedFields, nextProps.unSavedFields);
}) as typeof TextField;
