import UserServiceClient from "../services/UserServiceClient";
import React, {Component} from 'react';
import {AsyncStorage, Dimensions, StyleSheet, Image, Text, TouchableOpacity, View, WebView} from "react-native";
import background from '../resources/logos/background.png';
import {Permissions, Location} from "expo"


export default class Permission extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            notification: null,
            initial: 0,
            update: false
        };
    }

    async componentDidMount() {
        await Permissions.getAsync(Permissions.NOTIFICATIONS)
            .then(async (response) => {
                this.setState({notification: response.allowsAlert});
                if (response.allowsAlert) {
                    this.setState({initial: this.state.initial + 1})
                }
            });
        await Permissions.getAsync(Permissions.LOCATION)
            .then(async (response) => {
                this.setState({location: response.status});
                if (response.status === 'granted') {
                    this.setState({initial: this.state.initial + 1})
                }
            });
    }

    async askLocation() {
        Permissions.askAsync(Permissions.LOCATION)
            .then(() => this.setState({location: null}));
        this.setState({update: true});
    }

    async askNotification() {
        Permissions.askAsync(Permissions.NOTIFICATIONS)
            .then(() => this.setState({notification: null}));
        this.setState({notification: null});
    }

    render() {
        if (this.state.initial === 2) {
            this.props.navigation.navigate("Home");
        }
        return (
            <View style={styles.background}>
                <Image style={styles.image} source={background}/>
                <View style={styles.card}>
                    <Text style={{
                        width: 250,
                        marginLeft: 20,
                        marginTop: 60,
                        fontSize: 32,
                        fontWeight: '600',
                        color: '#4c4c4c'
                    }}>Wanna Hang? Ask Them Out!</Text>
                    <Text style={styles.text}>
                        Add friends to see who’s interested in a place or thing or do, share outing ideas and plan an
                        outing together.
                    </Text>
                    <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 100}}>
                        <TouchableOpacity style={styles.button}
                                          onPress={() => this.props.navigation.navigate("Friend")}>
                            <Text style={{color: 'white'}}>Let's go!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.notification !== null &&
                <View style={styles.card}>
                    <Text style={styles.title}>Never forget your plans</Text>
                    <Text style={styles.text}>
                        Get notifications and never miss an important reminder or invite.
                    </Text>
                    <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 100}}>
                        <TouchableOpacity onPress={() => this.setState({notification: null})}>
                            <Text style={{fontSize: 16, textAlign: 'center', margin: 20}}>
                                Not now
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => this.askNotification()}>
                            <Text style={{color: 'white'}}>Turn on</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                }
                {this.state.location !== null &&
                <View style={styles.card}>
                    <Text style={styles.title}>Know
                        what's nearby</Text>
                    <Text style={styles.text}>
                        Turning your locations on will help us show you things to do.
                    </Text>
                    <View style={{justifyContent: 'center', flexDirection: 'row', marginTop: 100}}>
                        <TouchableOpacity style={styles.button} onPress={() => this.askLocation()}>
                            <Text style={{color: 'white'}}>Turn on</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                }

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
        width: 139,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    title: {
        width: 250,
        letterSpacing: 3,
        marginLeft: 20,
        marginTop: 60,
        fontSize: 32,
        fontWeight: '600',
        color: '#4c4c4c'
    },
    text: {
        lineHeight: 18,
        width: 220,
        marginLeft: 20,
        marginTop: 10,
        fontSize: 12,
        color: 'grey'
    }

});