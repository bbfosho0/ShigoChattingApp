import { FileText, X } from "lucide-react";

import { cn } from "lib/utils";

export interface ShigoAttachment {
  id: string;
  name: string;
  url?: string;
  type?: string;
}

export interface FileAttachmentProps {
  attachment: ShigoAttachment;
  onRemove?: (id: string) => void;
  className?: string;
}

export function FileAttachment({ attachment, onRemove, className }: FileAttachmentProps) {
  const isImage = attachment.type?.startsWith("image/") && attachment.url;

  return (
    <div className={cn("group relative flex min-w-0 items-center gap-2 rounded-md border border-border bg-secondary p-2", className)}>
      {isImage ? (
        <img src={attachment.url} alt="" className="size-9 shrink-0 rounded-sm object-cover" />
      ) : (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-card text-muted-foreground">
          <FileText size={16} strokeWidth={1.5} />
        </div>
      )}
      <p className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">{attachment.name}</p>
      {onRemove ? (
        <button
          type="button"
          onClick={() => onRemove(attachment.id)}
          className="flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:shadow-focus"
          aria-label={`Remove ${attachment.name}`}
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      ) : null}
    </div>
  );
}
