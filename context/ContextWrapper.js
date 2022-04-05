import React, {useState} from 'react';
import { theme } from '../utils/utils';
import Context from './Context';

export default function ContextWrapper (props) {
    const [rooms, setRooms] = useState([]);
    const [unfilteredRooms, setUnfilteredRooms] = useState([]);
    return (
        <Context.Provider value={{theme, rooms, setRooms, unfilteredRooms, setUnfilteredRooms}}>
            {props.children}
        </Context.Provider>
    )
}