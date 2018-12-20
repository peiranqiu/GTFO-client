import {GiftedChat} from 'react-native-gifted-chat';
import React, {Component} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from "react-native";

import {Icon} from 'react-native-elements'

export default class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {messages: []};
        this.onSend = this.onSend.bind(this);
    }

    componentWillMount() {
        this.setState({
            messages: [
                {
                    _id: '1',
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: '2',
                        name: 'React Native',
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                },
                {
                    _id: '2',
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: '7',
                        name: 'React Native',
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                },
                {
                    _id: '3',
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: '4',
                        name: 'React Native',
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                },
            ],
        });

    }

    onSend(messages = []) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
    }

    render() {
        const chat = this.props.navigation.getParam('chat', {});
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <Text style={styles.searchContainer}>{chat.name}({chat.size})</Text>
                    <Icon name='chevron-left'
                          containerStyle={{position: 'absolute', left: 10, top: 20}}
                          iconStyle={{color: 'grey'}}
                          onPress={() => this.props.navigation.navigate("Chats")}
                    />
                </View>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={this.onSend}
                    user={this.state.user}
                />
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({

    container: {
        width: '100%',
        height: 70,
        margin: 0,
        shadowOpacity: 0.06,
        shadowOffset: {width: 0, height: 14},
        shadowRadius: 10,
    },
    searchContainer: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        height: 70,
        textAlign: 'center',
        paddingTop: 25
    },
});