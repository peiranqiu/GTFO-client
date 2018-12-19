import React, {Component} from 'react';
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UserServiceClient from "../services/UserServiceClient";
import {SearchBar} from 'react-native-elements'
import {Icon} from 'react-native-elements'

export default class Friend extends Component {
    constructor(props) {
        super(props);
        this.userService = UserServiceClient.instance;
        this.state = {
            user: null,
            allUsers: [],
            searchTerm: '',
            friends: [],
            requests: [],
            searching: false
        }
    }

    componentDidMount() {
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                this.userService.findFriendList(user._id)
                    .then((users) => {
                        this.setState({friends: users})
                    });
                this.userService.findFriendRequests(user._id)
                    .then((friends) => {
                        this.setState({requests: friends});
                    });

            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
        this.userService.findAllUsers()
            .then((users) => {
                this.setState({allUsers: users})
            });
    }

    render() {
        const filteredResults = (
            this.state.allUsers === undefined ?
                [] :
                this.state.allUsers.filter(users => {
                    return users.name.includes(this.state.searchTerm) && users._id !== this.state.user._id;
                }));

        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <SearchBar
                        clearIcon
                        leftIcon={{name: 'chevron-left'}}
                        noIcon
                        value={this.state.searchTerm}
                        onChangeText={term => {
                            this.setState({searchTerm: term});
                        }}
                        inputStyle={styles.searchInput}
                        containerStyle={styles.searchContainer}
                        placeholder='Search friends by Instagram ID'/>
                    <Icon name='chevron-left'
                          containerStyle={{position: 'absolute', left: 10, top: 20}}
                          iconStyle={{color: 'grey'}}
                          onPress={() => this.props.navigation.navigate("Me")}
                    />
                </View>
                {this.state.searchTerm.length > 0?
                <ScrollView>
                    <Text style={{marginHorizontal: 20, marginVertical: 30}}>Users on GTFO</Text>
                    {filteredResults.map((u, i) => (
                        <TouchableOpacity key={i} style={styles.resultItem}>
                            <View>
                                <Text>{u.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView> :
                    <ScrollView>
                        <Text style={{marginHorizontal: 20, marginVertical: 30}}>Friend Requests</Text>
                        {this.state.requests.map((request, i) => (
                            <TouchableOpacity key={i} style={styles.resultItem}>
                                <View>
                                    <Text>{request.firstUser.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <Text style={{paddingTop: 30, marginHorizontal: 20, marginVertical: 30}}>Friends</Text>
                        {this.state.friends.map((friend, i) => (
                            <TouchableOpacity key={i} style={styles.resultItem}>
                                <View>
                                    <Text>{friend.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    resultItem: {
        borderBottomWidth: 0,
        borderColor: 'white',
        padding: 20
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
        marginTop: 10
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
        textAlign: 'center'
    }
});
