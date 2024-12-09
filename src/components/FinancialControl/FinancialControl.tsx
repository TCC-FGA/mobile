import React from 'react';
import { ProgressChart } from 'react-native-chart-kit';
import { theme } from '~/core/theme';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DashboardPaymentStatusDTO } from '~/api/dashboard';
import { parseFloatBR, parseFloatBRNumber } from '~/helpers/convert_data';

const width = Dimensions.get('window').width;
const height = width * 0.4;

type FinancialControlProps = {
  paymentStatus: DashboardPaymentStatusDTO | null;
};

const FinancialControl: React.FC<FinancialControlProps> = ({ paymentStatus }) => {
  const graphStyle = {
    marginVertical: 8,
    transform: [{ rotate: '180deg' }],
  };

  if (!paymentStatus) {
    return (
      <View style={styles.containerHeaderFinancialControl}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const totalPayments =
    paymentStatus.total_monthly_paid +
    paymentStatus.total_monthly_overdue +
    paymentStatus.total_monthly_pending;

  const progressChartDataAmountsReceived = {
    labels: ['Total Recebido'],
    data:
      totalPayments > 0
        ? [parseFloatBRNumber(paymentStatus.total_monthly_paid / totalPayments)]
        : [0],
    value: paymentStatus.total_monthly_paid,
  };

  const Incoming = {
    labels: ['Em aberto'],
    value: paymentStatus.total_monthly_pending,
  };

  const TotalValue = {
    labels: ['Em atraso'],
    value: paymentStatus.total_monthly_overdue,
  };

  const getSizedValue = () => {
    const str = parseFloatBR(progressChartDataAmountsReceived.value);
    const baseFontSize = width * 0.05;
    if (str.length >= 9) {
      return baseFontSize * 0.8;
    }
    return baseFontSize;
  };

  return (
    <View style={styles.containerHeaderFinancialControl}>
      <View style={styles.headerWrapper}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.onSurface }}>
            Controle Financeiro
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
      <View style={styles.containerContentFinancialControl}>
        <View style={styles.containerIncoming}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 32,
            }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>R$</Text>{' '}
            {parseFloatBR(Incoming.value)}
          </Text>
          <Text style={{ fontSize: 16, color: theme.colors.onSurfaceVariant, lineHeight: 24 }}>
            {Incoming.labels[0]}
          </Text>
        </View>

        <View style={styles.containerChart}>
          <ProgressChart
            data={progressChartDataAmountsReceived}
            width={width * 0.4}
            height={height}
            strokeWidth={8}
            radius={width * 0.18}
            chartConfig={{
              backgroundGradientFromOpacity: 0, // Define opacidade 0 no fundo
              backgroundGradientToOpacity: 0, // Define opacidade 0 no fundo
              color: (opacity = 1) => `rgba(14, 107, 88, ${opacity})`,
              backgroundColor: 'transparent',
              strokeWidth: 2, // optional, default 3
            }}
            style={graphStyle}
            hideLegend
          />
          <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: getSizedValue(),
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 42,
              }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>R$</Text>{' '}
              {parseFloatBR(progressChartDataAmountsReceived.value)}
            </Text>
            <Text style={{ fontSize: 16, color: theme.colors.onSurfaceVariant, lineHeight: 24 }}>
              {progressChartDataAmountsReceived.labels[0]}
            </Text>
          </View>
        </View>

        <View style={styles.containerTotalAmount}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 32,
            }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>R$</Text>{' '}
            {parseFloatBR(TotalValue.value)}
          </Text>
          <Text style={{ fontSize: 16, color: theme.colors.onSurfaceVariant, lineHeight: 24 }}>
            {TotalValue.labels[0]}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerHeaderFinancialControl: {
    marginVertical: 16,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  containerChart: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerContentFinancialControl: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
  },
  containerIncoming: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerTotalAmount: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FinancialControl;
