import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Import design tokens CSS variables
import '../../../design-tokens/src/generated/css/variables-light.css';
import '../../../design-tokens/src/generated/css/variables-dark.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    themes: {
      default: 'Default Light',
      list: [
        { name: 'Default Light', value: 'dark' },
        { name: 'Default Dark', value: 'light' },
      ],
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        'Default Light': 'light',
        'Default Dark': 'dark',
      },
      defaultTheme: 'Default Light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
