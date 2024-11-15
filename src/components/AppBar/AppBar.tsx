import * as React from 'react';
import { Appbar, Avatar, Portal, Modal } from 'react-native-paper';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '~/core/theme';
import { useAuth } from '~/hooks/useAuth';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { useNavigation } from '@react-navigation/native';

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
const modeAppBar = Platform.OS === 'ios' ? 'center-aligned' : 'small';

type AppBarProps = {
  title: string;
};

const CustomAppBar: React.FC<AppBarProps> = ({ title }) => {
  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const handleToggleModal = () => {
    navigation.navigate('NotificationsScreen');
  };

  return (
    <>
      <Appbar.Header mode="center-aligned" theme={theme}>
        <Appbar.Action
          icon={() => (
            <MaterialCommunityIcons size={24} name="bell" color={theme.colors.onSurfaceVariant} />
          )}
          onPress={handleToggleModal}
        />
        <Appbar.Content title={title} titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action
          size={36}
          icon={() => (
            <Avatar.Image
              size={36}
              source={{ uri: user.photo ?? 'https://i.imgur.com/xCvzudW.png' }}
            />
          )}
          onPress={() => navigation.navigate('AccountSettingsScreen')}
        />
      </Appbar.Header>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
});

export default CustomAppBar;
