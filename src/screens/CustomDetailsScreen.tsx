import React, { useState, useEffect, memo } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Clipboard } from 'react-native';
import { Appbar, Card, Text, Button, Avatar, IconButton, Snackbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserDTO } from '~/dtos/UserDTO';
import { PropertiesDTO } from '~/dtos/PropertiesDTO';
import { TenantDTO } from '~/dtos/TenantDTO';
import { theme } from '~/core/theme';

type DataTypes = UserDTO | PropertiesDTO | TenantDTO;

type DetailsAllScreenProps<T extends DataTypes> = {
  data: T;
  title: string;
  fieldsToShow: (keyof T)[];
  labels: { [key in keyof T]?: string };
};

const CustomDetailsScreen = <T extends DataTypes>() => {
  const route = useRoute();
  const navigation = useNavigation();
  const { data, title, fieldsToShow, labels } = route.params as DetailsAllScreenProps<T>;

  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  const renderDetails = () => {
    if (!data) {
      return null;
    }

    return fieldsToShow.map((field) => (
      <View key={field as string} style={styles.detailContainer}>
        <Text variant="bodyMedium" style={styles.detailKey}>
          {labels[field] ||
            (typeof field === 'string'
              ? field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')
              : field.toString())}
          :
        </Text>
        <Text variant="bodyMedium" style={styles.detailValue}>
          {data?.[field] !== null ? data?.[field]?.toString()?.toUpperCase() : 'N/A'}
        </Text>
        <IconButton
          icon="content-copy"
          iconColor={theme.colors.primary}
          size={20}
          onPress={() => {
            Clipboard.setString(data[field]?.toString() || '');
            setSnackbarVisible(true);
          }}
        />
      </View>
    ));
  };

  const getInitials = (name: string) => {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('');
    return initials.toUpperCase();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Appbar.Header mode="center-aligned" elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={title} titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <Card>
          <Card.Content>
            <Text variant="titleLarge" style={{ alignSelf: 'center' }}>
              {title}
            </Text>
            {renderDetails()}
          </Card.Content>
          {'photo' in data && data.photo && <Card.Cover source={{ uri: data.photo }} />}
          <Card.Actions>
            <Button onPress={() => navigation.goBack()}>Voltar</Button>
          </Card.Actions>
        </Card>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        Copiado para área de transferência
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailKey: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  detailValue: {
    flex: 1,
    fontWeight: 'bold',
    color: '#666',
  },
  avatar: {
    alignSelf: 'center',
    marginVertical: 16,
  },
});

export default memo(CustomDetailsScreen);
