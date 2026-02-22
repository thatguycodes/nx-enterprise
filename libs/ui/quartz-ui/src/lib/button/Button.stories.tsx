import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    component: Button,
    title: 'Shared/Button',
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline'],
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: 'Primary Button',
        variant: 'primary',
        size: 'medium',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary Button',
        variant: 'secondary',
        size: 'medium',
    },
};

export const Outline: Story = {
    args: {
        children: 'Outline Button',
        variant: 'outline',
        size: 'medium',
    },
};

export const Small: Story = {
    args: {
        children: 'Small Button',
        variant: 'primary',
        size: 'small',
    },
};

export const Large: Story = {
    args: {
        children: 'Large Button',
        variant: 'primary',
        size: 'large',
    },
};
