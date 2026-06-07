export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Институт туризма и креативных индустрий ВВГУ.
        </p>
      </div>
    </footer>
  );
}
