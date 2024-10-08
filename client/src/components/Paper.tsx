import clsx from "clsx";
import { HTMLAttributes } from "react";

type PaperProps = HTMLAttributes<HTMLDivElement>;

function Paper(props: PaperProps) {
  const { className, ...rest } = props;

  const defaultClassNames = clsx(
    className,
    `
        p-12 border border-gray-200 rounded-md shadow-sm
    `
  );

  return <div className={defaultClassNames} {...rest} />;
}

export default Paper;
