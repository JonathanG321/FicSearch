import type { FieldHelperProps, FieldMetaProps, FormikErrors, FormikTouched } from "formik";
import type { ChangeEvent, FormEvent } from "react";
import type { SearchSchema } from "../utils/search/schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SpaceBattlesSearch = {
  keyWords?: string;
  tags?: string[];
  excludeTags?: string[];
  newerThan?: Date;
  olderThan?: Date;
  users?: string[];
  wordCountLower?: string;
  wordCountUpper?: string;
  replies?: string;
  order?: "date" | "relevance" | "words" | "last_update" | "replies";
};

export type AO3Search = {
  anyField?: string;
  title?: string;
  author?: string;
  singleChapter?: boolean;
  wordCount?: number[];
  language?: string;
  fandoms?: string[];
  rating?: number[];
  hits?: number[];
  kudos?: number[];
  crossovers?: boolean;
  bookmarks?: number[];
  comments?: number[];
  completionStatus?: boolean;
  sortColumn?: string;
  sortDirection?: string;
  revisedAt?: string;
  characters?: string;
  relationships?: string;
  tags?: string[];
};

export type TUseSearch = () => {
  rawValues: SearchSchema;
  handleChange: {
    (e: ChangeEvent<any>): void | Promise<void>;
    <T_1 = keyof SearchSchema | ChangeEvent<any>>(field: T_1): T_1 extends ChangeEvent<any>
      ? void | Promise<void>
      : (e: keyof SearchSchema | ChangeEvent<any>) => void | Promise<void>;
  };
  setValues: (
    values: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<any>>;
  setFieldValue: (
    field: keyof SearchSchema,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<any>>;
  errors: FormikErrors<any>;
  setErrors: (errors: FormikErrors<any>) => void;
  setTouched: (
    touched: FormikTouched<any>,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<any>>;
  touched: FormikTouched<any>;
  handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
  getFieldHelpers: (name: keyof SearchSchema) => FieldHelperProps<any>;
  getFieldMeta: (name: keyof SearchSchema) => FieldMetaProps<any>;
  setOnFocusValue: (value: string) => void;
};
