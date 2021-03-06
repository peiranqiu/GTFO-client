import React, {Component} from 'react';
import {
    Dimensions,
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
import {Avatar, Icon, SearchBar} from 'react-native-elements'
import friend_request from '../resources/icons/friend_request.svg';
import add_friend from '../resources/icons/add_friend.png';
import group_add from '../resources/icons/group_add.png';
import SvgUri from 'react-native-svg-uri';
import * as constants from "../constants/constant";
import {Notifications} from 'expo';
import RBSheet from "react-native-raw-bottom-sheet";

export default class Friend extends Component {
    constructor(props) {
        super(props);
        this.userService = UserServiceClient.instance;
        this.state = {
            user: null,
            allUsers: [],
            searchTerm: '',
            friends: null,
            requests: null,
            sends: [],
            searching: false,
            selected: null
        };
    }

    componentDidMount() {
        Notifications.setBadgeNumberAsync(0);
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                this.userService.findFriendList(user._id)
                    .then(users => this.setState({friends: users}));
                this.userService.findFriendSends(user._id)
                    .then(users => this.setState({sends: users}));
                this.userService.findFriendRequests(user._id)
                    .then(friends => this.setState({requests: friends}));
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
        this.userService.findAllUsers()
            .then(users => this.setState({allUsers: users}));
    }

    acceptRequest(i) {
        let requests = this.state.requests;
        let friends = this.state.friends;
        this.userService.acceptFriendRequest(requests[i].id)
            .then(() => {
                friends.push(requests[i].firstUser);
                requests.splice(i, 1);
                this.setState({requests: requests, friends: friends});
            });
    }

    sendRequest(user) {
        this.userService.sendFriendRequest(user._id, this.state.user)
            .then(response => {
                let sends = this.state.sends;
                sends.push(user);
                this.setState({sends: sends});
            });
    }

    deleteFriend(i) {
        let friends = this.state.friends;
        this.userService.deleteFriend(this.state.user._id, friends[i]._id)
            .then(() => {
                friends.splice(i, 1);
                this.setState({friends: friends});
                this.RBSheet.close();
            });
    }

    reportUser(userId) {
        this.userService.reportUser(userId).then(() => {
            let users = this.state.allUsers.filter(users => users._id !== userId);
            this.setState({allUsers: users});
            this.deleteFriend(this.state.selected);
        });
    }

    isFriend(user) {
        let status = false;
        this.state.friends.map(friend => {
            if (friend._id === user._id) {
                status = true;
            }
        });
        return status;
    }

    isInRequest(user) {
        let status = false;
        this.state.requests.map(request => {
            if (request.firstUser._id === user._id) {
                status = true;
            }
        });
        return status;
    }

    isSent(user) {
        let status = false;
        this.state.sends.map(friend => {
            if (friend._id === user._id) {
                status = true;
            }
        });
        return status;
    }

    render() {
        const filteredResults = (
            this.state.allUsers === undefined ?
                [] :
                this.state.allUsers.filter(users => {
                    return users.name.includes(this.state.searchTerm) && users._id !== this.state.user._id && users._id !== constants.GTFO_ID;
                }));
        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar barStyle='dark-content'/>
                <View style={styles.container}>
                    <SearchBar
                        ref={search => this.search = search}
                        clearIcon
                        leftIcon={{name: 'chevron-left'}}
                        noIcon
                        value={this.state.searchTerm}
                        onChangeText={term => {
                            this.setState({searchTerm: term});
                        }}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        inputStyle={styles.searchInput}
                        containerStyle={styles.searchContainer}
                        placeholder='Search friends by Instagram ID'/>
                    <Icon name='chevron-left'
                          containerStyle={{position: 'absolute', left: 10, top: 15}}
                          size={40}
                          onPress={() => {
                              analytics.track('friend page', {"type": "close"});
                              analytics.track('me page', {"type": "open"});
                              this.props.navigation.navigate("Me");
                          }}
                    />
                </View>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={220}
                    duration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    }}
                ><TouchableOpacity style={styles.resultItem}
                                   onPress={() => this.reportUser(this.state.friends[this.state.selected]._id)}>
                    <Text style={styles.resultText}>Report spam</Text>
                </TouchableOpacity>
                    <TouchableOpacity style={styles.resultItem}
                                      onPress={() => this.reportUser(this.state.friends[this.state.selected]._id)}>
                        <Text style={styles.resultText}>Report inappropriate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resultItem}
                                      onPress={() => this.reportUser(this.state.friends[this.state.selected]._id)}>
                        <Text style={styles.resultText}>Report scam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resultItem}
                                      onPress={() => this.deleteFriend(this.state.selected)}>
                        <Text style={{
                            justifyContent: 'center',
                            fontSize: 14
                        }}>Delete friend</Text>
                    </TouchableOpacity>
                </RBSheet>
                {this.state.searchTerm.length > 0 ?
                    <ScrollView>
                        <Text style={{marginHorizontal: 20, marginTop: 30}}>Users on GTFO</Text>
                        {filteredResults.length === 0 ?
                            <TouchableOpacity style={{
                                width: Dimensions.get('window').width,
                                marginTop: '30%',
                                flex: 1,
                                justifyContent: 'center'
                            }}
                                              onPress={() => this.search.focus()}>
                                <Image
                                    style={{width: 40, height: 22, alignSelf: 'center'}}
                                    source={group_add}
                                />
                                <Text style={{fontSize: 14, marginTop: 20, alignSelf: 'center'}}>No result...</Text>
                                <Text style={{fontSize: 14, marginTop: 10, alignSelf: 'center'}}>Try another search or
                                    ask your friend to sign up!</Text>
                            </TouchableOpacity> :
                            (filteredResults.map((u, i) => (
                                <View key={i} style={styles.resultItem}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Avatar size={20} rounded source={{uri: u.avatar}}/>
                                        <Text style={{margin: 6}}>{u.name}</Text>
                                        {!this.isSent(u) && !this.isInRequest(u) && !this.isFriend(u) &&
                                        <TouchableOpacity style={{position: 'absolute', right: 30, top: 5}}
                                                          onPress={() => this.sendRequest(u)}>
                                            <Image
                                                style={{width: 20, height: 20}}
                                                source={add_friend}
                                            />
                                        </TouchableOpacity>}
                                        {this.isSent(u) &&
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: 'grey',
                                                position: 'absolute',
                                                right: 30,
                                                top: 5
                                            }}>
                                            Pending</Text>}
                                        {this.isInRequest(u) &&
                                        <Text style={{position: 'absolute', right: 30, top: 5}}>
                                            <SvgUri width="20" height="20" source={friend_request}/></Text>}
                                    </View>
                                </View>
                            )))}
                    </ScrollView> :
                    ((this.state.requests !== null && this.state.friends !== null) && (this.state.requests.length + this.state.friends.length === 0 ?
                        <TouchableOpacity style={{
                            width: Dimensions.get('window').width,
                            marginTop: '30%',
                            flex: 1,
                            justifyContent: 'center'
                        }}
                                          onPress={() => this.search.focus()}>
                            <Image
                                style={{width: 40, height: 22, alignSelf: 'center'}}
                                source={group_add}
                            />
                            <Text style={{fontSize: 14, marginTop: 20, alignSelf: 'center'}}>You don't have any
                                friend:( {"\n"} Search
                                to add some friend!</Text>
                        </TouchableOpacity> :
                        <ScrollView>
                            <Text style={{color: 'grey', marginHorizontal: 20, marginTop: 30}}>Friend Requests</Text>
                            {this.state.requests.map((request, i) => (
                                <View key={i} style={styles.resultItem}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Avatar size={20} rounded source={{uri: request.firstUser.avatar}}/>
                                        <Text style={{margin: 6}}>{request.firstUser.name}</Text>
                                        <TouchableOpacity style={{position: 'absolute', right: 30, top: 5}}
                                                          onPress={() => this.acceptRequest(i)}>
                                            <SvgUri width="20" height="20" source={friend_request}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                            <Text style={{
                                color: 'grey',
                                paddingTop: 20,
                                marginHorizontal: 20,
                                marginTop: 20
                            }}>Friends</Text>
                            {this.state.friends.map((friend, i) => (
                                <View key={i} style={styles.resultItem}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Avatar size={20} rounded source={{uri: friend.avatar}}/>
                                        <Text style={{margin: 6}}>{friend.name}</Text>
                                        <Icon name='more-horiz'
                                              containerStyle={{position: 'absolute', right: 10, top: 5}}
                                              size={16}
                                              onPress={() => {
                                                  this.setState({selected: i});
                                                  this.RBSheet.open();
                                              }}
                                        />
                                    </View>
                                </View>
                            ))}
                        </ScrollView>))
                }
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
        width: Dimensions.get('window').width,
        alignSelf: 'center',
        marginTop: 10,
    },
    searchInput: {
        height: 36,
        width: Dimensions.get('window').width,
        position: 'absolute',
        right: 0,
        left: 0,
        backgroundColor: 'white',
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        shadowColor: 'grey',
        borderColor: 'white',
        borderWidth: 1,
        fontSize: 14,
        textAlign: 'left',
        paddingBottom: 10,
        paddingLeft: 40
    },
    resultItem: {
        borderBottomWidth: 0.5,
        borderColor: 'white',
        padding: 15,
        justifyContent: 'center'
    },
    resultText: {
        color: 'red',
        justifyContent: 'center',
        fontSize: 14
    },
});
