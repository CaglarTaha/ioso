import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../Store/slices/auth.slice';
import { RootState, AppDispatch } from '../store';
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('TabNavigator');
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    // Component unmount olduğunda error'ları temizle
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleLogin = async () => {
    // Validation
    if (!credentials.email.trim()) {
      Alert.alert('Hata', 'E-posta alanı gereklidir');
      return;
    }
    if (!credentials.password.trim()) {
      Alert.alert('Hata', 'Şifre alanı gereklidir');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin');
      return;
    }

    try {
      await dispatch(loginUser(credentials)).unwrap();
      // Success durumunda useEffect ile navigation yapılacak
    } catch (err: any) {
      Alert.alert('Giriş Hatası', err || 'Giriş işlemi başarısız');
    }
  };

  const updateField = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Giriş Yap</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-posta</Text>
              <TextInput
                style={styles.input}
                value={credentials.email}
                onChangeText={(text) => updateField('email', text)}
                placeholder="E-posta adresinizi girin"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Şifre</Text>
              <TextInput
                style={styles.input}
                value={credentials.password}
                onChangeText={(text) => updateField('password', text)}
                placeholder="Şifrenizi girin"
                placeholderTextColor="#999"
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Register')}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>
                Hesabınız yok mu? <Text style={styles.linkTextBold}>Kayıt Ol</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  linkTextBold: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffe6e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;