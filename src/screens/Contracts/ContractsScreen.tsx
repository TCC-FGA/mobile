import React, { memo, useState } from 'react';
import { View, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton, Divider, Appbar, SegmentedButtons, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { theme } from '~/core/theme';

const mockTemplates = [
  {
    id: '1',
    title: 'Contrato de Aluguel Residencial',
    details: 'Detalhes do contrato de aluguel residencial...',
  },
  {
    id: '2',
    title: 'Contrato de Aluguel Comercial',
    details: 'Detalhes do contrato de aluguel comercial...',
  },
  { id: '3', title: 'Contrato de Sublocação', details: 'Detalhes do contrato de sublocação...' },
];

const mockSignedContracts = [
  {
    id: '1',
    name: 'Contrato_Residencial_Assinado.pdf',
    link: 'https://example.com/Contrato_Residencial_Assinado.pdf',
  },
  {
    id: '2',
    name: 'Contrato_Comercial_Assinado.pdf',
    link: 'https://example.com/Contrato_Comercial_Assinado.pdf',
  },
  {
    id: '3',
    name: 'Contrato_Sublocacao_Assinado.pdf',
    link: 'https://example.com/Contrato_Sublocacao_Assinado.pdf',
  },
];

const ContractsScreen = () => {
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const navigation = useNavigation();
  const [value, setValue] = useState('templates');

  const toggleExpand = (id: string) => {
    setExpandedContract(expandedContract === id ? null : id);
  };

  const renderTemplateItem = ({ item }: { item: (typeof mockTemplates)[0] }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => toggleExpand(item.id)}>
      <View style={styles.contractContainer}>
        <View style={styles.contractInfo}>
          <MaterialCommunityIcons
            name="file-document-outline"
            size={48}
            color={theme.colors.primary}
          />
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            {expandedContract === item.id && <Text style={styles.details}>{item.details}</Text>}
          </View>
          <IconButton
            icon={({ size, color }) => (
              <MaterialCommunityIcons
                name={expandedContract === item.id ? 'chevron-up' : 'chevron-down'}
                size={size}
                color={color}
              />
            )}
            onPress={() => toggleExpand(item.id)}
          />
        </View>
        <Divider className="mt-0 mb-0 p-0" />
      </View>
    </TouchableOpacity>
  );

  const renderSignedContractItem = ({ item }: { item: (typeof mockSignedContracts)[0] }) => (
    <Surface style={styles.surface}>
      <View style={styles.signedContractInfo}>
        <MaterialCommunityIcons name="file-pdf-box" size={48} color={theme.colors.primary} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.name}</Text>
        </View>
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcons name="download" size={size} color={color} />
          )}
          onPress={() => console.log('Download link:', item.link)}
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
          <FlatList
            data={mockTemplates}
            renderItem={renderTemplateItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        ) : (
          <FlatList
            data={mockSignedContracts}
            renderItem={renderSignedContractItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
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
});

export default memo(ContractsScreen);
