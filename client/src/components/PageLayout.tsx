import { PropsWithChildren } from "react";

type PageLayoutProps = PropsWithChildren;

function PageLayout({ children }: PageLayoutProps) {
  return (
    <main
      id="main"
      className="w-full sm:w-[640px] md:w-[768px] lg:w-[1024px] xl:w-[1280px] 2xl:w-[1536px] mx-auto h-full py-12"
    >
      {children}
    </main>
  );
}

export default PageLayout;
