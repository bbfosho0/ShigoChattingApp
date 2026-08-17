

import react from '@vitejs/plugin-react';
import { transformWithEsbuild } from 'vite';

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-mcp",
    "@storybook/addon-vitest",
    "@storybook/addon-designs",
    "storybook-dark-mode",
    "@chromatic-com/storybook"
  ],
  "framework": "@storybook/react-vite",
  "staticDirs": [
    "..\\public"
  ],
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    plugins: [
      {
        name: 'shigochat-tsx-loader',
        enforce: 'pre',
        async transform(code, id) {
          if (id.includes('/src/') && id.endsWith('.tsx')) {
            return transformWithEsbuild(code, id, { loader: 'tsx', jsx: 'automatic' });
          }
          return null;
        },
      },
      react(),
      ...(viteConfig.plugins || []),
    ],
    esbuild: {
      ...viteConfig.esbuild,
      loader: 'jsx',
      include: /src[\\/].*\.jsx?$/,
    },
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      include: [...(viteConfig.optimizeDeps?.include || []), 'aria-query', 'lz-string', 'pretty-format'],
    },
  })
};
export default config;
