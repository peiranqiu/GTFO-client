import React, {Component} from 'react'
import {BottomNavigation} from 'react-native-material-ui';
import {withNavigation} from 'react-navigation';
import me from '../resources/icons/me.svg';
import home from '../resources/icons/home.svg';
import explore from '../resources/icons/explore.svg';
import chats from '../resources/icons/chats.svg';
import {Image, StyleSheet} from "react-native";
import SvgUri from 'react-native-svg-uri';

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
                    key="home" icon={<SvgUri width="25" height="40" source={home} />}
                    onPress={() => this.props.navigation.navigate("Home")}
                />
                <BottomNavigation.Action
                    style={{
                        container: activeNav === "explore"? styles.activeContainer : styles.container
                    }}
                    key="explore" icon={<SvgUri width="30" height="40" source={explore} />}
                    onPress={() => this.props.navigation.navigate("Explore")}
                />
                <BottomNavigation.Action
                    style={{
                        container: activeNav === "chats"? styles.activeContainer : styles.container
                    }}
                    key="chats" icon={<SvgUri width="24" height="36" source={chats} />}
                    onPress={() => {this.props.navigation.navigate("Chats")}}
                />
                <BottomNavigation.Action
                    style={{
                        container: activeNav === "me"? styles.activeContainer : styles.container
                    }}
                    key="me" icon={<SvgUri width="24" height="40" source={me} />}
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