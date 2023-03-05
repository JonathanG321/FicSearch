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
  anyField: string().notRequired(), // Universal
  keyWords: string().notRequired(), // Universal
  title: string().notRequired(), // Universal
  tags: array(string().notRequired()).notRequired(), // Universal
  author: string().notRequired(), // Universal
  users: array(string().notRequired()).notRequired(), // Universal
  wordCountLower: string().notRequired(), // Universal
  wordCountUpper: string().notRequired(), // Universal
  wordCount: array(number().notRequired()).length(2).notRequired(), // Universal
  excludeTags: array(string().notRequired()).notRequired(), // Space Battles
  newerThan: date().notRequired(), // Space Battles
  olderThan: date().notRequired(), // Space Battles
  replies: string().notRequired(), // Space Battles
  order: string()
    .oneOf(["date", "relevance", "words", "last_update", "replies"])
    .required()
    .default("last_update"), // Space Battles
  singleChapter: boolean(), // AO3
  language: string().notRequired(), // AO3
  fandoms: array(string().notRequired()).notRequired(), // AO3
  rating: array(number().min(1).max(5).notRequired()).length(2).notRequired(), // AO3
  hits: array(number().notRequired()).length(2).notRequired(), // AO3
  kudos: array(number().notRequired()).length(2).notRequired(), // AO3
  crossovers: boolean(), // AO3
  bookmarks: array(number().notRequired()).length(2).notRequired(), // AO3
  comments: array(number().notRequired()).length(2).notRequired(), // AO3
  completionStatus: boolean(), // AO3
  // TODO: finish adding fields
  sortColumn: string().notRequired(), // AO3
  sortDirection: string().notRequired(), // AO3
  revisedAt: string().notRequired(), // AO3
  characters: array(string().notRequired()).notRequired(), // AO3
  relationships: array(string().notRequired()).notRequired(), // AO3
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
