import React, { memo, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import Background from '../components/Background';
import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../types';
import CustomAppBar from '~/components/AppBar/AppBar';
import FinancialControl from '~/components/FinancialControl/FinancialControl';
import PropertyStatus from '~/components/PropertyStatus/PropertyStatus';
import YourProperties from '~/components/YourProperties/YourProperties';
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

  useEffect(() => {
    const fetchHousesAvailability = async () => {
      try {
        const data = await getDashboardHousesAvailability();
        setHousesAvailability(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível obter os dados de disponibilidade das casas.');
        console.error('Erro ao obter os dados de disponibilidade das casas:', error);
      }
    };

    const fetchPaymentStatus = async () => {
      try {
        const data = await getDashboardPaymentStatus();
        setPaymentStatus(data);
        console.log(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível obter os dados do status de pagamento.');
        console.error('Erro ao obter os dados do status de pagamento:', error);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const cashFlowData = await getDashboardCashFlow();
        setCashFlow(cashFlowData);

        const housesAvailabilityDashboardTotals = await getDashboardTotals();
        sethousesAvailabilityDashboardTotals(housesAvailabilityDashboardTotals);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível obter os dados do dashboard.');
        console.error('Erro ao obter os dados do dashboard:', error);
      }
    };

    fetchDashboardData();

    fetchPaymentStatus();
    fetchHousesAvailability();
  }, []);

  return (
    <>
      <CustomAppBar title="Dashboard" />
      <ScrollView>
        <Background>
          <FinancialControl paymentStatus={paymentStatus} />
          <PropertyStatus housesAvailability={housesAvailability} />
          <DashboardTotals
            cashFlow={cashFlow}
            housesAvailability={housesAvailabilityDashboardTotals}
          />
        </Background>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({});

export default memo(Dashboard);
