import { cloneDeep, update, get, entries, keys } from "lodash";
import { ValidationError } from "yup";
import searchSchema, { type SearchForm } from "./schema";

export async function validateForm(form: SearchForm) {
  const validatedForm = cloneDeep(form);
  const fieldPaths = keys(form);
  const casted = castFields(form);
  try {
    validatedForm.errors ||= {};
    await Promise.allSettled(
      fieldPaths.map((fieldPath) =>
        searchSchema
          .validateAt(fieldPath, casted)
          .then((res) => update(validatedForm.errors, fieldPath, () => (res as any)?.reason?.message))
      )
    );
  } catch (e) {
    if (!(e instanceof ValidationError)) {
      throw e;
    }
    validatedForm.errors ||= {};
    const { message } = e;
    fieldPaths.forEach((fieldPath) => {
      update(validatedForm.errors, fieldPath, () => message);
    });
  }
  const normalizeCasted = ensureAllDatesAreStrings(casted);
  fieldPaths.forEach((fieldPath) => {
    update(validatedForm.values, fieldPath, () => get(normalizeCasted, fieldPath));
  });
  return validatedForm;
}

/**
 * Adapts fields to a form that can be validated by the schema.
 * @example
 * input:
 *  fields: { 'directors[0].age': "29" }
 * output:
 *  casted: { directors: [{ age: 29 }] }
 */
function castFields(fields: Partial<SearchForm["values"]>) {
  const blankSearch = searchSchema.cast({});
  const fieldPaths = keys(fields);
  fieldPaths.forEach((fieldPath) => {
    update(blankSearch, fieldPath, () => get(fields, fieldPath));
  });
  const casted: SearchForm["values"] = searchSchema.cast(blankSearch) as SearchForm["values"];
  return casted;
}

function ensureAllDatesAreStrings(form: SearchForm["values"]): SearchForm["values"] {
  return ensureAllDateValuesAreStrings(form);
}

function ensureAllDateValuesAreStrings<T extends Record<string, any>>(objToConvert: T): T {
  if (typeof objToConvert !== "object") {
    return objToConvert;
  }
  if (Array.isArray(objToConvert)) {
    return objToConvert.map((v) => ensureAllDateValuesAreStrings(v)) as unknown as T;
  }
  return entries(objToConvert).reduce((obj, [key, value]) => {
    if (value instanceof Date) {
      return { ...obj, [key]: value.toString() };
    }
    if (typeof value !== "object" || !value) {
      return { ...obj, [key]: value };
    }
    return { ...obj, [key]: ensureAllDateValuesAreStrings(value) };
  }, {} as T);
}
