import Image from "next/image";
import { cn } from "@/lib/format";

const TEE_COLORS = ["#e8735f", "#1f8a83", "#6b6f78", "#e7a93b", "#e8735f"];

/** Product photo, or an illustrated tee when the product has no image. */
export function ProductImage({
  src,
  alt,
  id,
  className,
  sizes = "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw",
  priority,
}: {
  src: string;
  alt: string;
  id: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    const color = TEE_COLORS[id % TEE_COLORS.length];
    return (
      <svg
        viewBox="0 0 100 100"
        className={cn("h-full w-full", className)}
        role="img"
        aria-label={alt}
      >
        <path
          fill={color}
          d="M33 18 L44 12 Q50 19 56 12 L67 18 L82 32 L72 42 L67 37 L67 86 L33 86 L33 37 L28 42 L18 32 Z"
        />
        <path fill="#ffffff" opacity="0.25" d="M33 50 h34 v5 h-34z M33 62 h34 v5 h-34z" />
      </svg>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-contain mix-blend-multiply", className ?? "p-6")}
    />
  );
}
