import React, {Component} from 'react';
import {Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ChatServiceClient from '../services/ChatServiceClient'
import {Icon} from "react-native-elements";
import {StackActions} from "react-navigation";
import {Notifications} from 'expo';

export default class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            chats: [],
        };
        this.chatService = ChatServiceClient.instance;
    }

    componentDidMount() {
        Notifications.setBadgeNumberAsync(0);
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                this.chatService.findChatsForUser(user._id)
                    .then(chats => {
                        let date = new Date();
                        date.setTime(date.getTime() - 12 * 60 * 60 * 1000);
                        let sorted = chats.filter(chats => chats.address.length === 0 || new Date(chats.time.slice(0, 19) + 'Z') > date)
                            .sort((a, b) => this.sortByTime(a.messages.sort((c, d) => this.sortByTime(c, d))[0],
                                b.messages.sort((c, d) => this.sortByTime(c, d))[0]))
                            .concat(chats.filter(chats => chats.address.length > 0 && new Date(chats.time.slice(0, 19) + 'Z') <= date));
                        this.setState({chats: sorted});
                    })
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
    }

    sortByTime(a, b) {
        return new Date(b.createdAt.split('.')[0]) - new Date(a.createdAt.split('.')[0]);
    }

    render() {
        activeNav = "chats";
        if (this.state.chats === undefined) {
            return null;
        }
        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar barStyle='dark-content'/>
                <View style={styles.container}>
                    <Text style={{fontSize: 16, marginTop: 30, alignSelf: 'center'}}>Chats</Text>
                </View>
                <ScrollView>
                    {this.state.chats.map((chat, i) => {
                        let message = chat.messages.sort((a, b) => this.sortByTime(a, b))[0];
                        if (message !== undefined && message.businessId >= 0) {
                            message.text = '[shared business]';
                        }
                        let date = new Date();
                        date.setTime(date.getTime() - 12 * 60 * 60 * 1000);
                        return (
                            <TouchableOpacity key={i} style={styles.card}
                                              onPress={() => {
                                                  analytics.track('chats page', {"type": "close"});
                                                  analytics.track('message page', {"type": "open"});
                                                  const pushAction = StackActions.push({
                                                      routeName: 'Message',
                                                      params: {
                                                          chat: chat,
                                                      },
                                                  });
                                                  this.props.navigation.dispatch(pushAction);
                                              }}>
                                <View>
                                    <Text style={{
                                        paddingHorizontal: 20,
                                        fontSize: 15,
                                        marginBottom: 5,
                                        color: (chat.address.length === 0 || new Date(chat.time.slice(0, 19) + 'Z') > date) ?
                                            'black' : 'grey'
                                    }}>{chat.name}({chat.size})</Text>
                                    {message !== undefined &&
                                    <Text style={styles.text}>{message.user.name}{': '}{message.text}</Text>}
                                </View>
                                {chat.address.length > 0 &&
                                <Icon name='date-range'
                                      containerStyle={styles.icon}
                                      iconStyle={{
                                          margin: 15,
                                          color: ((chat.time instanceof Date) ?
                                              chat.time : new Date(chat.time.slice(0, 19) + 'Z')) > date ?
                                              'black' : 'lightgrey'
                                      }}
                                />}

                            </TouchableOpacity>
                        )
                    })}

                </ScrollView>
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