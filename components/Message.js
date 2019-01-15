import {Bubble, GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import React, {Component} from 'react';
import {DatePickerIOS, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import CustomView from "./CustomView";
import {Icon, FormInput} from 'react-native-elements'
import ChatServiceClient from "../services/ChatServiceClient";
import PostServiceClient from "../services/PostServiceClient";
import Modal from "react-native-modal";

console.disableYellowBox = true;

export default class Message extends Component {
    constructor(props) {
        super(props);
        this.chatService = ChatServiceClient.instance;
        this.postService = PostServiceClient.instance;
        this.state = {
            messages: [],
            visible: false,
            user: null,
            chat: null,
            formTitle: "",
            formTime: null,
            formLocation: ""
        };
        this.onSend = this.onSend.bind(this);
    }

    componentDidMount() {
        const business = this.props.navigation.getParam('business', {});
        const chat = this.props.navigation.getParam('chat', {});

        this.setState({chat: chat});
        if (chat.address.length > 0) {
            this.setState({
                formTime: chat.time,
                formTitle: chat.name, formLocation: chat.address
            })
        }

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

    renderBubble(props) {
        if (props.currentMessage.businessId > 0) {
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
                        right: {color: 'grey'},
                        left: {color: 'grey'}
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

    renderInputToolbar(props) {
        return <View style={{flexDirection: 'row'}}>
            <Icon name='date-range'
                  iconStyle={{color: 'grey', margin: 15}}
                  onPress={() => this.extraData.setState({visible: true})}
            />
            <InputToolbar {...props}
                          containerStyle={{
                              backgroundColor: '#f1f1f2',
                              borderRadius: 50,
                              borderTopColor: '#ffffff',
                              marginRight: 10,
                              marginLeft: 50,
                              marginBottom: 5
                          }}/>
        </View>
    }

    submit() {
        if (this.state.formTitle.length === 0 || this.state.formLocation.length === 0) {
            alert("All fields are required.");
            return;
        }
        let chat = this.state.chat;
        chat.name = this.state.formTitle;
        chat.time = this.state.formTime;
        chat.address = this.state.formLocation;
        this.setState({chat: chat});
        this.chatService.updateChat(chat.id, chat)
            .then(() => {
                this.setState({visible: false});
                const refresh = this.props.navigation.state.params.refresh;
                if (typeof refresh === 'function') {
                    refresh();
                }
            })
    }


    render() {
        return (
            this.state.chat !== null &&
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <Text style={styles.searchContainer}>{this.state.chat.name}({this.state.chat.size})</Text>
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
                    renderInputToolbar={this.renderInputToolbar}
                    extraData={this}
                />
                <Modal isVisible={this.state.visible} style={styles.modal}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.searchContainer}>Set Reminder</Text>
                        <Icon name='close'
                              containerStyle={{marginRight: 20}}
                              iconStyle={{color: 'grey'}}
                              onPress={() => this.setState({formTime: this.state.chat.time, visible: false})}
                        />
                    </View>
                    <FormInput containerStyle={styles.formInput}
                               value={this.state.chat.address.length > 0 ? this.state.chat.name : ""}
                               placeholder="Reminder Title..."
                               onChangeText={text => this.setState({formTitle: text})}/>
                    <View style={{flexDirection: 'row'}}>
                        <Icon name='date-range'
                              iconStyle={{color: 'grey', marginLeft: 20, marginBottom: 10}}
                        />
                        <FormInput containerStyle={styles.formInput}
                                   value={new Date(this.state.formTime).toString().slice(0, 21)}
                                   placeholder="Select Date and Time..."
                                   onFocus={() => {
                                       if (this.state.formTime === null) {
                                           this.setState({formTime: new Date()})
                                       }
                                   }}/>
                    </View>
                    {this.state.formTime !== null &&
                    <DatePickerIOS
                        date={new Date(this.state.formTime)}
                        onDateChange={date => this.setState({formTime: date})
                        }
                    />}
                    <View style={{flexDirection: 'row'}}>
                        <Icon name='place'
                              iconStyle={{color: 'grey', marginLeft: 20, marginBottom: 10}}
                        />
                        <FormInput containerStyle={styles.formInput}
                                   placeholder="Location"
                                   value={this.state.chat.address}
                                   onChangeText={text => this.setState({formLocation: text})}/>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity style={styles.button}
                                          onPress={() => this.submit()}>
                            {this.state.chat.address.length > 0 ?
                                <Text style={{color: 'white'}}>Save</Text> :
                                <Text style={{color: 'white'}}>Create</Text>}
                        </TouchableOpacity></View>
                </Modal>
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
        height: 70,
        textAlign: 'center',
        fontSize: 18,
        paddingTop: 25,
        paddingLeft: 40,
        width: Dimensions.get('window').width - 40,
    },
    modal: {
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
        borderRadius: 10,
        position: 'absolute',
        bottom: 0,
        left: -20,
        right: 0
    },
    formInput: {
        borderBottomWidth: 0,
        marginBottom: 20
    },
    button: {
        borderRadius: 20,
        backgroundColor: 'grey',
        height: 42,
        width: 139,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
});