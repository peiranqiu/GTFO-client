import React, {Component} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import AppBottomNav from "./AppBottomNav";

export default class Me extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        activeNav = "me";
    }

    componentDidMount() {
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
    }

    logout() {
        storage.remove({
            key: 'user'
        });
        this.props.navigation.navigate("Welcome");
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'flex-end'}}>
                <TouchableOpacity style={{
                    borderRadius: 5,
                    backgroundColor: 'green',
                    height: 30,
                    width: 100,
                    marginBottom: 400,
                    marginLeft: 150,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} onPress={() => this.logout()}>
                    <Text style={{color: 'white'}}>Logout</Text>
                </TouchableOpacity>
                <AppBottomNav/>
            </SafeAreaView>
        );
    }
}