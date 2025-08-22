import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
   const [fontsLoaded] = useFonts({
     SVN: require('../assets/fonts/svn.otf'),
     vn: require('../assets/fonts/vn.ttf'),
     tp: require('../assets/fonts/tp.ttf'),
   });

  if (!fontsLoaded) {
    return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large" color="#a67c52" /></View>;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: 'Đăng nhập' }} />
    </Stack>
  );
}
