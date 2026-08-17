import '../src/index.css';
import React from 'react';
import { MotionConfig } from 'framer-motion';
import { useDarkMode } from 'storybook-dark-mode';
import { MusicProvider } from '../src/context/MusicContext';
import { ThemeContext } from '../src/context/ThemeContext';

const StoryProviders = ({ children }) => {
  const darkMode = useDarkMode();
  React.useEffect(() => {
    document.documentElement.dataset.storybookStable = 'true';
    document.documentElement.style.setProperty('transition', 'none', 'important');
    document.body.style.setProperty('transition', 'none', 'important');
    return () => {
      delete document.documentElement.dataset.storybookStable;
      document.documentElement.style.removeProperty('transition');
      document.body.style.removeProperty('transition');
    };
  }, []);
  const theme = {
    darkMode,
    toggleDarkMode: () => {},
    setTheme: () => {},
  };

  return React.createElement(
    ThemeContext.Provider,
    { value: theme },
    React.createElement(
      MotionConfig,
      { reducedMotion: 'always' },
      React.createElement(
        React.Fragment,
        null,
        React.createElement('style', null, `html, body, #root, #storybook-root, [data-storybook-stable="true"] * { transition: none !important; animation: none !important; } html *, body *, #root *, #storybook-root *, html *::before, html *::after, body *::before, body *::after { transition: none !important; animation: none !important; } [data-storybook-stable="true"] [style*="opacity"] { opacity: 1 !important; } [data-storybook-stable="true"] [style*="transform"] { transform: none !important; } .sb-show-main .sc-room-shell, .sb-show-main .sc-room-shell *, .sb-show-main .sc-auth-shell, .sb-show-main .sc-auth-shell *, .sb-show-main .sc-splash, .sb-show-main .sc-splash * { opacity: 1 !important; transform: none !important; }`),
        React.createElement(MusicProvider, null, children),
      ),
    ),
  );
};

export const decorators = [
  (Story) => React.createElement(StoryProviders, null, React.createElement(Story)),
];

export const parameters = {
  darkMode: {
    current: 'light',
    classTarget: 'html',
    stylePreview: true,
  },
  layout: 'padded',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
};

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters,
};

export default preview;
