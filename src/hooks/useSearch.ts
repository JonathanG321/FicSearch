import { useContext, useEffect, useRef } from "react";
import { useFormik } from "formik";
import SearchContext from "../contexts/SearchContext";
import { getAllFormErrors } from "../utils/search/schema";
import type { TUseSearch } from "../types/search";

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
      console.warn({ validatedValues });
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
