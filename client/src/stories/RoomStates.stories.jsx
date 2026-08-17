import React from "react";
import RoomState from "../components/RoomState";

const meta = {
  title: "ShigoChat/Room states",
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/Srny3gef0k6rBZVkTFEzPC" },
    layout: "centered",
  },
};

export default meta;

export const Loading = { render: () => <RoomState kind="loading" /> };
export const Empty = { render: () => <RoomState kind="empty" /> };
export const FetchError = { render: () => <RoomState kind="error" onRetry={() => {}} /> };
