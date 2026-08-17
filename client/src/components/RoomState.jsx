import { InlineState } from "./Primitives";

const STATE_COPY = {
  loading: {
    eyebrow: "QUIET ROOM",
    title: "Opening the room",
    body: "Gathering the latest conversation...",
  },
  empty: {
    eyebrow: "A ROOM WITH SPACE",
    title: "The room is quiet.",
    body: "Be the first to leave something here.",
  },
  error: {
    eyebrow: "A SMALL INTERRUPTION",
    title: "The room could not load.",
    body: "Your conversation is safe. Try reconnecting when you are ready.",
  },
};

const RoomState = ({ kind = "empty", onRetry }) => {
  const copy = STATE_COPY[kind] || STATE_COPY.empty;
  return <InlineState kind={kind} eyebrow={copy.eyebrow} title={copy.title} body={copy.body} onAction={kind === "error" ? onRetry : undefined} actionLabel="Try again" />;
};

export default RoomState;
