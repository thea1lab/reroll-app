import { useWindowDimensions } from 'react-native';
import { Breakpoints } from '@/constants/theme';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= Breakpoints.tablet;
  const isLargeTablet = width >= Breakpoints.largeTablet;

  return {
    width,
    height,
    isTablet,
    isLargeTablet,
    groupColumns: isLargeTablet ? 4 : isTablet ? 3 : 2,
    recipeColumns: isTablet ? 2 : 1,
    emojiColumns: isLargeTablet ? 10 : isTablet ? 8 : 6,
  };
}
