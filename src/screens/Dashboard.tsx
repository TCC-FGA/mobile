import React, { memo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import Background from '../components/Background';
import { useAuth } from '../hooks/useAuth';
import { Navigation } from '../types';
import AppBar from '~/components/AppBar/AppBar';
import FinancialControl from '~/components/FinancialControl/FinancialControl';
import PropertyStatus from '~/components/PropertyStatus/PropertyStatus';
import YourProperties from '~/components/YourProperties/YourProperties';

type Props = {
  navigation: Navigation;
};

const Dashboard = ({ navigation }: Props) => {
  const { user, signOut } = useAuth();

  return (
    <>
      <AppBar />
      <ScrollView>
        <Background>
          <FinancialControl />
          <PropertyStatus />
          <YourProperties />
        </Background>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({});

export default memo(Dashboard);
