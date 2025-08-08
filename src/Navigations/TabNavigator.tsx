import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OrganizationsScreen from '../Screens/OrganizationsScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../Hooks/useTheme';
import { buildTabStyles } from '../Styles/AppStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = buildTabStyles(colors, { bottom: insets.bottom });

  return (
    <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.tabBarActive,
          tabBarInactiveTintColor: colors.tabBarInactive,
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarLabelStyle: styles.tabBarLabelStyle,
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
  );
};

export default TabNavigator;