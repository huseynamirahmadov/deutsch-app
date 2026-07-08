import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-muted/30 bg-background py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">

          {/* Left Side: Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <Link href="/" className="text-lg font-semibold tracking-tight transition-colors hover:text-primary">
              deutsch-app
            </Link>
            <span className="text-sm text-muted-foreground">Learn German with focus</span>
          </div>

          {/* Center: Internal Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/notebook" className="text-muted-foreground transition-colors hover:text-foreground">
              Notebook
            </Link>
            <Link href="/profile" className="text-muted-foreground transition-colors hover:text-foreground">
              Profile
            </Link>
          </nav>

          {/* Right Side: Copyright & Tech */}
          <div className="flex flex-col items-center text-sm text-muted-foreground md:items-end gap-1">
            <p>&copy; {new Date().getFullYear()} DeutschLern. All rights reserved.</p>
            <p className="text-xs">Powered by Next.js & Supabase</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
