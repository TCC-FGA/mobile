import * as React from 'react';
import { Appbar, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '~/core/theme';
import { useAuth } from '~/hooks/useAuth';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { useNavigation } from '@react-navigation/native';

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
      <Appbar.Header
        mode="center-aligned"
        elevated
        style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Action
          icon={() => (
            <MaterialCommunityIcons
              size={24}
              name="bell-badge"
              color={theme.colors.onSurfaceVariant}
            />
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

export default CustomAppBar;
