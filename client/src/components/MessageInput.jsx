import React from "react";

import { ShigoComposer } from "./ui/shigo-composer";

const MessageInput = ({ onSend, disabled = false }) => (
  <ShigoComposer
    disabled={disabled}
    allowAttachments={false}
    onSend={(text) => onSend(text)}
  />
);

export default MessageInput;
