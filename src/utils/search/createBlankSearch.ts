import searchSchema, { type SearchForm, type SearchSchema } from "./schema";

export function createBlankSearch(): SearchForm {
  const blankSearch: SearchSchema = {
    ...searchSchema.getDefault(),
  };

  return {
    values: blankSearch,
    errors: {},
    touched: {},
  };
}
