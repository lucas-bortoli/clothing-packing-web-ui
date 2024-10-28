import type { JSX } from "preact/jsx-runtime";
import { cn } from "../Utils/classnames";

import IconFileTypeUnknown from "../Assets/Icons/FileTypeUnknown.png";
import IconFileTypeDirectory from "../Assets/Icons/FileTypeDirectory.png";
import IconArrowUp from "../Assets/Icons/ArrowUp.png";
import IconWindowClose from "../Assets/Icons/WindowClose.png";
import IconWindowMaximize from "../Assets/Icons/WindowMaximize.png";
import IconWindowMinimize from "../Assets/Icons/WindowMinimize.png";
import IconWindowRestore from "../Assets/Icons/WindowRestore.png";
import IconCheck from "../Assets/Icons/Check.png";
import IconSpinnerArrow from "../Assets/Icons/SpinnerArrow.png";
import IconFastForward from "../Assets/Icons/FastForward.png";
import IconRefresh from "../Assets/Icons/Refresh.png";
import IconAdd from "../Assets/Icons/Add.png";
import IconNewLayer from "../Assets/Icons/NewLayer.png";
import IconBuild from "../Assets/Icons/Build.png";

const Icons = {
  FileTypeUnknown: IconFileTypeUnknown,
  FileTypeDirectory: IconFileTypeDirectory,
  ArrowUp: IconArrowUp,
  WindowClose: IconWindowClose,
  WindowMaximize: IconWindowMaximize,
  WindowMinimize: IconWindowMinimize,
  WindowRestore: IconWindowRestore,
  Check: IconCheck,
  SpinnerArrow: IconSpinnerArrow,
  FastForward: IconFastForward,
  Refresh: IconRefresh,
  Add: IconAdd,
  NewLayer: IconNewLayer,
  Build: IconBuild,
} as const;

export type IconName = keyof typeof Icons;

export const getIconUrl = (name: IconName) => Icons[name];

interface IconProps extends JSX.HTMLAttributes<HTMLImageElement> {
  name: IconName;
  size?: 16;
  class?: string;
}

export default function Icon(props: IconProps) {
  const size = props.size ?? 16;

  return (
    <img
      {...props}
      src={Icons[props.name]}
      aria-label={props.name}
      class={cn("pointer-events-none aspect-square select-none", props.class)}
      style={{
        fontSize: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}
