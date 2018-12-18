import React, {Component} from 'react';
import {Image, SafeAreaView, View, StyleSheet, Text} from "react-native";
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
        activeNav = "me";
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
        return (
            <SafeAreaView style={{flex: 1}}>

                <View style={{marginTop: 50, flex: 1}}>
                    {this.state.user !== null &&
                    <View style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignSelf: 'center'
                    }}>
                        <Avatar medium rounded source={{uri: this.state.user.picture}}/>
                        <Text style={{marginTop: 10}}>@{this.state.user.username}</Text>
                    </View>
                    }
                    <List containerStyle={{borderColor: 'white', marginTop: 80, paddingBottom: 40}}>
                        <ListItem containerStyle={styles.listItem}
                                  leftIcon={<Image style={styles.listImage}
                                                   source={friends}/>}
                                  title="Friends"
                                  hideChevron/>
                        <ListItem containerStyle={styles.listItem}
                                  leftIcon={<Image style={styles.listImage}
                                                   source={feedback}/>}
                                  title="Feedback"
                                  hideChevron/>
                        <ListItem containerStyle={styles.listItem}
                                  leftIcon={<Image style={styles.listImage}
                                                   source={privacy}/>}
                                  title="Privacy and Security"
                                  hideChevron/>
                        <ListItem containerStyle={styles.listItem}
                                  onPress={() => this.signOut()}
                                  leftIcon={<Image style={styles.listImage}
                                                   source={logout}/>}
                                  title="Logout"
                                  hideChevron/>
                    </List>
                    <View style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignSelf: 'center'
                    }}>
                        <Text>Version 1.00.0</Text>
                        <Text>Copyright 2018 GTFO, Inc.</Text>
                        <Text>All rights reserved.</Text>
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
        marginRight: 20,

    }
});