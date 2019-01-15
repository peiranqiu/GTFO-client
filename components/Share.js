import React, {Component} from 'react';
import {FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UserServiceClient from "../services/UserServiceClient";
import {Icon} from 'react-native-elements'

import RadioButton from 'react-native-radio-button'
import ChatServiceClient from "../services/ChatServiceClient";

export default class Share extends Component {
    constructor(props) {
        super(props);
        this.userService = UserServiceClient.instance;
        this.chatService = ChatServiceClient.instance;
        this.state = {
            user: null,
            chats: [],
            friends: [],
            tab: 'Friend',
            selectedChat: null
        }
    }

    componentDidMount() {
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                this.userService.findFriendList(user._id)
                    .then((users) => {
                        users.map(user => user.selected = false);
                        this.setState({friends: users})
                    });
                this.chatService.findChatsForUser(user._id)
                    .then(chats => this.setState({chats: chats}));
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
    }

    createGroup() {
        const business = this.props.navigation.getParam('business', {});
        let users = this.state.friends.filter(users => users.selected);
        users.push(this.state.user);
        this.chatService.createChat(users)
            .then(chat => this.props.navigation.navigate("Message", {chat: chat, business: business}));
    }

    sendToGroup() {
        const business = this.props.navigation.getParam('business', {});
        if(this.state.selectedChat !== null) {
            this.props.navigation.navigate("Message", {chat: this.state.chats[this.state.selectedChat], business: business});
        }

    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <Text style={{marginTop: 30, alignSelf: 'center'}}>Share to...</Text>
                    <Icon name='chevron-left'
                          containerStyle={{position: 'absolute', left: 10, top: 20}}
                          iconStyle={{color: 'grey'}}
                          onPress={() => this.props.navigation.goBack()}
                    />
                </View>
                <FlatList horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          style={styles.tabGroup}
                          data={[{key: 'Friend'}, {key: 'Group'}]}
                          renderItem={({item}) =>
                              <Text style={item.key === this.state.tab ? styles.activeTab : styles.tab}
                                    onPress={() => {
                                        this.setState({tab: item.key})
                                    }}>
                                  {item.key}
                              </Text>}/>
                <ScrollView style={{position: 'absolute', top: 200, bottom: 150}}>
                    {this.state.tab === 'Friend' ?
                        this.state.friends.map((friend, i) => (
                            <TouchableOpacity key={i} style={styles.resultItem}>
                                <Text>{friend.name}</Text>
                                <RadioButton
                                    isSelected={friend.selected}
                                    onPress={() => {
                                        var friends = this.state.friends;
                                        friends[i].selected = !friends[i].selected;
                                        this.setState({friends: friends});
                                    }}
                                />
                            </TouchableOpacity>
                        )) :
                        this.state.chats.map((chat, i) => (
                            <TouchableOpacity key={i} style={styles.resultItem}>
                                <Text>{chat.users.map(user => user.name + ',')}({chat.size})</Text>
                                <RadioButton
                                    isSelected={this.state.selectedChat === i}
                                    onPress={() => this.setState({selectedChat: i})}
                                />
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>

                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                {this.state.tab === 'Friend' ?
                    <TouchableOpacity style={styles.button} onPress={() => this.createGroup()}>
                        <Text style={{color: 'white'}}>Create a Group</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.button} onPress={() => this.sendToGroup()}>
                        <Text style={{color: 'white'}}>Share</Text>
                    </TouchableOpacity>
                }</View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    resultItem: {
        borderBottomWidth: 0,
        borderColor: 'white',
        padding: 20,
        flexDirection: 'row'
    },
    container: {
        width: '100%',
        height: 70,
        margin: 0,
        shadowOpacity: 0.06,
        shadowOffset: {width: 0, height: 14},
        shadowRadius: 10,
    },
    tab: {
        paddingHorizontal: 25,
        textAlign: 'center',
        color: '#cccccc'
    },
    activeTab: {
        paddingHorizontal: 25,
        textAlign: 'center',
        color: 'black'
    },
    tabGroup: {
        paddingTop: 40,
        height: 80,
        flex: 1,
    },
    button: {
        borderRadius: 20,
        backgroundColor: 'grey',
        height: 42,
        width: 139,
        marginBottom: 200,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
