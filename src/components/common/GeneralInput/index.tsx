import React, { type ChangeEvent, type ReactElement } from "react";
import classnames from "classnames";
import "./styles.module.scss";

export interface Option {
  displayName: string;
  value: string;
  disabled?: boolean;
}

export type Checkbox = "on" | undefined;

interface Props<InputElement extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  extends Omit<React.HTMLProps<InputElement>, "onChange"> {
  onChange: OnChange;
  error?: string;
  options?: Option[];
  formLabel: string | Node | React.ReactElement;
  underlyingClassName?: string;
  noMaxWidth?: boolean;
  labelAsOption?: boolean;
}

export type OnChange = (
  value: Checkbox | string | File | number,
  e?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  index?: number
) => void;

function textOnChange<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
  onChange: (
    val: string,
    e?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void = (): void => undefined
) {
  return (e: React.ChangeEvent<T>): void => {
    const { value } = e.currentTarget;
    onChange(value, e);
  };
}

function checkedOnChange<T extends HTMLInputElement>(
  onChange: (value?: string, e?: ChangeEvent<HTMLInputElement>) => void = (): void => undefined
) {
  return (e: React.ChangeEvent<T>): void => {
    const { checked } = e.currentTarget;
    onChange(checked ? "on" : undefined, e);
  };
}

function fileOnChange<T extends HTMLInputElement>(onChange: (val?: File) => void = (): void => undefined) {
  return (e: React.ChangeEvent<T>): void => {
    const { files } = e.currentTarget;
    if (files) {
      onChange(files[0]);
    }
  };
}

function numberOnChange<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
  onChange: (val: number) => void = (): void => undefined
) {
  return (e: React.ChangeEvent<T>): void => {
    const { value } = e.currentTarget;
    onChange(+value);
  };
}

function SpecialInput(props: Props<HTMLInputElement>): ReactElement {
  const { type, formLabel, name, onChange, value, ...restProps } = props;
  const inputProps: React.HTMLProps<HTMLInputElement> = {
    type,
    name,
    value,
    ...restProps,
  };
  const id = `${name}-${value}`;
  const _onChange = onChange as OnChange;
  return (
    <div className="center SpecialInput">
      <div
        className={classnames("left max-width align-center flex", {
          "justify-center": type === "range",
        })}
      >
        {type === "file" && (
          <h3 className="title-label header flex">
            <strong>{formLabel}</strong>
          </h3>
        )}
        {type === "range" && (
          <label className="label" htmlFor={name}>
            {formLabel}
          </label>
        )}
        <input
          {...inputProps}
          id={id}
          className={classnames(`equi-${type}`)}
          onChange={
            type === "checkbox"
              ? checkedOnChange(_onChange)
              : type === "file"
              ? fileOnChange(_onChange)
              : textOnChange(_onChange)
          }
        />
        {type === "checkbox" && (
          <label className="label" htmlFor={id}>
            {formLabel}
          </label>
        )}
      </div>
    </div>
  );
}

function GenSelect(props: Props<HTMLSelectElement>): ReactElement {
  const {
    options,
    formLabel,
    id,
    labelAsOption = true,
    underlyingClassName,
    onChange,
    ...selectProps
  } = props;
  if (!options) {
    throw new Error("GeneralInput with select requires options");
  }
  const _onChange = onChange as OnChange;
  return (
    <>
      {!labelAsOption && (
        <label className="label" htmlFor={id}>
          {formLabel}
        </label>
      )}
      <select
        {...selectProps}
        id={id}
        className={classnames(underlyingClassName)}
        onChange={textOnChange(_onChange)}
      >
        {labelAsOption && (
          <option value="" selected disabled>
            {formLabel}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.displayName}
          </option>
        ))}
      </select>
    </>
  );
}

function GenRadio(props: Props<HTMLInputElement>): ReactElement {
  const { options, formLabel, onChange, type, name, value: baseValue, ...inputProps } = props;
  const _onChange = onChange as OnChange;
  return (
    <div className="flex">
      <h3 className="title-label header no-flex">
        <strong>{formLabel}</strong>
      </h3>
      {options?.map(({ displayName, value }) => (
        <div key={value} className="center GenRadioCheck no-flex">
          <div className="left max-width align-center flex justify-center">
            <input
              {...inputProps}
              name={name}
              type={type}
              id={`radio-${name}-${value}`}
              value={value}
              className={classnames(`gen-${type}`)}
              checked={value === baseValue}
              onChange={type === "checkbox" ? checkedOnChange(_onChange) : textOnChange(_onChange)}
            />
            <label className="label" htmlFor={`radio-${name}-${value}`}>
              {displayName}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

// eslint-disable-next-line react/display-name
const GeneralInputChild = React.forwardRef(
  <InputElement extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    props: Props<InputElement>,
    ref: React.Ref<InputElement>
  ): ReactElement => {
    const { type = "text", formLabel, name, underlyingClassName, onChange, ...restProps } = props;
    const selectProps = { ...props, ref } as Props<HTMLSelectElement>;
    const textareaProps = { ...props, ref } as Props<HTMLTextAreaElement>;
    const inputProps = { ...restProps, name, type, ref } as Props<HTMLInputElement>;
    const specialInputProps = {
      ...restProps,
      name,
      formLabel,
      type,
      onChange,
      ref,
    } as Props<HTMLInputElement>;
    const _onChange = onChange as OnChange;
    switch (type) {
      case "select":
        return <GenSelect {...selectProps} />;
      case "textarea":
        return (
          <textarea
            {...textareaProps}
            placeholder={formLabel as string}
            className={classnames(underlyingClassName)}
            onChange={textOnChange(_onChange)}
          />
        );
      case "radio":
        return <GenRadio {...specialInputProps} />;
      case "checkbox":
      case "range":
      case "file":
        return <SpecialInput {...specialInputProps} />;
      case "time":
      case "date":
      case "month":
      case "week":
      case "datetime-local":
        return (
          <>
            <div className="left">
              <label className="label min-width-120 align-center justify flex" htmlFor={name}>
                {formLabel}
              </label>
            </div>
            <input
              {...inputProps}
              className={classnames(underlyingClassName)}
              onChange={textOnChange(_onChange)}
            />
          </>
        );
      default:
        return (
          <>
            <div className="left">
              <label className="label" htmlFor={name}>
                {formLabel}
              </label>
            </div>
            <input
              {...inputProps}
              className={classnames(underlyingClassName)}
              onChange={type === "number" ? numberOnChange(_onChange) : textOnChange(_onChange)}
            />
          </>
        );
    }
  }
);

function GeneralInput<InputElement extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
  props: Props<InputElement>,
  ref: React.Ref<InputElement>
): ReactElement {
  const { error, className, disabled, noMaxWidth = false, underlyingClassName, ...restProps } = props;
  return (
    <div
      className={classnames("GeneralInput", className, {
        "gen-input-error": error,
        disabled,
        "max-width": !noMaxWidth,
      })}
    >
      <GeneralInputChild
        {...restProps}
        disabled={disabled}
        underlyingClassName={classnames("gen-input", underlyingClassName)}
        ref={ref}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default React.forwardRef(GeneralInput);
