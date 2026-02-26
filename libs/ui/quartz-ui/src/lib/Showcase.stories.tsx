import type { Meta, StoryObj } from '@storybook/react-vite';
import { Showcase } from './Showcase';
import { ThemeProvider } from './theme/ThemeContext';
import React from 'react';

const meta = {
  component: Showcase,
  title: 'Showcase',
  decorators: [
    (Story) => (
      <ThemeProvider initialBrand="quartz">
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Showcase>;
export default meta;

type Story = StoryObj<typeof Showcase>;

export const Default = {
  args: {},
} satisfies Story;
