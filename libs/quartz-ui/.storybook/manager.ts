import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'light',

  // Brand
  brandTitle: 'Quartz UI',
  brandUrl: '/',
  brandImage: '/assets/quartz-logo.svg',
  brandTarget: '_self',

  // Colors
  colorPrimary: '#4e6d22',   // moss-500
  colorSecondary: '#3a5218', // moss-600

  // UI
  appBg: '#f5f5f5',          // smoke-10 adjacent
  appContentBg: '#ffffff',
  appPreviewBg: '#f8f8f8',   // smoke-5
  appBorderColor: '#d4d4d4', // smoke-20
  appBorderRadius: 8,

  // Toolbar
  barTextColor: '#6f6f6f',    // smoke-60
  barHoverColor: '#4e6d22',   // moss-500
  barSelectedColor: '#4e6d22', // moss-500
  barBg: '#ffffff',

  // Text
  textColor: '#181818',       // smoke-90
  textInverseColor: '#ffffff',
});

addons.setConfig({
  theme,
});
