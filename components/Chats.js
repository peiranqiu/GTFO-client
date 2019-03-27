import React, {Component} from 'react';
import {
    AsyncStorage,
    Dimensions,
    SafeAreaView,
    ScrollView, StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import AppBottomNav from "./AppBottomNav";
import ChatServiceClient from '../services/ChatServiceClient'
import {Icon} from "react-native-elements";
import {Permissions, Notifications} from 'expo'

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
                    .then(chats => {
                        let sorted = chats.filter(chats => chats.address.length > 0 && new Date(chats.time.slice(0, 19) + 'Z') > new Date())
                            .sort((b, a) => new Date(a.time.slice(0, 19) + 'Z') - new Date(b.time.slice(0, 19) + 'Z'))
                            .concat(chats.filter(chats => chats.address.length === 0))
                            .concat(chats.filter(chats => chats.address.length > 0 && new Date(chats.time.slice(0, 19) + 'Z') < new Date()));
                        this.setState({chats: sorted});
                        Permissions.getAsync(Permissions.NOTIFICATIONS).then(permission => {
                            if (permission.status === 'granted') {
                                this.scheduleNotification(chats);
                            }
                        })
                    })
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
    }

    scheduleNotification(chats) {
        Notifications.cancelAllScheduledNotificationsAsync();
        chats.map(chat => {
            if (chat.address.length > 0) {
                let date = new Date(chat.time.slice(0, 19) + 'Z');
                date.setMinutes(date.getMinutes() - 30); // timestamp
                date = new Date(date);
                if (date > new Date()) {
                    let localNotification = {
                        title: 'Let\'s get out!',
                        body: chat.name + ' is happening in 30 minute at ' + chat.address,
                        ios: {
                            sound: true
                        },
                    };
                    let schedulingOptions = {
                        time: date
                    };
                    Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
                }
            }

        })
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
                        let message = chat.messages.sort(function (a, b) {
                            return new Date(b.createdAt.split('.')[0]) - new Date(a.createdAt.split('.')[0]);
                        })[0];
                        if (message !== undefined && message.businessId >= 0) {
                            message.text = '[shared business]';
                        }
                        return (
                            <TouchableOpacity key={i} style={styles.card}
                                              onPress={() => {
                                                  analytics.track('chats page', {"type": "close"});
                                                  analytics.track('message page', {"type": "open"});
                                                  this.props.navigation.navigate("Message", {
                                                      chat: chat,
                                                      refresh: () => this.setState({refresh: true})
                                                  });
                                              }}>
                                <View>
                                    <Text style={styles.title}>{chat.name}({chat.size})</Text>
                                    {message !== undefined &&
                                    <Text style={styles.text}>{message.user.name}{': '}{message.text}</Text>}
                                </View>
                                {chat.address.length > 0 &&
                                <Icon name='date-range'
                                      containerStyle={styles.icon}
                                      iconStyle={{
                                          margin: 15,
                                          color: new Date(chat.time.slice(0, 19) + 'Z') > new Date() ? 'black' : 'lightgrey'
                                      }}
                                />}

                            </TouchableOpacity>
                        )
                    })}

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