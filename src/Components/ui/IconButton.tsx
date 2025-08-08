import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, GestureResponderEvent } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../../Hooks/useTheme';

interface IconButtonProps {
  name: string;
  size?: number;
  color?: string;
  iconStyle?: 'solid' | 'regular' | 'brands';
  style?: ViewStyle;
  onPress?: (event: GestureResponderEvent) => void;
}

const IconButton: React.FC<IconButtonProps> = ({ name, size = 16, color, iconStyle = 'solid', style, onPress }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    root: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
    },
  }), [colors]);

  return (
    <TouchableOpacity style={[styles.root, style]} onPress={onPress}>
      <Icon name={name} iconStyle={iconStyle} size={size} color={color || colors.primary} />
    </TouchableOpacity>
  );
};

export default IconButton;


