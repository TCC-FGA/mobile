import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
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
    image: {
      width: 24,
      height: 24,
    },
  });

  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      <IconButton icon="arrow-left" size={28} iconColor={theme.colors.primary} onPress={goBack} />
    </TouchableOpacity>
  );
};

export default memo(BackButton);
