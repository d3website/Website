"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { catalogueSections, company, services } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const serviceLinks = services.map((s) => ({
  label: s.navLabel,
  href: `/${s.slug}`,
}));

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {company.brand}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavDropdown label="Fabrics" items={[...catalogueSections]} />
          <NavDropdown label="Services" items={serviceLinks} />
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-3">
            <MobileLink href="/" onNavigate={() => setOpen(false)}>
              Home
            </MobileLink>
            <MobileLink href="/about" onNavigate={() => setOpen(false)}>
              About
            </MobileLink>
            <MobileGroup label="Fabrics" items={[...catalogueSections]} onNavigate={() => setOpen(false)} />
            <MobileGroup label="Services" items={serviceLinks} onNavigate={() => setOpen(false)} />
            <MobileLink href="/contact" onNavigate={() => setOpen(false)}>
              Contact
            </MobileLink>
          </div>
        </nav>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: readonly { label: string; href: string }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          />
        }
      >
        {label}
        <ChevronDown className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="py-2 text-sm font-medium text-foreground"
    >
      {children}
    </Link>
  );
}

function MobileGroup({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: readonly { label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className="py-2">
      <p className={cn("text-xs font-semibold uppercase text-muted-foreground")}>
        {label}
      </p>
      <div className="mt-1 flex flex-col">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="py-1.5 pl-3 text-sm text-muted-foreground"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
