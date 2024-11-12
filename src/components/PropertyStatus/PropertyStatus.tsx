import React from 'react';
import { theme } from '~/core/theme';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CardStatus from '../CardStatus';
import { DashboardHousesAvailabilityDTO, DashboardTotalsDTO } from '~/api/dashboard';

const widthScreen = Dimensions.get('screen').width;

type PropertyStatusProps = {
  housesAvailability: DashboardHousesAvailabilityDTO | null;
};

const PropertyStatus: React.FC<PropertyStatusProps> = ({ housesAvailability }) => {
  return (
    <View style={styles.containerStatus}>
      <View style={styles.headerWrapper}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.onSurface }}>
          Status dos Imóveis
        </Text>
        <IconButton
          onPress={() => {
            alert('Visão geral do controle financeiro');
          }}
          icon={() => {
            return (
              <MaterialCommunityIcons
                size={24}
                name="chevron-right"
                color={theme.colors.onSurfaceVariant}
              />
            );
          }}
        />
      </View>
      <View style={styles.cardList}>
        <CardStatus
          statusValue={housesAvailability?.total_available || 0}
          label="Disponíveis"
          icon={() => <MaterialCommunityIcons name="home" size={28} color="#65A30D" />}
        />
        <CardStatus
          statusValue={housesAvailability?.total_rented || 0}
          label="Alugados"
          icon={() => <MaterialCommunityIcons name="home-account" size={28} color="#FBBF24" />}
        />
        <CardStatus
          statusValue={housesAvailability?.total_maintenance || 0}
          label="Manutenção"
          icon={() => <MaterialCommunityIcons name="home-alert" size={28} color="#DC2626" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStatus: {
    marginVertical: 8,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardList: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    maxWidth: widthScreen,
  },
  cardStatus: {
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 16,
    backgroundColor: theme.colors.surface,
  },
  cardContet: {
    flexDirection: 'column',
    gap: 4,
  },
});

export default PropertyStatus;
