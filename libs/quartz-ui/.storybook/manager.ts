import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'light',

  // Brand
  brandTitle: 'Quartz UI',
  brandUrl: '/',
  brandImage: '/assets/quartz-logo.png',
  brandTarget: '_self',

  // UI
  appBg: '#f8fafc', // storm.5
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e2e8f0', // storm.20
  appBorderRadius: 8,

  // Toolbar default and active colors
  barTextColor: '#64748b', // storm.50
  barSelectedColor: '#7c3aed', // brand.60
  barBg: '#ffffff',
});

addons.setConfig({
  theme,
});
