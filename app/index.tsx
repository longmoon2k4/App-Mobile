import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { width } = Dimensions.get('window');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [percentValue, setPercentValue] = useState(0);
  const loginOpacity = useRef(new Animated.Value(0)).current;

  // Animate progress bar khi loading
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
    const id = progress.addListener(({ value }) => {
      setPercentValue(Math.round(value * 100));
    });
    return () => {
      progress.removeListener(id);
    };
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

  if (!showLogin) {
    const widthInterpolate = progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '80%'],
    });
    const handleStart = () => {
      Animated.timing(loginOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setShowLogin(true));
    };
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>HÀNH TRÌNH TU TIÊN</Text>
        {percentValue < 100 ? (
          <>
            <ActivityIndicator size="large" color="#ffcc66" style={{ marginVertical: 24 }} />
            <View style={styles.progressBarBg}>
              <Animated.View style={[styles.progressBar, { width: widthInterpolate }]} />
            </View>
            <Text style={styles.percentText}>{percentValue}%</Text>
          </>
        ) : (
          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <Text style={styles.startBtnText}>BẮT ĐẦU</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <Animated.View style={[styles.background, { opacity: loginOpacity }]}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  startBtn: {
    marginTop: 32,
    backgroundColor: '#ffcc66',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
    shadowColor: '#ffcc66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: {
    color: '#1e140a',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  percentText: {
    color: '#ffcc66',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    letterSpacing: 1,
  },
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
    fontFamily: 'vn',
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
    fontFamily: 'vn',
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
    fontFamily: 'vn',
  },
  input: {
    flex: 1,
    height: 48,
    color: '#fff',
    fontSize: 17,
    fontFamily: 'vn',
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  subtitle: {
    color: '#ffcc66',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 18,
    fontFamily: 'vn',
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
    fontFamily: 'vn',
    letterSpacing: 1,
    textShadowColor: '#a60000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});