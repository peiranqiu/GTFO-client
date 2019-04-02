import React, {Component} from 'react';
import {Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UserServiceClient from "../services/UserServiceClient";
import {Avatar, Icon} from 'react-native-elements'
import friend_request from '../resources/icons/friend_request.svg';
import SvgUri from 'react-native-svg-uri';
import {Notifications} from 'expo';


export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.userService = UserServiceClient.instance;
        this.state = {
            user: null,
            requests: []
        }
    }

    componentDidMount() {
        Notifications.setBadgeNumberAsync(0);
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                this.userService.findFriendRequests(user._id)
                    .then((friends) => {
                        this.setState({requests: friends});
                    });
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
    }

    render() {

        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar barStyle='dark-content'/>
                <View style={styles.container}>
                    <Text style={styles.searchContainer}>Notification</Text>
                    <Icon name='chevron-left'
                          containerStyle={{position: 'absolute', left: 10, top: 20}}
                          size={30}
                          onPress={() => {
                              analytics.track('notification page', {"type": "close"});
                              this.props.navigation.goBack();}}
                    />
                </View>
                <ScrollView>
                    {this.state.requests.map((request, i) => (
                        <View key={i} style={styles.resultItem}>
                            <View style={{flexDirection: 'row'}}>
                                <Avatar size={20} rounded source={{uri: request.firstUser.avatar}}/>
                                <Text style={{margin: 6}}>{request.firstUser.name} wants to be friend with you</Text>
                                <TouchableOpacity style={{position: 'absolute', right: 30, top: 5}}
                                                  onPress={() => this.acceptRequest(i)}>
                                    <SvgUri width="20" height="20" source={friend_request} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
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
        height: 70,
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 16,
        paddingTop: 25,
        width: Dimensions.get('window').width,
    },
});
