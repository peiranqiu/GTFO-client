import React from 'react';
import {Alert} from "react-native";
import {Header} from 'react-native-elements';

const FixedHeader = () => {
    return (
        <Header
            leftComponent={{
                icon: 'menu', color: '#fff',
                onPress: () => {Alert.alert("menu")}
            }}
            centerComponent={{text: 'My Courses', style: {color: '#fff'}}}
            rightComponent={{icon: 'home', color: '#fff',
                onPress: () => {Alert.alert("home")}}}/>
    );
};

export default FixedHeader;