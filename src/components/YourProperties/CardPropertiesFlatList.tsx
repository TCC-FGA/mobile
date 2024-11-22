import { FlatList, View, Image } from 'react-native';
import { Surface, Text } from 'react-native-paper';

function CardPropertiesFlatList({ properties, navigation }) {
  return (
    <FlatList
      data={properties}
      renderItem={({ item }) => (
        <CardPropertiesItem
          property={item}
          onPress={() => navigation.navigate('PropertyDetail', { property: item })}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}

function CardPropertiesItem({ property, onPress }) {
  return (
    <Surface mode="flat" style={styles.cardProperties}>
      <View>
        <Image
          source={{ uri: 'https://picsum.photos/seed/houses/540' }}
          style={{ width: 170, height: 140, borderRadius: 8 }}
        />
      </View>
      <View style={styles.cardContentProperties}>
        <Text variant="titleMedium" style={{ fontWeight: 500 }}>
          Brasília, Feira de Santana
        </Text>
        <Text variant="bodyMedium">Alugada</Text>
        <Text variant="titleMedium" style={{ fontWeight: 700 }}>
          R$ 1.500,00
        </Text>
      </View>
    </Surface>
  );
}

export default CardPropertiesFlatList;
