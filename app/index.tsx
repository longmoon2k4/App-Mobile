import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  // Forgot password state
  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const { width } = Dimensions.get('window');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirm, setRegisterConfirm] = useState('');
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

  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    try {
  const res = await fetch('http://192.168.137.1:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Thành công', data.message || 'Đăng nhập thành công!');
      } else {
        Alert.alert('Thất bại', data.message || 'Sai đạo hiệu hoặc mật chú!');
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể kết nối server!');
    }
  };

  const handleForgotPassword = () => {
    if (!forgotUsername) {
      Alert.alert('Lỗi', 'Vui lòng nhập đạo hiệu để lấy lại mật chú!');
      return;
    }
    setForgotLoading(true);
    fetch('http://192.168.137.1:3001/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: forgotUsername })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setForgotSent(true);
          setForgotUsername('');
        } else {
          Alert.alert('Lỗi', data.message || 'Không tìm thấy đạo hữu này!');
        }
      })
      .catch(() => {
        Alert.alert('Lỗi', 'Không thể kết nối server!');
      })
      .finally(() => setForgotLoading(false));
  };
  const handleRegister = async () => {
    if (!registerUsername || !registerPassword || !registerConfirm) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (registerPassword !== registerConfirm) {
      Alert.alert('Lỗi', 'Mật chú xác nhận không khớp');
      return;
    }
    try {
  const res = await fetch('http://192.168.137.1:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: registerUsername, password: registerPassword })
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Thành công', data.message || 'Đăng ký thành công!');
        setShowRegister(false);
        setUsername(registerUsername);
        setPassword(registerPassword);
      } else {
        Alert.alert('Lỗi', data.message || 'Đăng ký thất bại!');
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể kết nối server!');
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
        <Text style={styles.title}>TU TIÊN ĐẠO</Text>
        <Text style={styles.subtitle}>{showRegister ? 'ĐĂNG KÝ ĐẠO HỮU' : 'TRUYỀN TỐNG TRẬN'}</Text>
  {showRegister ? (
          <>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="account-plus" size={22} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Đạo hiệu mới"
                value={registerUsername}
                onChangeText={setRegisterUsername}
                autoCapitalize="none"
                placeholderTextColor="#fff"
              />
            </View>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock" size={22} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mật chú"
                value={registerPassword}
                onChangeText={setRegisterPassword}
                secureTextEntry
                placeholderTextColor="#fff"
              />
            </View>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock-check" size={22} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật chú"
                value={registerConfirm}
                onChangeText={setRegisterConfirm}
                secureTextEntry
                placeholderTextColor="#fff"
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerBtn} onPress={() => setShowRegister(false)}>
              <Text style={styles.registerText}>Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="account" size={22} color="#fff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Đạo hiệu"
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
                placeholder="Mật chú"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#fff"
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>ĐẾN ĐỘNG PHỦ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotBtn} onPress={() => setForgotVisible(true)}>
              <Text style={styles.forgotText}>Quên mật chú?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerBtn} onPress={() => setShowRegister(true)}>
              <Text style={styles.registerText}>KHAI SƠN PHÙ</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    {/* Forgot password dialog */}
    <Modal
      visible={forgotVisible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        setForgotVisible(false);
        setForgotSent(false);
      }}
    >
      <View style={styles.forgotDialog}>
        <View style={{ backgroundColor: '#2d1a0a', borderRadius: 18, padding: 24, width: 320, alignItems: 'center' }}>
          <Text style={styles.forgotTitle}>Quên mật chú?</Text>
          {forgotSent ? (
            <Text style={{ color: '#ffcc66', fontFamily: 'vn', fontSize: 16, marginVertical: 16 }}>Yêu cầu đã được gửi! Kiểm tra thông báo hoặc email nếu có.</Text>
          ) : (
            <>
              <TextInput
                style={[styles.input, { backgroundColor: 'rgba(255,255,255,0.08)', width: '100%', marginTop: 12 }]}
                placeholder="Nhập đạo hiệu"
                value={forgotUsername}
                onChangeText={setForgotUsername}
                autoCapitalize="none"
                placeholderTextColor="#fff"
              />
              <TouchableOpacity
                style={[styles.button, { width: '100%', marginTop: 18, backgroundColor: '#ffcc66', borderColor: '#ffcc66' }]}
                onPress={handleForgotPassword}
                disabled={forgotLoading}
              >
                <Text style={[styles.buttonText, { color: '#2d1a0a' }]}>{forgotLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={{ marginTop: 10 }} onPress={() => {
            setForgotVisible(false);
            setForgotSent(false);
          }}>
            <Text style={{ color: '#ffcc66', fontFamily: 'vn', fontSize: 16 }}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  forgotBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
  forgotText: {
    color: '#ffcc66',
    fontSize: 16,
    fontFamily: 'vn',
    textDecorationLine: 'underline',
    letterSpacing: 1,
  },
  forgotDialog: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotTitle: {
    color: '#ffcc66',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'vn',
    marginBottom: 4,
    letterSpacing: 1,
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