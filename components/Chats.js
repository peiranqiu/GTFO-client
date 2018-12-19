import React, {Component} from 'react';
import {Image, SafeAreaView, View, StyleSheet, Text, Dimensions, ScrollView, TouchableOpacity} from "react-native";
import AppBottomNav from "./AppBottomNav";
import ChatServiceClient from '../services/ChatServiceClient'

export default class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            chats: []
        };
        activeNav = "chats";
        this.chatService = ChatServiceClient.instance;
    }

    componentDidMount() {
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                this.chatService.findChatsForUser(user._id)
                    .then(chats => {
                        this.setState({chats: chats})
                    })
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
    }

    render() {
        if (this.state.chats === undefined) {
            return null;
        }
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <Text style={{marginTop: 30, alignSelf: 'center'}}>Chats</Text>
                </View>
                <ScrollView>
                    {this.state.chats.map((chat, i) => (
                        <TouchableOpacity key={i} style={styles.card}
                        onPress={() => this.props.navigation.navigate("Message", {chat: chat})}>
                            <View>
                                <Text style={styles.text}>{chat.users.map(user => user.name+',')}({chat.size})</Text>
                            </View>
                        </TouchableOpacity>
                    ))}

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
    },
    card: {
        height: 78,
        width: Dimensions.get('window').width - 20,
        alignSelf: 'center',
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'white',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2},
        marginTop: 10,
        padding: 10
    },
    text: {
        paddingHorizontal: 20,
        fontSize: 20,
    },
});