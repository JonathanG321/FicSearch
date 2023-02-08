export function isFormFieldValid(fieldTouched: boolean, error?: string) {
  return !!(fieldTouched && error);
}
