import * as constants from "../constants/constant";
import UserServiceClient from "../services/UserServiceClient";
import React, {Component} from 'react';
import {Text, TouchableOpacity, View, WebView} from "react-native";
import Ins from 'react-native-instagram-login'

export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.userService = UserServiceClient.instance;
        this.state = {}
    }

    logout() {
        this.setState({token: null});
        storage.remove({
            key: 'user'
        });
    }

    login(token) {
        this.setState({token: token});
        this.userService.createUser(token).then(user => {
            storage.save({
                key: 'user',
                data: {
                    token: token,
                    id: user.id,
                    username: user.username,
                    picture: user.picture
                }
            });
            this.props.navigation.navigate("Home");
        });
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {!this.state.token ? (
                    <TouchableOpacity style={{
                        borderRadius: 5,
                        backgroundColor: 'orange',
                        height: 30,
                        width: 100,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} onPress={() => this.refs.ins.show()}>
                        <Text style={{color: 'white'}}>Login</Text>
                        <View style={{height: 0, width: 0}}>
                            <WebView
                                automaticallyAdjustContentInsets={false}
                                source={{uri: 'https://instagram.com/accounts/logout/'}}
                            />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{margin: 10}}>token: {this.state.token}</Text>
                        <TouchableOpacity style={{
                            borderRadius: 5,
                            backgroundColor: 'green',
                            height: 30,
                            width: 100,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} onPress={() => this.logout()}>
                            <Text style={{color: 'white'}}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )
                }
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