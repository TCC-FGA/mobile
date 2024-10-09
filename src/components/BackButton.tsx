import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
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
      zIndex: 1,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={goBack}>
      <IconButton
        icon={({ size }) => (
          <MaterialCommunityIcons name="arrow-left" size={28} color={theme.colors.primary} />
        )}
      />
    </TouchableOpacity>
  );
};

export default memo(BackButton);
