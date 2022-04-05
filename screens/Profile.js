import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    ToastAndroid
} from 'react-native'
import React,
{
    useContext,
    useState,
    useEffect
} from 'react'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import GlobalContextContext from '../context/Context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { pickImage, askForPermission, uploadImage } from '../utils/utils'
import { auth, db } from '../firebase/Firebase'
import { updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigation } from '@react-navigation/native'





export default function Profile() {
    const { theme: { colors } } = useContext(GlobalContextContext)
    const [displayName, setDisplayName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [permissionsStatus, setPermissionsStatus] = useState(null)
    const navigation = useNavigation();

    async function handlePress() {
        const user = auth.currentUser
        let photoURL;
        if (selectedImage) {
            const { url } = await uploadImage(selectedImage,
                `images/${user.uid}`,
                "profilePicture");
            photoURL = url;
        }

        const userData = {
            displayName,
            email: user.email
        }

        if (photoURL) {
            userData.photoURL = photoURL
        }
        await Promise.all([
            updateProfile(user, userData),
            setDoc(doc(db, "users", user.uid), { ...userData, uid: user.uid })
        ])
        navigation.navigate('home')

        ToastAndroid.show(
            "Loading, please wait!",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
        )

    }

    const onTouchHandler = () => {
        Keyboard.dismiss()
    }

    useEffect(() => {
        (async () => {
            const status = await askForPermission();
            setPermissionsStatus(status)
        })()
    }, [])

    async function handleProfilePicture() {
        const result = await pickImage()
        if (!result.cancelled) {
            setSelectedImage(result.uri);
        }
    }

    if (!permissionsStatus) {
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center'
            }}
            ><Text>Loading....</Text></View>
        )
    }

    if (permissionsStatus !== 'granted') {
        return <Text>You need to allow this permission</Text>
    }

    return (
        <React.Fragment>
            <StatusBar style='auto' />
            <TouchableWithoutFeedback onPress={onTouchHandler}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    paddingTop: Constants.statusBarHeight + 20,
                    padding: 20
                }}>
                    <Text style={{
                        fontSize: 20,
                        color: colors.foreground
                    }}>
                        Profile Info
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: colors.text,
                        marginTop: 20
                    }}>
                        Please provide your name and optional profile photo
                    </Text>
                    <TouchableOpacity style={{
                        marginTop: 30,
                        borderRadius: 120,
                        width: 120,
                        height: 120,
                        backgroundColor: colors.background,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} onPress={handleProfilePicture}>
                        {!selectedImage ? (<MaterialCommunityIcons name='camera-plus'
                            color={colors.iconGray} size={45} />)
                            : <Image source={{
                                uri: selectedImage
                            }} style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 120
                            }} />


                        }

                    </TouchableOpacity>
                    <TextInput placeholder='Type your name'
                        value={displayName}
                        onChangeText={setDisplayName} style={{
                            borderBottomColor: colors.primary,
                            marginTop: 40,
                            borderBottomWidth: 2,
                            width: '100%'
                        }} />
                    <View style={{
                        marginTop: "auto",
                        margin: 80
                    }}>
                        <Button title='Next'
                            color={colors.secondary}
                            onPress={handlePress} disabled={!displayName} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </React.Fragment>
    )
}