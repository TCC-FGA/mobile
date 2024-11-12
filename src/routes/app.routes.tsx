import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import React from 'react';
import { BottomNavigation, FAB } from 'react-native-paper';
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
  ContractsScreen,
  ContractsDetails,
  RentsScreen,
  RentsDetails,
  PaymentsScreen,
  PaymentsDetails,
  ReceiptScreen,
  RentsMainCreation,
  SignatureScreen,
  InspectionsScreen,
} from '../screens';
import { PropertiesDTO } from '~/dtos/PropertiesDTO';
import { HouseDTO } from '~/dtos/HouseDTO';
import { View, StyleSheet } from 'react-native';
import { theme } from '~/core/theme';

type AppRoutesType = {
  PropertiesStack: {
    screen: 'PropertyDetails';
    params: { propertie: PropertiesDTO | null };
  };
  HousesStack: {
    screen: 'HousesScreen' | 'HouseDetails';
    params: {
      propertyId?: number;
      propertyPhoto?: string;
      propertyNickname?: string;
      house?: HouseDTO | null;
    };
  };
  TenantsStack: {
    screen: 'TenantsScreen' | 'TenantDetails';
    params?: { tenantId?: number | null };
  };
  ContractsStack: {
    screen: 'ContractsScreen' | 'ContractsDetails';
    params?: { templateId?: number | null };
  };
  RentsStack: {
    screen: 'RentsScreen' | 'RentsDetails' | 'RentsMainCreation';
    params?: { rentId?: number | null };
  };
  PaymentsStack: {
    screen: 'PaymentsScreen' | 'PaymentsDetails' | 'ReceiptScreen' | 'SignatureScreen';
    params?: { contractId?: number | null; paymentId?: number | null; rentId?: number | null };
  };
  InspectionsStack: {
    screen: 'InspectionsScreen';
    params?: { rentId: number };
  };
  AccountSettingsScreen: undefined;
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
        <View>
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
                return options.tabBarIcon({ focused, color, size: 25 });
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
        </View>
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
        name="Contratos"
        component={RentsScreen}
        options={{
          tabBarLabel: 'Aluguéis',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Settings"
        component={AccountSettingsScreen}
        options={{
          tabBarLabel: 'Conta',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      /> */}
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

export function ContractsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContractsScreen"
        component={ContractsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContractsDetails"
        component={ContractsDetails}
        options={{ headerTitle: 'Modelos de Contratos' }}
      />
    </Stack.Navigator>
  );
}

export function RentsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RentsScreen" component={RentsScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="RentsDetails"
        component={RentsDetails}
        options={{ headerTitle: 'Aluguéis' }}
      />
      <Stack.Screen
        name="RentsMainCreation"
        component={RentsMainCreation}
        options={{ headerTitle: 'Novo Aluguel' }}
      />
    </Stack.Navigator>
  );
}

export function PaymentsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PaymentsScreen"
        component={PaymentsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentsDetails"
        component={PaymentsDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReceiptScreen"
        component={ReceiptScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignatureScreen"
        component={SignatureScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export function InspectionsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="InspectionsScreen"
        component={InspectionsScreen}
        options={{ headerTitle: 'Vistorias' }}
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
      <Stack.Screen name="ContractsStack" component={ContractsStack} />
      <Stack.Screen name="RentsStack" component={RentsStack} />
      <Stack.Screen name="PaymentsStack" component={PaymentsStack} />
      <Stack.Screen name="InspectionsStack" component={InspectionsStack} />
      <Stack.Screen name="AccountSettingsScreen" component={AccountSettingsScreen} />
    </Stack.Navigator>
  );
}
export default AppRoutes;
