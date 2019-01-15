import * as constants from "../constants/constant";
import UserServiceClient from "../services/UserServiceClient";
import React, {Component} from 'react';
import {Dimensions, StyleSheet, Image, Text, TouchableOpacity, View, WebView} from "react-native";
import Ins from 'react-native-instagram-login'

import background from '../resources/logos/background.png';

export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.userService = UserServiceClient.instance;
        this.state = {}
    }

    login(token) {
        this.setState({token: token});
        this.userService.createUser(token).then(user => {
            storage.save({
                key: 'user',
                data: {
                    token: token,
                    _id: user._id,
                    name: user.name,
                    avatar: user.avatar
                }
            });
            this.userService.findFriendList(user._id)
                .then((users) => {
                    if(users.length > 0) {
                        this.props.navigation.navigate("Home");
                    }
                    else {
                        this.props.navigation.navigate("Permission");
                    }
                });
        });
    }

    render() {
        return (
            <View style={styles.background}>
                <Image style={styles.image} source={background}/>
                <View style={styles.card}>
                    <Text style={{marginLeft: 20, marginTop: 90, fontSize: 32, fontWeight: '400', color: '#4c4c4c'}}>Let’s GTFO</Text>
                    <Text style={{marginLeft: 20, marginTop: 10, fontSize: 12, color: 'grey'}}>
                        Discover places and things to do with your friends, wherever you are.
                    </Text>
                    <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 90}}>
                        <TouchableOpacity style={styles.button} onPress={() => this.refs.ins.show()}>
                            <Text style={{color: 'white'}}>Sign In With Instagram</Text>
                            <View style={{height: 0, width: 0}}>
                                <WebView
                                    automaticallyAdjustContentInsets={false}
                                    source={{uri: 'https://instagram.com/accounts/logout/'}}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                        <Text style={{color: 'grey', fontSize: 10, width: 242, textAlign: 'center'}}>
                            By signing up, you agree to GTFO’s Terms of Service and Privacy Policy.
                        </Text>
                    </View>
                </View>
                {this.state.failure && <View>
                    <Text style={{margin: 10}}>failure: {JSON.stringify(this.state.failure)}</Text>
                </View>}
                <Ins
                    ref='ins'
                    clientId={constants.INSTAGRAM_ID}
                    redirectUrl={constants.INSTAGRAM_REDIRECT}
                    scopes={['basic']}
                    onLoginSuccess={(token) => this.login(token)}
                    onLoginFailure={(data) => this.setState({failure: data})}
                    onBackdropPress
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        height: 390,
        width: 310,
        alignSelf: 'center',
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'white',
        shadowOpacity: 0.15,
        shadowRadius: 15,
        padding: 15
    },
    image: {
        flex: 1,
        width: Dimensions.get('window').width,
        resizeMode: 'cover',
        opacity: 0.5
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    button: {
        borderRadius: 20,
        backgroundColor: '#4c4c4c',
        height: 42,
        width: 246,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    }

});
