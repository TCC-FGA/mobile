import { theme } from '~/core/theme';
import { StyleSheet, View, Text } from 'react-native';
import { Icon, Surface } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type CardStatusProps = {
  statusValue: number;
  label: string;
  icon?: IconSource;
};

function CardStatus({ statusValue, label, icon }: CardStatusProps) {
  return (
    <Surface style={styles.cardStatus} elevation={0}>
      {icon ? (
        <Icon size={32} source={icon} />
      ) : (
        <Icon
          size={32}
          source={() => (
            <MaterialCommunityIcons name="image-album" size={32} color={theme.colors.primary} />
          )}
        />
      )}
      <View style={styles.cardContent}>
        <Text style={{ fontSize: 20, color: theme.colors.onSurfaceVariant, fontWeight: 'bold' }}>
          {statusValue.toString().padStart(2, '0')}
        </Text>
        <Text style={{ fontSize: 14, color: theme.colors.onSurfaceVariant }}>{label}</Text>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  cardStatus: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 16,
    backgroundColor: theme.colors.surface,
    flex: 1,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'column',
    gap: 4,
  },
});

export default CardStatus;
