import React, {Component} from 'react';
import {Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import background from '../resources/logos/background.png';
import {Permissions} from "expo"
import {StackActions, NavigationActions} from 'react-navigation';
import Geolocation from "react-native-geolocation-service";

export default class Permission extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            notification: null,
            initial: 0,
            ready1: false,
            ready2: false,
            finish1: false,
            finish2: false,
            region: null
        };
    }

    componentDidMount() {
        Permissions.getAsync(Permissions.NOTIFICATIONS)
            .then(response => {
                this.setState({notification: response.allowsAlert, ready1: true});
                if (response === 'granted' || response.allowsAlert || response.permissions.notifications.allowsAlert) {
                    this.setState({initial: this.state.initial + 1})
                }
            });
        Permissions.getAsync(Permissions.LOCATION)
            .then(response => {
                this.setState({location: response.status, ready2: true});
                if (response.status === 'granted') {
                    this.setState({initial: this.state.initial + 1})
                }
            });
    }

    getPosition() {
        Geolocation.getCurrentPosition(
            position => {
                let region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                };
                storage.save({
                    key: 'region',
                    data: region
                });
                this.setState({region: region});
            },
            error => {
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000})
    }

    async getPermission() {
        const response = await Permissions.getAsync(Permissions.LOCATION);
        if (response.status === 'granted') {
            this.getPosition();
        }
    }

    async askLocation() {
        const response = await Permissions.askAsync(Permissions.LOCATION);
        this.setState({location: null, finish2: true});
    }

    async askNotification() {
        const response = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        this.setState({notification: null, finish1: true});
    }

    render() {
        if (this.state.initial === 2) {
            analytics.track('explore page', {"type": "open"});
            this.props.navigation.navigate("Home");
        }
        if (!this.state.ready1 || !this.state.ready2) {
            return null;
        }
        return (
            <View style={styles.background}>
                <Image style={styles.image} source={background}/>
                <View style={styles.card}>
                    <Text style={styles.friend}>Wanna Hang? Ask Them Out!</Text>
                    <Text style={styles.text}>
                        Add friends to see who’s interested in a place or thing or do, share outing ideas and plan an
                        outing together.
                    </Text>
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.button}
                                          onPress={() => {
                                              analytics.track('friend page', {"type": "open"});
                                              this.getPermission();
                                              const pushAction = StackActions.push({routeName: 'Explore'});
                                              this.props.navigation.dispatch(pushAction);
                                              this.props.navigation.navigate("Friend");
                                          }}>
                            <Text style={{color: 'white'}}>Let's go!</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {!this.state.finish1 &&
                <View style={styles.card}>
                    <Text style={styles.title}>Never forget your plans</Text>
                    <Text style={styles.text}>
                        Get notifications and never miss an important reminder or invite.
                    </Text>
                    <View style={styles.content}>
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
                {!this.state.finish2 &&
                <View style={styles.card}>
                    <Text style={styles.title}>Know what's nearby</Text>
                    <Text style={styles.text}>
                        Turning your locations on will help us show you things to do.
                    </Text>
                    <View style={styles.content}>
                        {this.state.location === 'denied' ?
                            <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('app-settings:')}>
                                <Text style={{color: 'white'}}>Go to Settings</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity style={styles.button} onPress={() => this.askLocation()}>
                                <Text style={{color: 'white'}}>Turn on</Text>
                            </TouchableOpacity>
                        }
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
    },
    friend: {
        width: 250,
        marginLeft: 20,
        marginTop: 60,
        fontSize: 32,
        fontWeight: '600',
        color: '#4c4c4c'
    },
    content: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 100
    }

});