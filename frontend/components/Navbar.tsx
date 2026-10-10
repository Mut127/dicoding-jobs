import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center gap-8 px-6 py-4 text-sm">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800">
        <Image
            src="/images/nav_icon.svg"
            alt="Dicoding"
            width={28}
            height={28}
            unoptimized
        />
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