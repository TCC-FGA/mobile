import React, { memo } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
};

const Background = ({ children }: Props) => (
  <SafeAreaProvider>
    <KeyboardAvoidingView style={styles.container} behavior="position">
      <SafeAreaView>{children}</SafeAreaView>
    </KeyboardAvoidingView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    backgroundColor: '#fff',
  },
});

export default memo(Background);
