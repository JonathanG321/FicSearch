import React, { useMemo, type Dispatch, type SetStateAction } from "react";
import type { SearchForm } from "../utils/search/schema";
import { createDefaultContext } from "../utils/context";

const SearchContext = React.createContext<{
  search: SearchForm;
  updateSearch: Dispatch<SetStateAction<SearchForm>>;
}>(createDefaultContext());

/*
  context to access the current active user extended with auth0 data. For now all extraneous data like who is there clients etc should come from Apollo hooks & queries.
*/
export const SearchProvider: React.FC<{
  search: SearchForm;
  updateSearch: Dispatch<SetStateAction<SearchForm>>;
  children: React.ReactNode;
}> = ({ search, updateSearch, children }) => {
  const value = useMemo(() => ({ search, updateSearch }), [search, updateSearch]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const SearchConsumer = SearchContext.Consumer;
export default SearchContext;
