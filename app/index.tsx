import React, { useState } from 'react';
import { Alert, Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { width } = Dimensions.get('window');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === '' || password === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (username === 'admin' && password === '123456') {
      Alert.alert('Thành công', 'Đăng nhập thành công!');
    } else {
      Alert.alert('Thất bại', 'Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }}
      style={styles.background}
      resizeMode="cover"
      blurRadius={2}
    >
      <View style={styles.overlay} />
      <View style={styles.loginBox}>
        <Text style={styles.title}>Đăng Nhập Tu Tiên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập đạo hiệu..."
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#e0d7c6"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu bí tịch..."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#e0d7c6"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 20, 10, 0.5)',
  },
  loginBox: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    fontFamily: 'VNI_THUPHAP',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#e0d7c6',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    fontFamily: 'VNI_THUPHAP',
  },
  button: {
    width: '100%',
    backgroundColor: '#a67c52',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'VNI_THUPHAP',
  },
});