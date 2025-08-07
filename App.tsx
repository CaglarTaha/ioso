import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './src/Store';
import { loadStoredAuth } from './src/Store/slices/auth.slice';
import OnboardingScreen from './src/Components/OnboardingScreen';
import LoginScreen from './src/Screens/LoginScreen';
import RegisterScreen from './src/Screens/RegisterScreen';
import TabNavigator from './src/Navigations/TabNavigator';
import TestScreen from './src/Screens/TestScreen';
import OrganizationDetailScreen from './src/Screens/OrganizationDetailScreen';
import { RootStackParamList } from './src/types/navigation';
import './src/i18n';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(loadStoredAuth()).unwrap();
      } catch (error) {
        console.log('App initialization error:', error);
      } finally {
        setAppLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
  };

  if (appLoading || isLoading) {
    return null; // or a simple loading component
  }

  if (showOnboarding) {
    return <OnboardingScreen onFinish={handleFinishOnboarding} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen 
              name="OrganizationDetail" 
              component={OrganizationDetailScreen} 
              options={{ headerShown: false }} // You might want to show header for this screen
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen}  />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;