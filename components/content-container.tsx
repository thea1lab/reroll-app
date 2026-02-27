import { View, type ViewProps } from 'react-native';
import { Layout } from '@/constants/theme';

type ContentContainerProps = ViewProps & {
  maxWidth?: number;
};

export function ContentContainer({
  maxWidth = Layout.contentMaxWidth,
  style,
  ...props
}: ContentContainerProps) {
  return (
    <View
      style={[{ width: '100%', maxWidth, alignSelf: 'center' as const }, style]}
      {...props}
    />
  );
}
