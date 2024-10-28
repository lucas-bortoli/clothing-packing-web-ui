export default function classnames(...classNames: (string | false | null | undefined)[]): string {
  return classNames.filter(className => Boolean(className)).join(" ");
}

export {
  classnames as cn
};
