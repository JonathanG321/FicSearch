import type { FieldHelperProps, FieldMetaProps, FormikState, FormikValues } from "formik";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type CommonFormFunctions<T> = {
  rawValues: T;
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
};

export type Form<T extends FormikValues> = Pick<FormikState<T>, "values" | "errors" | "touched">;
