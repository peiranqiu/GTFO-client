import React, {Component} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import UserServiceClient from "../services/UserServiceClient";
import {Avatar, Divider, Icon} from 'react-native-elements'

import RadioButton from 'react-native-radio-button'
import ChatServiceClient from "../services/ChatServiceClient";
import group_add from '../resources/icons/group_add.png';
import {StackActions} from "react-navigation";

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
        if (users.length > 0) {
            users.push(this.state.user);
            this.chatService.createChat(users)
                .then(chat => {
                    analytics.track('share page', {"type": "close"});
                    analytics.track('message page', {"type": "open"});

                    const pushAction = StackActions.push({
                        routeName: 'Message',
                        params: {chat: chat, business: business},
                    });
                    this.props.navigation.dispatch(pushAction);
                });
        }
    }

    sendToGroup() {
        const business = this.props.navigation.getParam('business', {});
        if (this.state.selectedChat !== null) {
            analytics.track('share page', {"type": "close"});
            analytics.track('message page', {"type": "open"});
            const pushAction = StackActions.push({
                routeName: 'Message',
                params: {
                    chat: this.state.chats[this.state.selectedChat],
                    business: business
                },
            });
            this.props.navigation.dispatch(pushAction);
        }

    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar barStyle='dark-content'/>
                <View style={styles.container}>
                    <Text style={styles.searchContainer}>Share to...</Text>
                    <Icon name='chevron-left'
                          size={30}
                          containerStyle={{position: 'absolute', left: 10, top: 20}}
                          onPress={() => {

                              analytics.track('share page', {"type": "close"});
                              this.props.navigation.goBack();
                          }}
                    />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <FlatList horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              style={styles.tabGroup}
                              data={[{key: 'Friend'}, {key: 'Group'}]}
                              renderItem={({item}) =>
                                  <View>
                                      <Text style={item.key === this.state.tab ? styles.activeTab : styles.tab}
                                            onPress={() => {
                                                this.setState({tab: item.key})
                                            }}>
                                          {item.key}
                                      </Text>
                                      {item.key === this.state.tab &&
                                      <View style={{marginTop: 2, width: 30, alignSelf: 'center'}}>
                                          <Divider style={{backgroundColor: 'black', height: 4}}/></View>}
                                  </View>}/></View>
                <ScrollView style={{position: 'absolute', top: 200, bottom: 150}}>
                    {this.state.tab === 'Friend' ?
                        (this.state.friends.length === 0 ?
                            <TouchableOpacity style={{
                                width: Dimensions.get('window').width,
                                marginTop: '30%',
                                flex: 1,
                                justifyContent: 'center'
                            }}
                                              onPress={() => {

                                                  analytics.track('share page', {"type": "close"});
                                                  analytics.track('friend page', {"type": "open"});
                                                  this.props.navigation.navigate("Friend");
                                              }}>
                                <Image
                                    style={{width: 40, height: 22, alignSelf: 'center'}}
                                    source={group_add}
                                />
                                <Text style={{marginTop: 20, alignSelf: 'center'}}>You don't have any friend.</Text>
                                <Text style={{marginTop: 10, alignSelf: 'center'}}>Add some friends to plan an
                                    outing!</Text>
                            </TouchableOpacity> :
                            (this.state.friends.map((friend, i) => (
                                <View key={i} style={styles.resultItem}>
                                    <Avatar size={20} rounded source={{uri: friend.avatar}}/>
                                    <Text style={{margin: 6}}>{friend.name}</Text>
                                    <View style={{position: 'absolute', right: 40, top: 5}}>
                                        <RadioButton
                                            isSelected={friend.selected}
                                            size={14}
                                            outerColor={'#4c4c4c'}
                                            innerColor={'#4c4c4c'}
                                            onPress={() => {
                                                var friends = this.state.friends;
                                                friends[i].selected = !friends[i].selected;
                                                this.setState({friends: friends});
                                            }}
                                        />
                                    </View>
                                </View>
                            )))) :
                        (this.state.chats.length === 0 ?
                            <View style={{
                                width: Dimensions.get('window').width,
                                marginTop: '30%',
                                flex: 1,
                                justifyContent: 'center'
                            }}>
                                <Text style={{marginTop: 20, alignSelf: 'center'}}>You don't have any chat yet.</Text>
                            </View> :
                            (this.state.chats.map((chat, i) => (
                                <View key={i} style={styles.resultItem}>
                                    <Text style={{margin: 6}}>{chat.name}({chat.size})</Text>
                                    <View style={{position: 'absolute', right: 40, top: 5}}>
                                        <RadioButton
                                            isSelected={this.state.selectedChat === i}
                                            size={14}
                                            outerColor={'#4c4c4c'}
                                            innerColor={'#4c4c4c'}
                                            onPress={() => this.setState({selectedChat: i})}
                                        />
                                    </View>
                                </View>))))}
                </ScrollView>
                <View style={styles.buttonContainer}>
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
        marginLeft: 20,
        marginTop: 25,
        width: Dimensions.get('window').width,
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
    searchContainer: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        height: 70,
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 16,
        paddingTop: 25,
        width: Dimensions.get('window').width,
    },
    tab: {
        paddingHorizontal: 50,
        textAlign: 'center',
        color: '#cccccc',
    },
    activeTab: {
        paddingHorizontal: 50,
        textAlign: 'center',
        color: 'black',
    },
    tabGroup: {
        paddingTop: 40,
        height: 80,
        flex: 1,
        marginLeft: 60
    },
    button: {
        borderRadius: 20,
        backgroundColor: 'grey',
        height: 42,
        width: 139,
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    buttonContainer: {
        position: 'absolute',
        left: Dimensions.get('window').width / 2 - 70,
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    }
});
