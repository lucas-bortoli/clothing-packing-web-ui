import { getIconUrl } from "../Icon";

interface CheckboxProps {
  disabled?: boolean;
  checked: boolean;
  onCheck: (checked: boolean) => void;
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <input
      type="checkbox"
      disabled={props.disabled}
      checked={props.checked}
      onChange={(e) => props.onCheck(e.currentTarget.checked)}
      class="h-4 w-4 appearance-none border border-grey-800 bg-grey-200 bg-center shadow-pixel disabled:bg-grey-400"
      style={{ "background-image": props.checked ? `url('${getIconUrl("Check")}')` : "none" }}
    />
  );
}
