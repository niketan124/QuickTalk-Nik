import { query, collection, where, onSnapshot, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/Firebase';
import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import GlobalContext from '../context/Context';
import ContactsFloatingIcon from '../components/ContactsFloatingIcon';
import ListItem from '../components/ListItem'
import useContacts from '../hooks/useHooks'



export default function Chats() {
  const { currentUser } = auth
  const { rooms,setUnfilteredRooms, setRooms, theme: { colors } } = useContext(GlobalContext)
  const contacts = useContacts();
  const chatsQuery = query(
    collection(db, "rooms"),
    where("participantsArray", "array-contains", currentUser.email)
  );
  useEffect(() => {
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      const parsedChats = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userB: doc.data().participants.find(p => p.email !== currentUser.email)
      }));
      setUnfilteredRooms(parsedChats)
      setRooms(parsedChats.filter((doc) => doc.lastMessage));
    });

    return () => unsubscribe();

  }, [])

  function getUserB(user, contacts) {
    const userContact = contacts.find(c => c.email === user.email)
    if(userContact && userContact.contactName) {
      return {...user, contactName: userContact.contactName}
    }
    return user
  }

  return (
    <View style={{
      flex: 1,
      padding: 5,
      paddingRight: 10
    }}>
      {rooms.map((room) => <ListItem type="chat"
        description={room.lastMessage.text}
        key={room.id}
        room={room}
        time={room.lastMessage.cratedAt}
        user= {getUserB(room.userB, contacts)}
        />)}
      <ContactsFloatingIcon />
    </View>
  )
}