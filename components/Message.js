import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import React, {Component} from 'react';
import {Dimensions, SafeAreaView, StyleSheet, Text, View} from "react-native";
import CustomView from "./CustomView";
import {Icon} from 'react-native-elements'
import ChatServiceClient from "../services/ChatServiceClient";
import PostServiceClient from "../services/PostServiceClient";
console.disableYellowBox = true;

export default class Message extends Component {
    constructor(props) {
        super(props);
        this.chatService = ChatServiceClient.instance;
        this.postService = PostServiceClient.instance;
        this.state = {
            messages: [],
            user: null
        };
        this.onSend = this.onSend.bind(this);
    }

    componentDidMount() {
        const business = this.props.navigation.getParam('business', {});
        const chat = this.props.navigation.getParam('chat', {});

        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                if (business !== undefined && business.id !== undefined) {
                    const initialMessage = {businessId: business.id, user: user};
                    this.chatService.createMessage(chat.id, initialMessage)
                        .then(() => {
                            this.chatService.findMessagesForChat(chat.id)
                                .then(messages =>
                                    this.setState({
                                        messages: messages.sort(function (a, b) {
                                            return new Date(b.createdAt) - new Date(a.createdAt);
                                        })
                                    }));
                        })
                }
                else {
                    this.chatService.findMessagesForChat(chat.id)
                        .then(messages =>
                            this.setState({
                                messages: messages.sort(function (a, b) {
                                    return new Date(b.createdAt) - new Date(a.createdAt);
                                })
                            }));
                }
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });

    }

    onSend(messages = []) {
        if (messages.length > 0) {
            const chat = this.props.navigation.getParam('chat', {});
            const currentMessage = {text: messages[0].text, user: this.state.user};
            this.chatService.createMessage(chat.id, currentMessage);
            this.setState((previousState) => {
                return {
                    messages: GiftedChat.append(previousState.messages, messages)
                };
            });
        }

    }

    renderCustomView(props) {
        if (props.currentMessage.businessId > 0) {
            return (<CustomView {...props}/>);
        }
        return null;
    }

    renderBubble (props) {
        if(props.currentMessage.businessId > 0) {
            return (
                <Bubble
                    {...props}
                    wrapperStyle={{
                        right: {
                            backgroundColor: '#ffffff'
                        },
                        left: {
                            backgroundColor: '#ffffff'
                        },
                    }}
                    timeTextStyle={{
                        right: { color: 'grey' },
                        left: { color: 'grey' }
                    }}
                />
            )
        }
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#464646',
                        shadowOpacity: 0.1,
                        shadowOffset: {width: 0, height: 0},
                        shadowRadius: 10,
                    },
                    left: {
                        backgroundColor: '#ffffff',
                        shadowOpacity: 0.1,
                        shadowOffset: {width: 0, height: 0},
                        shadowRadius: 10,
                    },
                }}
            />
        )
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
                    renderCustomView={this.renderCustomView}
                    renderBubble={this.renderBubble}
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