import React, {
  useState,
  useEffect,
  useContext
} from 'react'
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text, View,
  LogBox, ToastAndroid
} from 'react-native';;
import { useAssets } from 'expo-asset';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/Firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './screens/SignIn';
import ContextWrapper from './context/ContextWrapper';
import Context from './context/Context';
import Profile from './screens/Profile'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Chats from './screens/Chats';
import Photo from './screens/Photo';
import Contacts from './screens/Contacts';
import { Ionicons } from '@expo/vector-icons'
import ChatHeader from './components/ChatHeader'
import Chat from './screens/Chat'





LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"
]);

const stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();



function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme: { colors } } = useContext(Context)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setLoading(false);
      if (user) {
        setCurrentUser(user);
      }
    })
    return () => unsubscribe()
  }, []);

  if (loading) {
    return <View style={{
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#08D9D6'
    }}><Text style={{
      color: '#112D4E',
      fontStyle: 'italic',
      fontSize: 20,
      fontWeight: 'bold'
    }}>Loading.....</Text>
    {ToastAndroid.show(
      "Developed By Niketan",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
    )}
    </View>
  }

  return (
    <NavigationContainer>
      {!currentUser ? (
        <stack.Navigator screenOptions={{ headerShown: false }}>
          <stack.Screen name='signIn' component={SignIn} />
        </stack.Navigator>
      ) :
        (
          <stack.Navigator screenOptions={{
            headerStyle: {
              backgroundColor: colors.foreground,
              shadowOpacity: 0,
              elevation: 0
            },
            headerTintColor: colors.white
          }}>
            {!currentUser.displayName && (
              <stack.Screen name='profile'
                component={Profile} options={{ headerShown: false }}
              />
            )}
            <stack.Screen name='home'
              options={{ title: "QuickTalk" }}
              component={Home} />
            <stack.Screen name='contacts'
              options={{ title: 'Select Contacts' }}
              component={Contacts} />
            <stack.Screen name='chat' component={Chat} options={{
              headerTitle: (props) => <ChatHeader {...props} />
            }} />
          </stack.Navigator>
        )}
    </NavigationContainer>
  );
}

function Home() {
  const { theme: { colors } } = useContext(Context);
  return (
    <Tab.Navigator screenOptions={({ route }) => {
      return {
        tabBarLabel: () => {
          if (route.name === 'photo') {
            return <Ionicons name='camera' size={20} color={colors.white} />
          } else {
            return <Text style={{
              color: colors.white
            }}>{route.name.toLocaleUpperCase()}</Text>
          }
        },
        tabBarShowIcon: true,
        tabBarLabelStyle: {
          color: colors.white
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.white,
        },
        tabBarStyle: {
          backgroundColor: colors.foreground
        }
      }
    }} initialRouteName="chats">
      <Tab.Screen name='photo' component={Photo} />
      <Tab.Screen name='chats' component={Chats} />
    </Tab.Navigator>
  )
}

function Main() {
  const [assets] = useAssets(
    require('./assets/icon-square.png'),
    require('./assets/chatbg.png'),
    require('./assets/user-icon.png'),
    require('./assets/welcome-img.png')
  )
  if (!assets) {
    return <Text>Loading....</Text>
  }

  return <ContextWrapper><App /></ContextWrapper>
}


export default Main;