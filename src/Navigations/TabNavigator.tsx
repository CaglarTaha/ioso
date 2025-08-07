import React from 'react';
import { Text, Platform, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OrganizationsScreen from '../Screens/OrganizationsScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../Hooks/useTheme';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.tabBarActive,
          tabBarInactiveTintColor: colors.tabBarInactive,
          tabBarStyle: {
            backgroundColor: colors.tabBarBackground,
            paddingTop: 5,
            height: Platform.OS === 'ios' ? 85 : 60,
            paddingBottom: Platform.OS === 'ios' ? 30 : 5,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            position: 'absolute',
            elevation: 5,
            zIndex: 1000,
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowColor: colors.shadowColor,
            shadowOffset: { width: 0, height: -3 },
          },
          tabBarItemStyle: {
            paddingVertical: 5,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Organizasyonlar" 
          component={OrganizationsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="building" size={18} color={color} iconStyle="solid" />
            ),
          }}
        />
        <Tab.Screen 
          name="Profil" 
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="user" size={18} color={color} iconStyle="solid" />
            ),
          }}
        />
        <Tab.Screen 
          name="Ayarlar" 
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="gear" size={18} color={color} iconStyle="solid" />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default TabNavigator;