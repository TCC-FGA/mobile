import { theme } from '~/core/theme';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import { Button, IconButton, Surface, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const widthScreen = Dimensions.get('screen').width;

function YourProperties() {
  return (
    <View style={styles.containerStatus}>
      <View style={styles.headerWrapper}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.onSurface }}>
          Seus Imóveis
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
      <View></View>
    </View>
  );
}
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
  cardProperties: {
    padding: 4,
    gap: 12,
  },
  cardContentProperties: {
    gap: 4,
  },
});

export default YourProperties;
