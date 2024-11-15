import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Modal, Portal, List, Button, IconButton, Text, Appbar, Divider } from 'react-native-paper';
import axios from 'axios';
import { UserDTO } from '~/dtos/UserDTO';
import { useAuth } from '~/hooks/useAuth';
import { AppNavigatorRoutesProps } from '~/routes/app.routes';
import { useNavigation } from '@react-navigation/native';
import { timeConverter } from '~/helpers/convert_data';
import { theme } from '~/core/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Notification = {
  id: string;
  title: string;
  body: string;
  viewed: boolean;
  date: string;
};

const NotificationsModal = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://api.onesignal.com/notifications', {
          params: {
            app_id: '1243b543-9212-4940-84d8-70af01639081',
            kind: 1,
          },
          headers: {
            Authorization: `Basic ${'api_key'}`,
          },
        });

        const fetchedNotifications = response.data.notifications;
        const uniqueNotifications = new Set();
        const userNotifications = fetchedNotifications
          .filter((notification: any) =>
            notification.filters.some(
              (filter: any) =>
                filter.key === 'userId' &&
                filter.field === 'tag' &&
                filter.value === user.user_id &&
                filter.relation === '='
            )
          )
          .filter((notification: any) => {
            const key = `${notification.headings.en}-${notification.contents.en}`;
            if (uniqueNotifications.has(key)) {
              return false;
            } else {
              uniqueNotifications.add(key);
              return true;
            }
          })
          .map((notification: any) => ({
            id: notification.id,
            title: notification.headings.en,
            body: notification.contents.en,
            date: timeConverter(notification.completed_at),
            viewed: notification.opened,
          }));

        setNotifications(userNotifications);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsViewed = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, viewed: true } : notification
      )
    );
  };

  const handleMarkAsUnviewed = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, viewed: false } : notification
      )
    );
  };

  return (
    <>
      <Appbar.Header mode="center-aligned">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Notificações" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
      <ScrollView style={styles.scrollContainer}>
        <List.Section>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <List.Item
                title={() => <Text style={styles.titleText}>{notification.title}</Text>}
                description={() => (
                  <View>
                    <Text style={styles.descriptionText}>{notification.body}</Text>
                    <Text style={styles.dateText}>{notification.date}</Text>
                  </View>
                )}
                style={styles.listItem}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={notification.viewed ? 'check-circle' : 'circle-outline'}
                    color={notification.viewed ? 'green' : 'red'}
                  />
                )}
                right={(props) => (
                  <View style={styles.iconContainer}>
                    {notification.viewed ? (
                      <IconButton
                        {...props}
                        icon={({ size, color }) => (
                          <MaterialCommunityIcons
                            name="eye-off"
                            size={size}
                            color={theme.colors.primary}
                          />
                        )}
                        onPress={() => handleMarkAsUnviewed(notification.id)}
                      />
                    ) : (
                      <IconButton
                        {...props}
                        icon={({ size, color }) => (
                          <MaterialCommunityIcons
                            name="eye"
                            size={size}
                            color={theme.colors.primary}
                          />
                        )}
                        onPress={() => handleMarkAsViewed(notification.id)}
                      />
                    )}
                  </View>
                )}
              />
            </React.Fragment>
          ))}
        </List.Section>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    marginVertical: 5,
    borderRadius: 8,
    padding: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333333',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default memo(NotificationsModal);
