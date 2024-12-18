import React, { memo, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../types';
import CustomAppBar from '~/components/AppBar/AppBar';
import FinancialControl from '~/components/FinancialControl/FinancialControl';
import PropertyStatus from '~/components/PropertyStatus/PropertyStatus';

import {
  DashboardCashFlowDTO,
  DashboardHousesAvailabilityDTO,
  DashboardPaymentStatusDTO,
  DashboardTotalsDTO,
  getDashboardCashFlow,
  getDashboardHousesAvailability,
  getDashboardPaymentStatus,
  getDashboardTotals,
} from '~/api/dashboard';
import DashboardTotals from '~/components/PropertyStatus/DashboardTotals';

type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const { user, signOut } = useAuth();
  const [housesAvailability, setHousesAvailability] =
    useState<DashboardHousesAvailabilityDTO | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<DashboardPaymentStatusDTO | null>(null);
  const [cashFlow, setCashFlow] = useState<DashboardCashFlowDTO | null>(null);
  const [housesAvailabilityDashboardTotals, sethousesAvailabilityDashboardTotals] =
    useState<DashboardTotalsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [cashFlowData, housesAvailabilityData, paymentStatusData, dashboardTotalsData] =
        await Promise.all([
          getDashboardCashFlow(),
          getDashboardHousesAvailability(),
          getDashboardPaymentStatus(),
          getDashboardTotals(),
        ]);

      setCashFlow(cashFlowData);
      setHousesAvailability(housesAvailabilityData);
      setPaymentStatus(paymentStatusData);
      sethousesAvailabilityDashboardTotals(dashboardTotalsData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter os dados do dashboard.');
      console.error('Erro ao obter os dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <CustomAppBar title="Dashboard" />
      {loading || refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator animating size="large" />
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <FinancialControl paymentStatus={paymentStatus} />
          <PropertyStatus housesAvailability={housesAvailability} />
          <DashboardTotals
            cashFlow={cashFlow}
            housesAvailability={housesAvailabilityDashboardTotals}
          />
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    backgroundColor: '#fff',
  },
});

export default memo(Dashboard);
