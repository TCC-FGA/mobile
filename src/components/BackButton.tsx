import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../core/theme';

type Props = {
  goBack: () => void;
};

const BackButton = ({ goBack }: Props) => {
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: insets.top,
      left: 10,
    },
  });

  return (
    <IconButton
      icon={({ size }) => (
        <MaterialCommunityIcons name="arrow-left" size={size} color={theme.colors.primary} />
      )}
      size={28}
      onPress={goBack}
      style={styles.container}
    />
  );
};

export default memo(BackButton);