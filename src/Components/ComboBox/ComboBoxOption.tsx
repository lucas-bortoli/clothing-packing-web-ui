import type { ComponentChild } from "preact";

interface ItemOption {
  kind: "option";
  value: string;
  children: ComponentChild;
}

interface ItemSeparator {
  kind: "separator";
}

type ComboBoxOptionProps = ItemOption | ItemSeparator;

export default function ComboBoxOption(props: ComboBoxOptionProps) {
  if (props.kind === "option") {
    return <option value={props.value}>{props.children}</option>;
  } else {
    return (
      <option disabled class="text-white-400 font-sans text-sm">
        ──────────────────
      </option>
    );
  }
}
