import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { cn } from "lib/utils";

export type PresenceState = "online" | "away" | "offline";

const presenceClasses: Record<PresenceState, string> = {
  online: "bg-shigo-presence-online",
  away: "bg-shigo-presence-away",
  offline: "bg-shigo-presence-offline",
};

export interface PresenceAvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  presence?: PresenceState;
  avatarClassName?: string;
  showPresence?: boolean;
}

export function PresenceAvatar({
  src,
  alt = "",
  fallback,
  presence = "offline",
  avatarClassName,
  className,
  showPresence = true,
  ...props
}: PresenceAvatarProps) {
  return (
    <div
      className={cn("relative inline-flex shrink-0", className)}
      data-presence={presence}
      {...props}
    >
      <Avatar className={cn("size-10", avatarClassName)}>
        {src ? <AvatarImage src={src} alt={alt} /> : null}
        <AvatarFallback className="text-xs font-semibold text-foreground">
          {fallback}
        </AvatarFallback>
      </Avatar>
      {showPresence ? (
        <span
          className={cn(
            "absolute bottom-0 right-0 size-3 rounded-full border-2 border-background",
            presenceClasses[presence]
          )}
          aria-label={`Presence: ${presence}`}
          role="img"
        />
      ) : null}
    </div>
  );
}
