import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Dashboard,
  AccountSettingsScreen,
  PropertiesScreen,
  PropertyDetails,
  HouseDetails,
  HousesScreen,
  SeeMoreScreen,
  TenantsScreen,
  TenantDetails,
} from '../screens';
import { PropertiesDTO } from '~/dtos/PropertiesDTO';
import { HouseDTO } from '~/dtos/HouseDTO';

type AppRoutesType = {
  PropertiesStack: {
    screen: 'PropertyDetails';
    params: { propertie: PropertiesDTO | null };
  };
  HousesStack: {
    screen: 'HousesScreen' | 'HouseDetails';
    params: { propertyId?: number; house?: HouseDTO | null };
  };
  TenantsStack: {
    screen: 'TenantsScreen' | 'TenantDetails';
    params?: { tenantId?: number | null };
  };
};

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesType>;

const Tab = createBottomTabNavigator();

function AppRoutesTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            return typeof label === 'string' ? label : undefined;
          }}
        />
      )}>
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Propriedades"
        component={PropertiesScreen}
        options={{
          tabBarLabel: 'Propriedades',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-city" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={AccountSettingsScreen}
        options={{
          tabBarLabel: 'Conta',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Mais"
        component={SeeMoreScreen}
        options={{
          tabBarLabel: 'Ver mais',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dots-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

export function PropertiesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PropertyDetails"
        component={PropertyDetails}
        options={{ headerTitle: 'Propriedades' }}
      />
    </Stack.Navigator>
  );
}

export function HousesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HousesScreen" component={HousesScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="HouseDetails"
        component={HouseDetails}
        options={{ headerTitle: 'Casas' }}
      />
    </Stack.Navigator>
  );
}

export function TenantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TenantsScreen"
        component={TenantsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TenantDetails"
        component={TenantDetails}
        options={{ headerTitle: 'Inquilinos' }}
      />
    </Stack.Navigator>
  );
}

function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="AppRoutesTab" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppRoutesTab" component={AppRoutesTab} />
      <Stack.Screen name="PropertiesStack" component={PropertiesStack} />
      <Stack.Screen name="HousesStack" component={HousesStack} />
      <Stack.Screen name="TenantsStack" component={TenantsStack} />
    </Stack.Navigator>
  );
}

export default AppRoutes;
