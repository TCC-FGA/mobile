import React, { memo } from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import { Divider, List, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { useNavigation } from '@react-navigation/native';
import { theme } from '~/core/theme';
import CustomAppBar from '~/components/AppBar/AppBar';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { generateReport } from '~/api/rents';

const SeeMoreScreen = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [isLoading, setIsLoading] = React.useState(false);

  const openPdfReport = async () => {
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const pdfBlob = await generateReport();
      const pdfUri = `${FileSystem.documentDirectory}financeiro.pdf`;
      await FileSystem.writeAsStringAsync(pdfUri, pdfBlob, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartilhar Relatório Financeiro',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Erro', 'A visualização do PDF não está disponível no dispositivo.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter o PDF.');
      console.error('Erro ao obter o PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CustomAppBar title="Mais opções" />
      <SafeAreaView style={styles.container}>
        {/* Appbar com ícone de usuário e sino de notificação */}
        <Surface
          style={{ backgroundColor: theme.colors.surface }}
          className="rounded-md mt-3 m-4"
          elevation={1}>
          {/* Listagem de itens usando List.Item para estilo similar ao Drawer */}
          <View style={styles.listContainer}>
            <List.Section>
              {/* Item Meus alugueis */}
              <List.Item
                title="Gerenciar Assinatura"
                titleStyle={{ fontWeight: 'bold' }}
                left={() => (
                  <MaterialCommunityIcons
                    name="signature-freehand"
                    size={34}
                    color={theme.colors.primary}
                  />
                )}
                onPress={() => navigation.navigate('PaymentsStack', { screen: 'SignatureScreen' })}
                style={styles.listItem}
              />
              {/* Item Propriedades */}
              <List.Item
                title="Notificações"
                titleStyle={{ fontWeight: 'bold' }}
                left={() => (
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={34}
                    color={theme.colors.primary}
                  />
                )}
                onPress={() => navigation.navigate('NotificationsScreen')}
                style={styles.listItem}
              />

              {/* Item Inquilinos */}
              <List.Item
                title="Inquilinos"
                titleStyle={{ fontWeight: 'bold' }}
                left={() => (
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={34}
                    color={theme.colors.primary}
                  />
                )}
                onPress={() => navigation.navigate('TenantsStack', { screen: 'TenantsScreen' })}
                style={styles.listItem}
              />

              {/* Item Casas */}
              <List.Item
                title="Casas"
                titleStyle={{ fontWeight: 'bold' }}
                left={() => (
                  <MaterialCommunityIcons
                    name="home-outline"
                    size={34}
                    color={theme.colors.primary}
                  />
                )}
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
                titleStyle={{ fontWeight: 'bold' }}
                left={() => (
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={34}
                    color={theme.colors.primary}
                  />
                )}
                onPress={() => navigation.navigate('ContractsStack', { screen: 'ContractsScreen' })}
                style={styles.listItem}
              />

              <List.Item
                title="Gerar Relatório Financeiro"
                titleStyle={{ fontWeight: 'bold' }}
                left={() => (
                  <MaterialCommunityIcons name="finance" size={34} color={theme.colors.primary} />
                )}
                onPress={() => openPdfReport()}
                style={styles.listItem}
                right={
                  isLoading
                    ? () => (
                        <MaterialCommunityIcons
                          name="loading"
                          size={24}
                          color={theme.colors.primary}
                        />
                      )
                    : undefined
                }
              />
              {/* Item Laudo de Vistorias */}
              {/* <List.Item
                title="Laudo de Vistorias"
                left={() => (
                  <MaterialCommunityIcons
                    name="clipboard-text-outline"
                    size={34}
                    color={theme.colors.primary}
                  />
                )}
                onPress={() =>
                  navigation.navigate('PaymentsStack', { screen: 'InspectionsScreen' })
                }
                style={styles.listItem}
              /> */}

              {/* Divider */}
              <Divider style={styles.divider} />

              {/* Item Meu Perfil */}
              <List.Item
                title="Meu Perfil"
                titleStyle={{ fontWeight: 'bold' }}
                left={() => (
                  <MaterialCommunityIcons
                    name="account-circle-outline"
                    size={34}
                    color={theme.colors.primary}
                  />
                )}
                onPress={() => navigation.navigate('AccountSettingsScreen')}
                style={styles.listItem}
              />
            </List.Section>
          </View>
        </Surface>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listItem: {
    marginVertical: 2,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
});

export default memo(SeeMoreScreen);
