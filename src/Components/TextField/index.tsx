import type { JSX, Ref } from "preact";
import { cn } from "../../Utils/classnames";
import style from "./style.module.css";
import { getIconUrl } from "../Icon";

interface BaseFieldProps {
  placeholder?: string;
  class?: string;
  disabled?: boolean;
  readOnly?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  style?: JSX.CSSProperties;
}

interface TextFieldProps extends BaseFieldProps {
  kind: "text";
  value: string;
  onInput(newValue: string): void;
}

interface NumericFieldProps extends BaseFieldProps {
  kind: "number";
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onInput(newValue: number): void;
}

export type FieldProps = TextFieldProps | NumericFieldProps;

export default function TextField(props: FieldProps) {
  let inputProps: JSX.HTMLAttributes<HTMLInputElement> = {};

  switch (props.kind) {
    case "text":
      inputProps = {
        type: "text",
        value: props.value,
        onInput: (e) => props.onInput(e.currentTarget.value),
        style: { ...props.style },
      };
      break;
    case "number":
      inputProps = {
        ...inputProps,
        type: "number",
        min: props.min,
        max: props.max,
        step: props.step ?? 1,
        value: props.value,
        onInput: (e) => props.onInput(e.currentTarget.valueAsNumber),
        style: { ...props.style, fontVariantNumeric: "tabular-nums" },
      };
      break;
  }

  return (
    <input
      {...inputProps}
      placeholder={props.placeholder}
      disabled={props.disabled ?? false}
      class={cn(
        "inline-flex h-8 select-none gap-2 border border-grey-800 bg-grey-0 px-2 font-sans text-grey-800 shadow-pixel placeholder:text-grey-400 disabled:bg-grey-100 disabled:text-grey-600 disabled:shadow-none",
        props.class,
        props.kind === "number" && style.numberInput
      )}
      style={{ "--icon-url": `url('${getIconUrl("SpinnerArrow")}')` }}
      readOnly={props.readOnly}
      ref={props.inputRef}
    />
  );
}

interface MultilineTextFieldProps {
  value: string;
  onInput(newValue: string): void;
  placeholder?: string;
  class?: string;
  disabled?: boolean;
  readOnly?: boolean;
  rows?: number;
  textareaRef?: Ref<HTMLTextAreaElement>;
}

export function MultilineTextField(props: MultilineTextFieldProps) {
  return (
    <textarea
      placeholder={props.placeholder}
      disabled={props.disabled ?? false}
      class={cn(
        "inline-flex select-none resize-none gap-2 rounded border border-grey-300 bg-grey-0 px-4 py-2 font-sans text-grey-800 placeholder:text-grey-400 hover:shadow-md disabled:bg-grey-100 disabled:text-grey-600 disabled:shadow-none",
        props.class
      )}
      value={props.value}
      onInput={(e) => props.onInput(e.currentTarget.value)}
      rows={props.rows}
      readOnly={props.readOnly}
      ref={props.textareaRef}
    />
  );
}
