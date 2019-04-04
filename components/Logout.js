import React, {Component} from 'react';
import {View, WebView} from "react-native";

export default class Logout extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.navigation.navigate("Welcome");
    }

    render() {
        return (
            <View style={{height: 0, width: 0}}>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    source={{uri: 'https://instagram.com/accounts/logout/'}}
                />
            </View>
        );
    }
}