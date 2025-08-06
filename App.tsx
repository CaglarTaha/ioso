import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './store';
import { loadStoredAuth } from './store/slices/authSlice';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TabNavigator from './navigation/TabNavigator';
import TestScreen from './screens/TestScreen';
import OrganizationDetailScreen from './screens/OrganizationDetailScreen';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  
  const [showSplash, setShowSplash] = useState(true);
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

  const handleFinishSplash = () => {
    setShowSplash(false);
  };

  const handleFinishOnboarding = () => {
    setShowOnboarding(false);
  };

  if (appLoading || isLoading || showSplash) {
    return <SplashScreen onFinish={handleFinishSplash} />;
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