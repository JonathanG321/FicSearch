/* eslint-disable @typescript-eslint/no-explicit-any */
export type CommonFormFunctions<T> = {
  rawValues: T;
  unSavedFields: (keyof T)[];
  handleFocus: ({
    target,
  }: {
    target: {
      value: any;
    };
  }) => void;
  onChange: (e: any, path: Extract<keyof T, string>) => void;
  getFieldMeta: (name: Extract<keyof T, string>) => FieldMetaProps<any>;
  getFieldHelpers: (name: Extract<keyof T, string>) => FieldHelperProps<any>;
  disabled: boolean;
};

export interface FieldMetaProps<Value> {
  /** Value of the field */
  value: Value;
  /** Error message of the field */
  error?: string;
  /** Has the field been visited? */
  touched: boolean;
  /** Initial value of the field */
  initialValue?: Value;
  /** Initial touched state of the field */
  initialTouched: boolean;
  /** Initial error message of the field */
  initialError?: string;
}
/** Imperative handles to change a field's value, error and touched */
export interface FieldHelperProps<Value> {
  /** Set the field's value */
  setValue: (value: Value, shouldValidate?: boolean) => void;
  /** Set the field's touched value */
  setTouched: (value: boolean, shouldValidate?: boolean) => void;
  /** Set the field's error value */
  setError: (value: string | undefined) => void;
}
