import React, {Component} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from "react-native";
import AppBottomNav from "./AppBottomNav";
import {Avatar, List, ListItem} from "react-native-elements";
import friends from '../resources/icons/friends.png';
import logout from '../resources/icons/logout.png';
import feedback from '../resources/icons/feedback.png';
import privacy from '../resources/icons/privacy.png';

export default class Me extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    componentDidMount() {
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

                <View style={{marginTop: 50, flex: 1}}>
                    <View style={styles.center}>
                        <Avatar medium rounded source={{uri: this.state.user.avatar}}/>
                    </View>

                    <View style={styles.center}>
                        <Text style={{marginTop: 10, color: 'grey'}}>@{this.state.user.name}</Text>
                    </View>
                    <List containerStyle={{borderColor: 'white', marginTop: 80, paddingBottom: 40}}>
                        <ListItem containerStyle={styles.listItem}
                                  titleStyle = {{fontSize: 16}}
                                  leftIcon={<Image style={styles.listImage}
                                                   source={friends}/>}
                                  onPress={() => this.props.navigation.navigate("Friend")}
                                  title="Friends"
                                  hideChevron/>
                        <ListItem containerStyle={styles.listItem}
                                  titleStyle = {{fontSize: 16}}
                                  leftIcon={<Image style={styles.listImage}
                                                   source={feedback}/>}
                                  onPress={() => this.props.navigation.navigate("FeedBack")}
                                  title="Feedback"
                                  hideChevron/>
                        <ListItem containerStyle={styles.listItem}
                                  titleStyle = {{fontSize: 16}}
                                  onPress={() => this.props.navigation.navigate("Terms")}
                                  leftIcon={<Image style={styles.listImage}
                                                   source={privacy}/>}
                                  title="Terms and Privacy"
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
                        <Text style={styles.text}>Version 1.00.0</Text>
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.text}>Copyright 2019 GTFO, Inc.</Text>
                    </View>
                    <View style={styles.center}>
                        <Text style={styles.text}>All rights reserved.</Text>
                    </View>


                </View>
                <AppBottomNav style={{alignSelf: 'flex-end'}}/>
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