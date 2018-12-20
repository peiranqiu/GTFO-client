import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UserServiceClient from "../services/UserServiceClient";
import {Icon} from 'react-native-elements'

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
                <View style={styles.container}>
                    <Text style={{marginTop: 30, alignSelf: 'center'}}>Notification</Text>
                    <Icon name='chevron-left'
                          containerStyle={{position: 'absolute', left: 10, top: 20}}
                          iconStyle={{color: 'grey'}}
                          onPress={() => this.props.navigation.goBack()}
                    />
                </View>
                <ScrollView>
                    {this.state.requests.map((request, i) => (
                        <TouchableOpacity key={i} style={styles.resultItem}>
                            <View>
                                <Text>{request.firstUser.name} sent you a friend request</Text>
                            </View>
                        </TouchableOpacity>
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
});
