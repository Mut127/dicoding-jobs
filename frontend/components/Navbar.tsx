import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center gap-8 px-6 py-4 text-sm">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-white">
            g
          </span>
          Jobs
        </Link>
        <Link href="/" className="text-slate-700 hover:text-black">
          Lowongan Kerja
        </Link>
        <Link href="/dashboard" className="text-slate-700 hover:text-black">
          Dashboard
        </Link>
      </nav>
    </header>
  );
}