import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-white">H</span>
          </div>
          <span className="text-sm font-semibold">HireLens</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Built for Truman State University students &middot;{" "}
          <Link
            href="https://github.com/Ashikvk18/hirelens"
            target="_blank"
            className="underline underline-offset-2 hover:text-foreground"
          >
            GitHub
          </Link>
        </p>
      </div>
    </footer>
  );
}
