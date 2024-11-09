import React, { memo, useState, useEffect } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
  Text,
  IconButton,
  Divider,
  Appbar,
  SegmentedButtons,
  Surface,
  FAB,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '~/core/theme';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { getRents } from '~/api/rents';
import { getTemplates } from '~/api/templates';
import { RentDTO } from '~/dtos/RentDTO';
import { TemplateDTO } from '~/dtos/TemplateDTO';
import { set } from 'date-fns';
import { capitalizeWords } from '~/helpers/utils';

const ContractsScreen = () => {
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [value, setValue] = useState('templates');
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [signedContracts, setSignedContracts] = useState<RentDTO[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isLoadingSignedContracts, setIsLoadingSignedContracts] = useState(false);

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const templatesData = await getTemplates();
      setTemplates(templatesData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os templates.');
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const fetchSignedContracts = async () => {
    setIsLoadingSignedContracts(true);
    try {
      const signedContractsData = await getRents();
      setSignedContracts(signedContractsData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os contratos assinados.');
    } finally {
      setIsLoadingSignedContracts(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchSignedContracts();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedContract(expandedContract === id ? null : id);
  };

  const renderTemplateItem = ({ item }: { item: TemplateDTO }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => toggleExpand(item.id.toString())}>
      <View style={styles.contractContainer}>
        <View style={styles.contractInfo}>
          <MaterialCommunityIcons
            name="file-document-outline"
            size={48}
            color={theme.colors.primary}
          />
          <View style={styles.info}>
            <Text style={styles.title}>{item.template_name}</Text>
            {expandedContract === item.id.toString() && (
              <>
                <Text style={styles.details}>{item.description || 'N/A'}</Text>
                <Text style={styles.details}>
                  <Text style={styles.bold}>Tipo: </Text>
                  {capitalizeWords(item.contract_type)}
                </Text>
                <Text style={styles.details}>
                  <Text style={styles.bold}>Garagem: </Text>
                  {item.garage ? 'Sim' : 'Não'}
                </Text>
                <Text style={styles.details}>
                  <Text style={styles.bold}>Garantia: </Text>
                  {capitalizeWords(item.warranty)}
                </Text>
                <Text style={styles.details}>
                  <Text style={styles.bold}>Animais: </Text>
                  {item.animals ? 'Sim' : 'Não'}
                </Text>
                <Text style={styles.details}>
                  <Text style={styles.bold}>Subarrendamento: </Text>
                  {item.sublease ? 'Sim' : 'Não'}
                </Text>
              </>
            )}
          </View>
          <IconButton
            icon={({ size, color }) => (
              <MaterialCommunityIcons
                name={expandedContract === item.id.toString() ? 'chevron-up' : 'chevron-down'}
                size={size}
                color={color}
              />
            )}
            onPress={() => toggleExpand(item.id.toString())}
            style={styles.iconButton}
          />
        </View>
        <Divider className="mt-0 mb-0 p-0" />
      </View>
    </TouchableOpacity>
  );

  const renderSignedContractItem = ({ item }: { item: RentDTO }) => (
    <Surface style={styles.surface}>
      <View style={styles.signedContractInfo}>
        <MaterialCommunityIcons name="file-pdf-box" size={48} color={theme.colors.primary} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.house.nickname}</Text>
          <Text style={styles.details}>{item.signed_pdfExpand}</Text>
        </View>
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcons name="download" size={size} color={color} />
          )}
          onPress={() => console.log('Download link:', item.signed_pdfExpand)}
        />
      </View>
    </Surface>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Contratos" />
      </Appbar.Header>
      <SafeAreaView style={styles.container}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: 'templates',
              label: 'Modelos',
              icon: 'file',
            },
            {
              value: 'signed',
              label: 'Assinados',
              icon: 'file-document-edit-outline',
            },
          ]}
        />
        {value === 'templates' ? (
          <>
            <FlatList
              data={templates}
              renderItem={renderTemplateItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              onRefresh={fetchTemplates}
              refreshing={isLoadingTemplates}
              ListEmptyComponent={() =>
                !isLoadingTemplates && (
                  <View style={{ alignItems: 'center', marginTop: 16 }}>
                    <Text style={{ fontSize: 16, color: '#666' }}>Nenhum template encontrado.</Text>
                  </View>
                )
              }
            />
            <FAB
              icon="file-plus"
              style={{ position: 'absolute', margin: 16, right: 0, bottom: 50 }}
              onPress={() =>
                navigation.navigate('ContractsStack', {
                  screen: 'ContractsDetails',
                  params: { templateId: null },
                })
              }
            />
          </>
        ) : (
          <>
            <FlatList
              data={signedContracts}
              renderItem={renderSignedContractItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              onRefresh={fetchSignedContracts}
              refreshing={isLoadingSignedContracts}
              ListEmptyComponent={() =>
                !isLoadingSignedContracts && (
                  <View style={{ alignItems: 'center', marginTop: 16 }}>
                    <Text style={{ fontSize: 16, color: '#666' }}>
                      Nenhum contrato assinado encontrado.
                    </Text>
                  </View>
                )
              }
            />
          </>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingHorizontal: 0,
    padding: 0,
    paddingVertical: 0,
    marginTop: 16,
  },
  contractContainer: {
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    paddingBottom: 0,
  },
  contractInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signedContractInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  surface: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  iconButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default memo(ContractsScreen);
