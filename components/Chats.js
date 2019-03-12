import React, {Component} from 'react';
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AppBottomNav from "./AppBottomNav";
import ChatServiceClient from '../services/ChatServiceClient'
import {Icon} from "react-native-elements";

export default class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            chats: [],
            refresh: false
        };
        this.chatService = ChatServiceClient.instance;
    }

    componentDidMount() {
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                this.chatService.findChatsForUser(user._id)
                    .then(chats => this.setState({chats: chats}))
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
    }

    render() {
        activeNav = "chats";
        if (this.state.chats === undefined) {
            return null;
        }
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <Text style={{fontSize: 16, marginTop: 30, alignSelf: 'center'}}>Chats</Text>
                </View>
                <ScrollView>
                    {this.state.chats.length === 0 ?
                        <View style={{
                            width: Dimensions.get('window').width,
                            marginTop: '40%',
                            flex: 1,
                            justifyContent: 'center'
                        }}><Text style={{marginTop: 20, alignSelf: 'center'}}>You don't have any chat
                            yet.</Text></View> :
                        (this.state.chats.map((chat, i) => {
                            let message = chat.messages.sort(function (a, b) {
                                return new Date(b.createdAt.split('.')[0]) - new Date(a.createdAt.split('.')[0]);
                            })[0];
                            if (message !== undefined && message.businessId >= 0) {
                                message.text = '[shared business]';
                            }
                            return (
                                <TouchableOpacity key={i} style={styles.card}
                                                  onPress={() =>
                                                      this.props.navigation.navigate("Message", {
                                                          chat: chat,
                                                          refresh: () => this.setState({refresh: true})
                                                      })}>
                                    <View>
                                        <Text style={styles.title}>{chat.name}({chat.size})</Text>
                                        {message !== undefined &&
                                        <Text style={styles.text}>{message.user.name}{': '}{message.text}</Text>}
                                    </View>
                                    {chat.address.length > 0 &&
                                    <Icon name='date-range'
                                          containerStyle={styles.icon}
                                          iconStyle={{margin: 15}}
                                    />}

                                </TouchableOpacity>
                            )
                        }))}

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
        marginTop: 15,
        paddingVertical: 18,
        paddingHorizontal: 5
    },
    title: {
        paddingHorizontal: 20,
        fontSize: 15,
        marginBottom: 5
    },
    text: {
        paddingHorizontal: 20,
        fontSize: 13,
        color: 'grey',
        height: 15,
        width: 320
    },
    icon: {
        position: 'absolute',
        top: 10,
        right: 10
    }
});