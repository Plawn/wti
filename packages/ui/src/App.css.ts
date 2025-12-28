import { style } from '@vanilla-extract/css';
import { vars } from './themes/contract.css';

export const root = style({
  fontFamily: vars.fonts.sans,
  fontSize: vars.fontSizes.md,
  color: vars.colors.text,
  backgroundColor: vars.colors.bg,
  minHeight: '100vh',
  width: '100%',
});

export const loading = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  color: vars.colors.textMuted,
});

export const error = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  color: vars.colors.error,
  padding: vars.spacing[4],
  textAlign: 'center',
});

export const layout = style({
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  minHeight: '100vh',
});

export const sidebar = style({
  backgroundColor: vars.colors.bgSecondary,
  borderRight: `1px solid ${vars.colors.border}`,
  overflowY: 'auto',
});

export const sidebarHeader = style({
  padding: vars.spacing[4],
  borderBottom: `1px solid ${vars.colors.border}`,
});

export const title = style({
  fontSize: vars.fontSizes.lg,
  fontWeight: vars.fontWeights.semibold,
  margin: 0,
  marginBottom: vars.spacing[1],
});

export const version = style({
  fontSize: vars.fontSizes.sm,
  color: vars.colors.textMuted,
});

export const main = style({
  padding: vars.spacing[6],
  overflowY: 'auto',
});

export const welcome = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  textAlign: 'center',
  color: vars.colors.textMuted,
});
