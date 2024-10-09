import React, { memo } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Appbar, Divider, Avatar, IconButton, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { useNavigation } from '@react-navigation/native';
import { theme } from '~/core/theme';
const SeeMoreScreen = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const onNavigate = (screen: string) => {
    console.log(`Navigating to ${screen}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Appbar com ícone de usuário e sino de notificação */}
      <Appbar.Header>
        <Appbar.Content title="Mais Opções" color={theme.colors.primary} />
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          )}
          size={24}
          iconColor="black"
          onPress={() => console.log('Notification pressed')}
        />
        <Avatar.Image size={40} source={require('@assets/avatar.png')} />
      </Appbar.Header>

      {/* Listagem de itens usando List.Item para estilo similar ao Drawer */}
      <View style={styles.listContainer}>
        <List.Section>
          {/* Item Propriedades */}
          <List.Item
            title="Propriedades"
            left={() => <MaterialCommunityIcons name="home-city-outline" size={24} />}
            onPress={() => onNavigate('PropertiesScreen')}
            style={styles.listItem}
          />

          {/* Item Inquilinos */}
          <List.Item
            title="Inquilinos"
            left={() => <MaterialCommunityIcons name="account-outline" size={24} />}
            onPress={() => navigation.navigate('TenantsStack', { screen: 'TenantsScreen' })}
            style={styles.listItem}
          />

          {/* Item Casas */}
          <List.Item
            title="Casas"
            left={() => <MaterialCommunityIcons name="home-outline" size={24} />}
            style={styles.listItem}
            onPress={() =>
              navigation.navigate('HousesStack', {
                screen: 'HousesScreen',
                params: {
                  propertyId: undefined,
                },
              })
            }
          />

          {/* Item Contratos */}
          <List.Item
            title="Contratos"
            left={() => <MaterialCommunityIcons name="file-document-outline" size={24} />}
            onPress={() => onNavigate('ContractsScreen')}
            style={styles.listItem}
          />

          {/* Item Laudo de Vistorias */}
          <List.Item
            title="Laudo de Vistorias"
            left={() => <MaterialCommunityIcons name="clipboard-text-outline" size={24} />}
            onPress={() => onNavigate('InspectionReportsScreen')}
            style={styles.listItem}
          />

          {/* Divider */}
          <Divider style={styles.divider} />

          {/* Item Meu Perfil */}
          <List.Item
            title="Meu Perfil"
            left={() => <MaterialCommunityIcons name="account-circle-outline" size={24} />}
            onPress={() => onNavigate('ProfileScreen')}
            style={styles.listItem}
          />
        </List.Section>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listItem: {
    marginVertical: 8,
  },
  divider: {
    marginVertical: 16,
  },
});

export default memo(SeeMoreScreen);
