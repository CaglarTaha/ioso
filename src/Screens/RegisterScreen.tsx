import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store';
interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // Validation
    if (!formData.firstName.trim()) {
      Alert.alert('Hata', 'Ad alanı gereklidir');
      return;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Hata', 'Soyad alanı gereklidir');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Hata', 'E-posta alanı gereklidir');
      return;
    }
    if (formData.password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }
    if (formData.password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin');
      return;
    }

    try {
      await dispatch(registerUser(formData)).unwrap();
      Alert.alert(
        'Başarılı',
        'Hesabınız oluşturuldu! Şimdi giriş yapabilirsiniz.',
        [{ text: 'Tamam', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err: any) {
      Alert.alert('Kayıt Hatası', err || 'Kayıt işlemi başarısız');
    }
  };

  const updateField = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Hesap Oluştur</Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Ad</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => updateField('firstName', text)}
              placeholder="Adınızı girin"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Soyad</Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => updateField('lastName', text)}
              placeholder="Soyadınızı girin"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-posta</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              placeholder="E-posta adresinizi girin"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Şifre</Text>
            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              placeholder="Şifrenizi girin"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Şifre Tekrar</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Şifrenizi tekrar girin"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Kayıt Oluşturuluyor...' : 'Hesap Oluştur'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>
              Zaten hesabınız var mı? <Text style={styles.linkTextBold}>Giriş Yap</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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

export default RegisterScreen;