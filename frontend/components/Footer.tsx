import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mx-auto mt-16 max-w-5xl border-t border-gray-200 px-6 py-10 text-sm text-gray-500">
      <Image src="/images/footer_icon.svg" alt="Dicoding" width={138} height={34} unoptimized className="mb-3"/>    
      <p>Dicoding Space</p>
      <p>Jl. Batik Kumeli No.50, Sukaluyu,</p>
      <p>Kec. Cibeunying Kaler, Kota Bandung Jawa Barat 40123</p>
    </footer>
  );
}