import React from "react";
import "../src/index.css";
import { ShigoMotionProvider } from "../src/components/ui/shigo-motion-provider.tsx";

const preview = {
  decorators: [
    (Story) => React.createElement(
      ShigoMotionProvider,
      null,
      React.createElement(Story)
    )
  ],
  parameters: {
    layout: "padded",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    a11y: {
      test: "todo"
    }
  }
};

export default preview;
