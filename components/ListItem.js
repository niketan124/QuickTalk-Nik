import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import GlobalContext from '../context/Context'
import { Grid, Row, Col } from 'react-native-easy-grid'
import Avatar from './Avatar';

export default function ListItem({ type,
    description,
    user,
    time,
    room,
    image,
    style }) {
    const navigation = useNavigation();
    const { theme: { colors } } = useContext(GlobalContext);
    return (
        <TouchableOpacity style={{
            height: 80,
            ...style
        }} onPress={() => navigation.navigate("chat", { user, room, image })}>
            <Grid style={{
                maxHeight: 80
            }}>
                <Col style={{
                    width: 80,
                    justifyContent: "center",
                    alignItems: 'center'
                }}>
                    <Avatar user={user} size={type === 'contacts' ? 40: 65} />
                </Col>
                <Col style={{marginLeft: 10, marginTop: 20}}>
                    <Row style={{alignItems: 'center'}}>
                        <Col>
                            <Text style={{
                                fontWeight: 'bold',
                                 fontSize: 16,
                                 color: colors.text
                                 }}>
                                {user.contactName || user.displayName}
                            </Text>
                        </Col>
                        {time && (
                            <Col style={{alignItems: 'flex-end'}}>
                                <Text style={{color: colors.secondaryText, fontSize: 11}}>
                                    {new Date(time.seconds * 1000).toDateString()}
                                </Text>
                            </Col>
                        )}
                    </Row>
                    <Row>
                        {description && (
                            <Row style={{marginTop: -5}}>
                                <Text style={{color: colors.secondaryText, fontSize: 13}}>
                                    {description}
                                </Text>
                            </Row>
                        )}
                    </Row>
                </Col>
            </Grid>
        </TouchableOpacity>
    )
}
