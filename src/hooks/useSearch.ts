import { useContext, useEffect, useRef } from "react";
import { useFormik } from "formik";
import SearchContext from "../contexts/SearchContext";
import { getAllFormErrors } from "../utils/search/schema";
import { trpc } from "../utils/trpc";
import type { TUseSearch } from "../types/search";
import type { spaceBattlesInputType } from "../server/trpc/router/spaceBattles";
import type { AO3InputType } from "../server/trpc/router/ao3";

const useSearch: TUseSearch = () => {
  const { search, updateSearch } = useContext(SearchContext);
  const focusValue = useRef("");
  const {
    values,
    handleChange: formikHandleChange,
    setValues,
    setFieldValue,
    errors,
    setErrors,
    setTouched,
    touched,
    handleSubmit,
    getFieldHelpers,
    getFieldMeta,
    setFieldError,
  } = useFormik({
    initialValues: search.values,
    initialTouched: search.touched,
    initialErrors: search.errors,
    onSubmit: (validatedValues) => {
      const ao3Works = trpc.AO3.search.useQuery({ ...validatedValues, page: 0 } as typeof AO3InputType);
      const spaceBattlesWorks = trpc.spaceBattles.search.useQuery(
        validatedValues as typeof spaceBattlesInputType
      );
      console.warn({ ao3Works, spaceBattlesWorks });
    },
    validate: async (currentValues) => {
      return getAllFormErrors(currentValues);
    },
  });

  useEffect(() => {
    updateSearch((oldSearch) => ({
      ...oldSearch,
      formData: { ...oldSearch, values },
    }));
  }, [values, updateSearch]);

  function setOnFocusValue(value: string) {
    focusValue.current = value;
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    formikHandleChange(e);
    updateSearch((oldSearch) => ({ ...oldSearch }));
  };

  return {
    rawValues: values,
    handleChange,
    setValues,
    setFieldValue,
    setFieldError,
    errors,
    setErrors,
    setTouched,
    touched,
    handleSubmit,
    getFieldHelpers,
    getFieldMeta,
    setOnFocusValue,
  };
};

export { useSearch };
