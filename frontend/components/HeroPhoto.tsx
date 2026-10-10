import Image from "next/image";

export default function HeroPhoto({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-block overflow-hidden rounded-full align-middle ${className}`}
    >
      <Image
        src="/images/hero_photo.png"
        alt=""
        fill
        sizes="160px"
        unoptimized
        className="object-cover"
      />
    </span>
  );
}