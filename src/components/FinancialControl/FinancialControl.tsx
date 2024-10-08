import { ProgressChart } from 'react-native-chart-kit';
import { Incoming, progressChartDataAmountsReceived, TotalValue } from '~/data/FinancialControl';
import { theme } from '~/core/theme';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const width = Dimensions.get('window').width;
const height = width * 0.4;

function FinancialControl() {
  const graphStyle = {
    marginVertical: 8,
    transform: [{ rotate: '180deg' }], // Gira para parecer um semicírculo
    /*  ...chartConfig.style, */
  };

  return (
    <View style={styles.containerHeaderFinancialControl}>
      <View style={styles.headerWrapper}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.onSurface }}>
          Controle Financeiro
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
      <View style={styles.containerContentFinancialControl}>
        <View style={styles.containerIncoming}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 32,
            }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>R$</Text>{' '}
            {Incoming.value >= 1000
              ? Incoming.value / 1000
              : Incoming.value < 10
                ? `0${Incoming.value}`
                : Incoming.value}
            {Incoming.value >= 1000 && (
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>mil</Text>
            )}
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
                fontSize: 28,
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 42,
              }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>R$</Text>{' '}
              {progressChartDataAmountsReceived.value >= 1000
                ? progressChartDataAmountsReceived.value / 1000
                : progressChartDataAmountsReceived.value < 10
                  ? `0${progressChartDataAmountsReceived.value}`
                  : progressChartDataAmountsReceived.value}
              {progressChartDataAmountsReceived.value >= 1000 && (
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>mil</Text>
              )}
            </Text>
            <Text style={{ fontSize: 16, color: theme.colors.onSurfaceVariant, lineHeight: 24 }}>
              {progressChartDataAmountsReceived.labels[0]}
            </Text>
          </View>
        </View>

        <View style={styles.containerTotalAmount}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 32,
            }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>R$</Text>{' '}
            {TotalValue.value >= 1000
              ? TotalValue.value / 1000
              : TotalValue.value < 10
                ? `0${TotalValue.value}`
                : TotalValue.value}
            {TotalValue.value >= 1000 && (
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>mil</Text>
            )}
          </Text>
          <Text style={{ fontSize: 16, color: theme.colors.onSurfaceVariant, lineHeight: 24 }}>
            {TotalValue.labels[0]}
          </Text>
        </View>
      </View>
    </View>
  );
}
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
    gap: 16,
    alignItems: 'center',
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
