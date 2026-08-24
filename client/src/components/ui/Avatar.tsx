import { getInitials, resolveMediaUrl } from "../../utils/avatar";

type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = {
  name?: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-9 text-xs",
  md: "size-16 text-lg",
  lg: "size-24 text-2xl sm:size-28",
};

function Avatar({ name, src, size = "md", className = "" }: AvatarProps) {
  const resolved = resolveMediaUrl(src);
  const initials = getInitials(name);

  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-primary-muted font-bold text-primary ${sizeClasses[size]} ${className}`}
    >
      {resolved ? (
        <img
          src={resolved}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <span aria-hidden>{initials}</span>
      )}
    </span>
  );
}

export default Avatar;
