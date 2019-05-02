import React, {Component} from 'react';
import {Image, SafeAreaView, StatusBar, StyleSheet, Text, View, WebView} from "react-native";
import {Avatar, List, ListItem} from "react-native-elements";
import friends from '../resources/icons/friends.png';
import logout from '../resources/icons/logout.png';
import feedback from '../resources/icons/feedback.png';
import privacy from '../resources/icons/privacy.png';
import {Notifications} from 'expo';
import {NavigationActions, StackActions} from "react-navigation";

export default class Me extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    componentDidMount() {
        Notifications.setBadgeNumberAsync(0);
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
    }

    signOut() {
        storage.remove({
            key: 'user'
        });
        this.props.navigation.navigate("Welcome");
    }

    render() {
        activeNav = "me";
        if (this.state.user === null) {
            return null;
        }
        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar barStyle='dark-content'/>
                <View style={{marginTop: 50, flex: 1}}>
                    <View style={styles.center}>
                        <Avatar medium rounded source={{uri: this.state.user.avatar}}/>
                    </View>

                    <View style={styles.center}>
                        <Text style={{marginTop: 10, color: 'grey'}}>@{this.state.user.name}</Text>
                    </View>
                    <List containerStyle={{borderColor: 'white', marginTop: 80, paddingBottom: 60}}>
                        <ListItem containerStyle={styles.listItem}
                                  titleStyle = {{fontSize: 16}}
                                  leftIcon={<Image style={styles.listImage}
                                                   source={friends}/>}
                                  onPress={() => {
                                      analytics.track('me page', {"type": "close"});
                                      analytics.track('friend page', {"type": "open"});
                                      this.props.navigation.navigate("Friend");}}
                                  title="Friends"
                                  hideChevron/>
                        <ListItem containerStyle={styles.listItem}
                                  titleStyle = {{fontSize: 16}}
                                  leftIcon={<Image style={styles.listImage}
                                                   source={feedback}/>}
                                  onPress={() => {
                                      analytics.track('me page', {"type": "close"});
                                      analytics.track('feedback page', {"type": "open"});
                                      this.props.navigation.navigate("FeedBack");}}
                                  title="Feedback"
                                  hideChevron/>
                        <ListItem containerStyle={styles.listItem}
                                  titleStyle = {{fontSize: 16}}
                                  onPress={() => {
                                      analytics.track('me page', {"type": "close"});
                                      analytics.track('terms page', {"type": "open"});
                                      this.props.navigation.navigate("Terms");}}
                                  leftIcon={<Image style={styles.listImage}
                                                   source={privacy}/>}
                                  title="Agreement, Terms and Privacy"
                                  hideChevron/>
                        <ListItem containerStyle={styles.listItem}
                                  titleStyle = {{fontSize: 16}}
                                  onPress={() => this.signOut()}
                                  leftIcon={<Image style={styles.listImage}
                                                   source={logout}/>}
                                  title="Logout"
                                  hideChevron/>
                    </List>
                    <View style={styles.center}>
                        <Text style={styles.text}>Version 1.0.0</Text>
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.text}>Copyright 2019 Wyse Technologies Inc.</Text>
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.text}>All rights reserved.</Text>
                    </View>
                </View>
                <View style={{height: 0, width: 0}}>
                    <WebView
                        automaticallyAdjustContentInsets={false}
                        source={{uri: 'https://instagram.com/accounts/logout/'}}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        borderBottomColor: 'white',
        height: 60
    },
    listImage: {
        marginLeft: 20,
        marginRight: 10,
        width: 20,
        height: 20,
        resizeMode: 'contain'

    },
    center: {
        justifyContent: 'center',
        flexDirection: 'row'
    },
    text: {
        color: 'grey',
        fontSize: 11,
        margin: 2
    }
});