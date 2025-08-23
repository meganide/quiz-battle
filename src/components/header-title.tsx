import type { LucideIcon } from "lucide-react";

type HeaderTitleProps = {
  title: string;
  Icon: LucideIcon;
};

export function HeaderTitle({ title, Icon }: HeaderTitleProps) {
  return (
    <header className="flex items-center gap-2 h-16 w-full justify-between bg-neutral-500 rounded-xs py-2 px-3">
      <h2>{title}</h2>
      <Icon className="size-8 fill-neutral-300 stroke-neutral-300" />
    </header>
  );
}
