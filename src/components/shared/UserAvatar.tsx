import React, { useState } from "react";

interface UserAvatarProps {
  /** Full name for fallback initials */
  fullName?: string | null;
  /** Google profile photo URL */
  photoUrl?: string | null;
  /** Tailwind size class e.g. "w-8 h-8" */
  size?: string;
  /** Extra classes */
  className?: string;
}

/**
 * UserAvatar — shows Google profile photo when available,
 * falls back to styled initials badge.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  fullName,
  photoUrl,
  size = "w-9 h-9",
  className = "",
}) => {
  const [imgError, setImgError] = useState(false);

  const initials = fullName
    ? fullName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const showPhoto = photoUrl && !imgError;

  return (
    <div
      className={`${size} rounded-full flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-white ${className}`}
      aria-label={fullName || "User avatar"}
    >
      {showPhoto ? (
        <img
          src={photoUrl}
          alt={fullName || "Profile"}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-emerald-700 text-white font-bold text-xs select-none">
          {initials}
        </div>
      )}
    </div>
  );
};
