import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React, {useState, useEffect} from 'react'
import { pickImage } from '../utils/utils'

export default function Photo() {
  const navigation = useNavigation()
  const [cancelled, setCancelled] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus" , async () => {
      const result = await pickImage()
      navigation.navigate("contacts", {image: result})
      if(result.cancelled) {
        setCancelled(true)
        setTimeout(() => navigation.navigate("chats"), 1000)
        
      }
    });
    return () => unsubscribe()
  }, [navigation, cancelled])
  return (
    <View>
    </View>
  )
}