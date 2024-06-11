import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Logo = () => (
  <View style={styles.container}>
    <Image
      source={{
        uri: 'https://drive.google.com/thumbnail?id=1g4BzYInD4VkH4xMPfJHxk2rT2pxI7wza',
      }}
      style={styles.image}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 136,
    height: 136,
    borderRadius: 68,
    borderWidth: 1,
    borderColor: '#600EE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 16,
  },
  image: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
});

export default memo(Logo);
