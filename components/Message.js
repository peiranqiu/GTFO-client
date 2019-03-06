import {Bubble, Composer, GiftedChat, InputToolbar} from 'react-native-gifted-chat';
import React, {Component} from 'react';
import {
    DatePickerIOS,
    Dimensions,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import CustomView from "./CustomView";
import {Icon, FormInput} from 'react-native-elements'
import ChatServiceClient from "../services/ChatServiceClient";
import Modal from "react-native-modal";
import dismissKeyboard from 'react-native-dismiss-keyboard';

console.disableYellowBox = true;

export default class Message extends Component {
    constructor(props) {
        super(props);
        this.chatService = ChatServiceClient.instance;
        this.state = {
            messages: [],
            visible: false,
            user: null,
            chat: null,
            formTitle: "",
            formTime: null,
            formLocation: "",
            keyboard: 0
        };
        this.onSend = this.onSend.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
    }

    _keyboardDidShow(e) {
        this.setState({keyboard: e.endCoordinates.height})
    }

    _keyboardDidHide() {
        this.setState({keyboard: 0})
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentDidMount() {
        const business = this.props.navigation.getParam('business', {});
        const chat = this.props.navigation.getParam('chat', {});

        this.setState({chat: chat});
        if (chat.address.length > 0) {
            this.setState({
                formTime: chat.time,
                formTitle: chat.name,
                formLocation: chat.address
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
                                .then(messages => {
                                    messages.sort((b, a) => {
                                        return new Date(a.createdAt.split('.')[0]) - new Date(b.createdAt.split('.')[0]);
                                    });
                                    this.setState({messages: messages});
                                });
                        })
                }
                else {
                    this.chatService.findMessagesForChat(chat.id)
                        .then(messages => {
                            messages.sort((b, a) => {
                                return new Date(a.createdAt.split('.')[0]) - new Date(b.createdAt.split('.')[0]);
                            });
                            this.setState({messages: messages});
                        });
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
            this.chatService.createMessage(chat.id, currentMessage).then(() => {
                    const refresh = this.props.navigation.state.params.refresh;
                    if (typeof refresh === 'function') {
                        refresh();
                    }
                }
            );
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
        return <InputToolbar {...props}
                             containerStyle={{
                                 backgroundColor: '#f1f1f2',
                                 borderRadius: 50,
                                 borderTopColor: '#ffffff',
                                 marginRight: 10,
                                 marginLeft: 50,
                                 marginBottom: 5,
                                 marginTop: 5
                             }}/>
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
            <TouchableWithoutFeedback onPress={() => {
                this.setState({keyboard: 0});
                dismissKeyboard();
            }}>
                <SafeAreaView style={{flex: 1}}
                              keyboardShouldPersistTaps={'handled'}>
                    <View style={this.state.chat.address.length > 0 ? styles.containerWithReminder : styles.container}>
                        <Text style={styles.searchContainer}>{this.state.chat.name}({this.state.chat.size})</Text>
                        <Icon name='chevron-left'
                              containerStyle={{position: 'absolute', left: 10, top: 20}}
                              size={30}
                              onPress={() => this.props.navigation.navigate("Chats")}
                        />
                        {this.state.chat.address.length > 0 &&
                        <View style={styles.reminder}>
                            <Icon name='date-range'
                                  iconStyle={{marginBottom: 3}}
                            />
                            <View style={{marginLeft: 10}}>
                                <Text style={{
                                    marginBottom: 5,
                                    fontSize: 12
                                }}>{this.state.chat.time === null ? "" :
                                    (this.state.chat.time.toString().includes('.') ?
                                        this.state.chat.time.toString().split('.')[0] :
                                        this.state.chat.time.toString().slice(0, 21))}</Text>
                                <Text style={{fontSize: 12, color: 'grey'}}>{this.state.chat.address}</Text></View>
                        </View>}
                    </View>

                    <GiftedChat
                        keyboardShouldPersistTaps={'handled'}
                        messages={this.state.messages}
                        onSend={this.onSend}
                        user={this.state.user}
                        renderCustomView={this.renderCustomView}
                        renderBubble={this.renderBubble}
                        renderInputToolbar={this.renderInputToolbar}
                        textInputProps={{
                            style: {
                                marginLeft: 10,
                                minHeight: 30,
                                marginBottom: 5,
                                marginTop: 5,
                                width: Dimensions.get('window').width - 180,
                            }
                        }}
                        minInputToolbarHeight={55}
                        extraData={this}
                    />
                    <Icon name='date-range'
                          iconStyle={{color: 'grey', position: 'absolute', left: 15, bottom: 15 + this.state.keyboard}}
                          onPress={() => {
                              dismissKeyboard();
                              this.setState({visible: true});
                          }}
                    />
                    <Modal isVisible={this.state.visible}
                           style={{
                               justifyContent: 'flex-start',
                               alignSelf: 'flex-end',
                               backgroundColor: 'white',
                               width: Dimensions.get('window').width,
                               borderRadius: 10,
                               position: 'absolute',
                               bottom: this.state.keyboard,
                               left: -20,
                               right: 0
                           }}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.title}>Set Reminder</Text>
                            <Icon name='close'
                                  containerStyle={{position: 'absolute', top: 12, right: 20}}
                                  iconStyle={{color: 'grey'}}
                                  onPress={() => {
                                      this.setState({
                                          formTime: this.state.chat.time,
                                          visible: false
                                      });
                                  }}
                            />
                        </View>
                        <FormInput containerStyle={styles.formInput}
                                   autoFocus={this.state.visible}
                                   value={this.state.chat.address.length > 0 ? this.state.formTitle : ""}
                                   placeholder="Reminder Title..."
                                   onChangeText={text => this.setState({formTitle: text})}/>
                        <View style={{flexDirection: 'row'}}>
                            <Icon name='date-range'
                                  iconStyle={{color: 'grey', marginLeft: 20, marginBottom: 10}}
                            />
                            <FormInput containerStyle={styles.formInput}
                                       value={this.state.formTime.toString().slice(0, 21)}
                                       placeholder="Select Date and Time..."
                                       onFocus={() => {
                                           if (this.state.formTime === null) {
                                               this.setState({formTime: new Date()})
                                           }
                                       }}/>
                        </View>
                        {this.state.formTime !== null &&
                        <View style={{height: 150, justifyContent: 'center', overflow: 'hidden'}}>
                            <DatePickerIOS
                                date={new Date(this.state.formTime)}
                                onDateChange={date => {
                                    this.setState({formTime: date});
                                }}
                            /></View>}
                        <View style={{flexDirection: 'row'}}>
                            <Icon name='place'
                                  iconStyle={{color: 'grey', marginLeft: 20, marginBottom: 10}}
                            />
                            <FormInput containerStyle={styles.formInput}
                                       placeholder="Location"
                                       value={this.state.formLocation}
                                       onChangeText={text => this.setState({formLocation: text})}/>
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.button}
                                              activeOpacity={1}
                                              onPress={() => this.submit()}>
                                {this.state.chat.address.length > 0 ?
                                    <Text style={{color: 'white'}}>Save</Text> :
                                    <Text style={{color: 'white'}}>Create</Text>}
                            </TouchableOpacity></View>
                    </Modal>
                </SafeAreaView>
            </TouchableWithoutFeedback>
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
    containerWithReminder: {
        width: '100%',
        height: 117,
        margin: 0,
        shadowOpacity: 0.06,
        shadowOffset: {width: 0, height: 14},
        shadowRadius: 10,

    },
    searchContainer: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        height: '100%',
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 16,
        paddingTop: 25,
        width: Dimensions.get('window').width,
    },
    title: {
        height: 45,
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 16,
        paddingTop: 12,
        width: Dimensions.get('window').width,
    },
    formInput: {
        borderBottomWidth: 0,
        marginBottom: 5
    },
    button: {
        borderRadius: 20,
        backgroundColor: 'grey',
        height: 42,
        width: 139,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    reminder: {
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'row',
        bottom: 17,
        position: 'absolute'
    }
});