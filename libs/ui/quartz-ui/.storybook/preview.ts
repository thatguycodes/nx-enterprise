import type { Preview } from '@storybook/react';

// Import design tokens CSS variables for consistent theming across all stories
import '../../../tokens/design-tokens/src/generated/css/variables.css';

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
  },
};

export default preview;

