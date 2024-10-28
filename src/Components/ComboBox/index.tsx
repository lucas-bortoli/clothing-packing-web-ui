import type { ComponentChildren } from "preact";
import { cn } from "../../Utils/classnames";
import IconDropdown from "../../SystemAssets/Icons/DropdownArrow.png";
import style from "./style.module.css";

interface ComboBoxProps {
  value: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
  class?: string;
  children: ComponentChildren;
}

export default function ComboBox(props: ComboBoxProps) {
  return (
    <select
      type="text"
      disabled={props.disabled ?? false}
      class={cn(
        "inline-flex h-8 select-none appearance-none items-center gap-2 border border-grey-800 bg-grey-0 px-2 pr-8 font-sans text-grey-800 shadow-pixel placeholder:text-grey-400 hover:shadow-pixel-sm disabled:bg-grey-100 disabled:text-grey-600 disabled:shadow-none",
        style.combobox,
        props.class
      )}
      style={{ "--icon-url": `url('${IconDropdown}')` }}
      value={props.value}
      onChange={(e) => props.onChange(e.currentTarget.value)}>
      {props.children}
    </select>
  );
}
