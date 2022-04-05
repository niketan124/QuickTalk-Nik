import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  TouchableOpacity
} from 'react-native'
import React, { useContext, useState } from 'react';
import Context from '../context/Context';
import { TextInput } from 'react-native-gesture-handler';
import { signUp, signIn } from '../firebase/Firebase'

export default function SignIn() {
  const { theme: { colors } } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signUp');

  async function handlePress() {
    if (mode === 'signUp') {
      await signUp(email, password)
    }

    if (mode === 'signIn') {
      await signIn(email, password)
    }
  }

  const onTuchHandler = () => {
    Keyboard.dismiss()
  }
  return (
    <TouchableWithoutFeedback onPress={onTuchHandler}>
      <View style={
        {
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: colors.white,
        }
      }>
        <Text style={{
          color: colors.foreground,
          fontSize: 20,
          marginBottom: 20,
        }}>Welcome To QuickTalk</Text>
        <Image source={
          require('../assets/welcome-img.png')
        } style={{
          width: 180,
          height: 180
        }} resizeMode='cover' />
        <View style={{
          marginTop: 20
        }}>
          <TextInput placeholder='Email' style={{
            borderBottomColor: colors.primary,
            borderBottomWidth: 2,
            width: 200
          }} value={email} onChangeText={setEmail} />
          <TextInput placeholder='Password' style={{
            marginTop: 20,
            borderBottomColor: colors.primary,
            borderBottomWidth: 2,
            width: 200
          }} secureTextEntry={true}
            selectTextOnFocus={true}
            value={password} onChangeText={setPassword} />
          <View style={{
            marginTop: 20
          }}>
            <Button color={colors.secondary}
              title={mode === 'signUp' ? 'Sign UP' : "Sign in"}
              onPress={handlePress} disabled={!password || !email} />
          </View>
          <TouchableOpacity style={{
            marginTop: 15
          }} onPress={() =>
          {mode=== 'signUp' ? setMode('signIn') : setMode('signUp')}}>
            <Text style={{
              color: colors.secondaryText
            }}>{mode === 'signUp' ?
             'Already have an account? Sign in' 
             : "Don't have an account? Sign Up"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
