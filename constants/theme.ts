import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#3D2C2C',
    textSecondary: '#8B7355',
    background: '#FFF8F0',
    tint: '#E8734A',
    tintLight: '#FFF0EB',
    icon: '#8B7355',
    surface: '#FFFFFF',
    border: '#F0E6DC',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
  },
  dark: {
    text: '#F5EDE5',
    textSecondary: '#A89585',
    background: '#1A1412',
    tint: '#F0956A',
    tintLight: '#2D1F1A',
    icon: '#A89585',
    surface: '#2A2220',
    border: '#3D3230',
    success: '#66BB6A',
    warning: '#FFB74D',
    danger: '#EF5350',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
