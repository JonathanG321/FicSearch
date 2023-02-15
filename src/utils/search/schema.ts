import { type FormikErrors } from "formik";
import { set } from "lodash";
import {
  object,
  string,
  type InferType,
  setLocale,
  date,
  boolean,
  array,
  ValidationError,
  number,
} from "yup";
import { type Form } from "../../types/forms";

setLocale({
  mixed: {
    required: "Required",
  },
});

const searchSchema = object({
  keyWords: string().notRequired(),
  tags: array(string().notRequired()).notRequired(),
  excludeTags: array(string().notRequired()).notRequired(),
  newerThan: date().notRequired(),
  olderThan: date().notRequired(),
  users: array(string().notRequired()).notRequired(),
  wordCountLower: string().notRequired(),
  wordCountUpper: string().notRequired(),
  replies: string().notRequired(),
  order: string()
    .oneOf(["date", "relevance", "words", "last_update", "replies"])
    .required()
    .default("last_update"),
  anyField: string().notRequired(),
  title: string().notRequired(),
  author: string().notRequired(),
  singleChapter: boolean(),
  wordCount: array(number().notRequired()).notRequired(),
  language: string().notRequired(),
  fandoms: array(string().notRequired()).notRequired(),
  rating: array(number().notRequired()).notRequired(),
  hits: array(number().notRequired()).notRequired(),
  kudos: array(number().notRequired()).notRequired(),
  crossovers: boolean(),
  bookmarks: array(number().notRequired()).notRequired(),
  comments: array(number().notRequired()).notRequired(),
  completionStatus: boolean(),
  sortColumn: string().notRequired(),
  sortDirection: string().notRequired(),
  revisedAt: string().notRequired(),
  characters: string().notRequired(),
  relationships: string().notRequired(),
});

export default searchSchema;

export type SearchSchema = InferType<typeof searchSchema>;
export type SearchForm = Form<SearchSchema>;

const lock = { current: false };

let blockGetAllFormErrors: {
  timestamp: number;
  cb: () => ReturnType<typeof getAllFormErrorsHelpers>;
} = { timestamp: -Infinity, cb: async () => ({}) };

/**
 * There are race conditions in the form and sometime when the errors return, it returns the previous form state's errors
 * In order to negate this, we need to make sure that the called `getAllFormErrors` are executed in the same order
 * So we use locks and store the most recent "blocked" call since it has the most up to date form values
 * @param currentValues - current values in the form
 * @param yupSchemaContext - yup schema context for the client who owns this form
 * @returns object of errors in the current form
 */
export async function getAllFormErrors(currentValues: SearchSchema): Promise<FormikErrors<SearchSchema>> {
  const timestamp = new Date().getTime();
  // if we currently aren't already computing form errors, then we can compute the form errors
  if (!lock.current) {
    lock.current = true;
    const result = await getAllFormErrorsHelpers(currentValues);
    lock.current = false;
    return result;
  }
  // otherwise, if we are currently computing, then we should try to store this call for later
  // if the current call is more recent than the previously saved one,
  // save the current one to call it later
  if (blockGetAllFormErrors.timestamp < timestamp) {
    blockGetAllFormErrors = {
      timestamp,
      cb: () => getAllFormErrorsHelpers(currentValues),
    };
  }
  return new Promise<FormikErrors<SearchSchema>>((resolve) => {
    // wait for lock to become free and then
    const interval = setInterval(async () => {
      if (!lock.current) {
        lock.current = true;
        clearInterval(interval);
        // call the currently saved `getAllFormErrors` call
        const result = await blockGetAllFormErrors.cb();
        lock.current = false;
        resolve(result);
      }
    }, 20);
  });
}

/**
 * computes the current form errors directly (without locks or checks - will not defer execution)
 */
async function getAllFormErrorsHelpers(currentValues: SearchSchema): Promise<FormikErrors<SearchSchema>> {
  try {
    await searchSchema.validate(currentValues, { abortEarly: false });
  } catch (error) {
    if (!(error instanceof ValidationError)) {
      throw error;
    }
    return error.inner.reduce(
      (validationErrors, currentError) =>
        currentError.path ? set(validationErrors, currentError.path, currentError.message) : validationErrors,
      {} as FormikErrors<SearchSchema>
    );
  }
  return {};
}
