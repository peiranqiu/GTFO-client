import React, {Component} from 'react';
import {Image, SafeAreaView, View, StyleSheet, Text, Dimensions, ScrollView} from "react-native";
import AppBottomNav from "./AppBottomNav";
import {Avatar, List, ListItem} from "react-native-elements";
import friends from '../resources/icons/friends.png';
import logout from '../resources/icons/logout.png';
import feedback from '../resources/icons/feedback.png';
import privacy from '../resources/icons/privacy.png';

export default class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
        activeNav = "chats";
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
    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <Text style={{marginTop: 30, alignSelf: 'center'}}>Chats</Text>
                </View>
                <ScrollView>
                </ScrollView>
                <AppBottomNav style={{alignSelf: 'flex-end'}}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 70,
        margin: 0,
    }
});