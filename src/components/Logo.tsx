import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image
    source={{
      uri: 'https://drive.google.com/thumbnail?id=1VzjwJOuJd5xHK_pIYLHblWbfAI0aSMV-',
    }}
    style={styles.image}
  />
);

const styles = StyleSheet.create({
  image: {
    width: 128,
    height: 128,
    marginBottom: 12,
    borderRadius: 64,
  },
});

export default memo(Logo);
