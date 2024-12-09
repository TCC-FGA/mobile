import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import { DashboardCashFlowDTO, DashboardTotalsDTO } from '~/api/dashboard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '~/core/theme';
import { parseFloatBR } from '~/helpers/convert_data';

const screenWidth = Dimensions.get('window').width;

type DashboardTotalsProps = {
  cashFlow: DashboardCashFlowDTO | null;
  housesAvailability: DashboardTotalsDTO | null;
};

const DashboardTotals: React.FC<DashboardTotalsProps> = ({ cashFlow, housesAvailability }) => {
  if (!cashFlow || !housesAvailability) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const barChartData = {
    labels: ['Receitas', 'Despesas', 'Lucro'],
    datasets: [
      {
        data: [
          cashFlow.total_monthly_income,
          cashFlow.total_monthly_expenses,
          cashFlow.total_profit_monthly,
        ],
        colors: [
          (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
          (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        ],
      },
    ],
  };

  const horizontalBarChartData = {
    labels: ['Casas', 'Propriedades', 'Inquilinos'],
    datasets: [
      {
        data: [
          housesAvailability.total_houses,
          housesAvailability.total_properties,
          housesAvailability.total_tenants,
        ],
        colors: [
          (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
          (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        ],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.onSurface }}>
            Fluxo de Caixa
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
            (mês atual)
          </Text>
        </View>
        {/* <IconButton
          icon={() => {
            return (
              <MaterialCommunityIcons
                size={24}
                name="chevron-right"
                color={theme.colors.onSurfaceVariant}
              />
            );
          }}
        /> */}
      </View>
      <BarChart
        data={barChartData}
        withCustomBarColorFromData
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          formatYLabel: (value) =>
            Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
            }).format(Number(value)),
          formatTopBarValue: (value) =>
            Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
            }).format(Number(value)),
          backgroundGradientFrom: theme.colors.primary,
          backgroundGradientFromOpacity: 0.1,
          backgroundGradientToOpacity: 0,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
          propsForLabels: {
            fontWeight: 'bold',
            fontSize: 10,
          },
          propsForVerticalLabels: {
            fontSize: 15,
          },
          propsForHorizontalLabels: {
            fontSize: (() => {
              const valueString = parseFloatBR(cashFlow.total_monthly_income).replace(/[^\d]/g, '');
              const digitCount = valueString.length;
              if (digitCount > 9) return 7;
              if (digitCount > 6) return 8;
              return 9;
            })(),
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        withInnerLines={false}
        showValuesOnTopOfBars
      />

      <View style={styles.headerWrapper}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.onSurface }}>
          Resumo Geral
        </Text>
        {/* <IconButton
          icon={() => {
            return (
              <MaterialCommunityIcons
                size={24}
                name="chevron-right"
                color={theme.colors.onSurfaceVariant}
              />
            );
          }}
        /> */}
      </View>
      <BarChart
        data={horizontalBarChartData}
        width={screenWidth - 32}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: theme.colors.primary,
          backgroundGradientFromOpacity: 0.1,
          backgroundGradientToOpacity: 0,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForLabels: {
            fontWeight: 'bold',
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        fromZero
        showValuesOnTopOfBars
        withCustomBarColorFromData
        withInnerLines={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
});

export default DashboardTotals;
