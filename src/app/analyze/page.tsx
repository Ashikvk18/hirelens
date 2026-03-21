import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AnalyzePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-3xl font-bold">Analyzer</h1>
      <p className="mb-6 text-muted-foreground">
        Resume analysis tool coming soon.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </div>
  );
}
