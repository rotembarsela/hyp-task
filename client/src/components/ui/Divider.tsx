import clsx from "clsx";

type DividerProps = {
  direction?: "horizontal" | "vertical";
  className?: string;
};

const Divider = ({ direction = "horizontal", className }: DividerProps) => {
  const baseClasses = "bg-gray-300";

  const directionClasses =
    direction === "horizontal" ? "w-full h-px" : "h-full w-px";

  return <div className={clsx(baseClasses, directionClasses, className)} />;
};

export default Divider;
