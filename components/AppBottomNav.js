import React, {Component} from 'react'
import {BottomNavigation} from 'react-native-material-ui';
import {withNavigation} from 'react-navigation';
import me from '../resources/icons/me.png';
import home from '../resources/icons/home.png';
import explore from '../resources/icons/explore.png';
import chats from '../resources/icons/chats.png';
import {Image, StyleSheet} from "react-native";

class AppBottomNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: activeNav,
        }
    }

    render() {
        return (
            <BottomNavigation
                style={{
                    container: {
                        borderWidth: 0,
                        shadowOpacity: 0,
                        paddingTop: 10
                    }
                }}
                active={activeNav} hidden={false}>
                <BottomNavigation.Action
                    style={{
                        container: activeNav === "home"? styles.activeContainer : styles.container
                    }}
                    key="home" icon={<Image source={home}/>}
                    onPress={() => this.props.navigation.navigate("Home")}
                />
                <BottomNavigation.Action
                    style={{
                        container: activeNav === "explore"? styles.activeContainer : styles.container
                    }}
                    key="explore" icon={<Image source={explore}/>}
                    onPress={() => this.props.navigation.navigate("Explore")}
                />
                <BottomNavigation.Action
                    style={{
                        container: activeNav === "chats"? styles.activeContainer : styles.container
                    }}
                    key="chats" icon={<Image source={chats}/>}
                    onPress={() => {this.props.navigation.navigate("Chats")}}
                />
                <BottomNavigation.Action
                    style={{
                        container: activeNav === "me"? styles.activeContainer : styles.container
                    }}
                    key="me" icon={<Image source={me}/>}
                    onPress={() => this.props.navigation.navigate("Me")}
                />
            </BottomNavigation>
        )
    }
}

export default withNavigation(AppBottomNav);

const styles = StyleSheet.create({
    activeContainer: {
        opacity: 1
    },
    container: {
        opacity: 0.4
    },});