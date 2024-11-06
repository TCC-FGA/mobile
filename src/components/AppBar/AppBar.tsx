import * as React from 'react';
import { Appbar, Avatar, MD3LightTheme } from 'react-native-paper';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '~/core/theme';
import { useAuth } from '~/hooks/useAuth';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
const modeAppBar = Platform.OS === 'ios' ? 'center-aligned' : 'small';

const AppBar = () => {
  const { user, signOut } = useAuth();
  return (
    <Appbar.Header mode={modeAppBar} theme={theme}>
      <Appbar.Action
        icon={() => (
          <MaterialCommunityIcons size={24} name="bell" color={theme.colors.onSurfaceVariant} />
        )}
        onPress={() => {}}
      />
      <Appbar.Content title="Dashboard" />

      <Appbar.Action
        size={36}
        icon={() => <Avatar.Image size={36} source={require('@assets/avatar.png')} />}
        onPress={() => {
          alert('Clicou no avatar');
        }}
      />
    </Appbar.Header>
  );
};

export default AppBar;
