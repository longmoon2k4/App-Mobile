import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Thêm hook cho progress bar
import { useRef } from 'react';
  const progress = useRef(new Animated.Value(0)).current;
  // Animate progress bar khi loading
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);

export default function HomeScreen() {
  const { width } = Dimensions.get('window');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  if (loading) {
    const widthInterpolate = progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '80%'],
    });
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>HÀNH TRÌNH TU TIÊN</Text>
        <ActivityIndicator size="large" color="#ffcc66" style={{ marginVertical: 24 }} />
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBar, { width: widthInterpolate }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <Video
        source={require('../assets/images/bgr.mp4')}
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />
      <View style={styles.overlay} />
      <View style={styles.loginBox}>
        <Text style={styles.title}>HÀNH TRÌNH TU TIÊN</Text>
        <Text style={styles.subtitle}>TRUYỀN TỐNG TRẬN</Text>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons name="account" size={22} color="#fff" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#fff"
          />
        </View>
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons name="lock" size={22} color="#fff" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#fff"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerBtn}>
          <Text style={styles.registerText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  progressBarBg: {
    width: '80%',
    height: 10,
    backgroundColor: '#3a2a1a',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffcc66',
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e140a',
  },
  loadingText: {
    color: '#ffcc66',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'SVN',
    letterSpacing: 2,
  },
  registerBtn: {
    marginTop: 16,
    width: '80%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffcc66',
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    paddingVertical: 10,
  },
  registerText: {
    color: '#ffcc66',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SVN',
    letterSpacing: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 20, 10, 0.75)',
  },
  loginBox: {
    width: '90%',
    backgroundColor: 'rgba(30, 20, 10, 0.85)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1e9e9ff',
    marginBottom: 20,
    fontFamily: 'SVN',
  },
  input: {
    flex: 1,
    height: 48,
    color: '#fff',
    fontSize: 17,
    fontFamily: 'SVN',
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  subtitle: {
    color: '#ffcc66',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 18,
    fontFamily: 'SVN',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(80, 40, 20, 0.7)',
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#ffcc66',
    paddingHorizontal: 8,
  },
  inputIcon: {
    marginRight: 6,
  },
  button: {
    width: '100%',
    backgroundColor: '#d7261e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#ffcc66',
    shadowColor: '#d7261e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'SVN',
    letterSpacing: 1,
    textShadowColor: '#a60000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});