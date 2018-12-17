import React, {Component} from 'react'
import {BottomNavigation} from 'react-native-material-ui';
import {withNavigation} from 'react-navigation';


class AppBottomNav extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: activeNav,
        }
    }

    render() {
        return (
            <BottomNavigation active={activeNav} hidden={false}>
                <BottomNavigation.Action
                    key="home"
                    icon="home"
                    label="Home"
                    onPress={() => this.props.navigation.navigate("Home")}
                />
                <BottomNavigation.Action
                    key="explore"
                    icon="search"
                    label="Explore"
                    onPress={() => this.props.navigation.navigate("Explore")}
                />
                <BottomNavigation.Action
                    key="chats"
                    icon="chat"
                    label="Chats"
                    onPress={() => alert(this.state.active)}
                />
                <BottomNavigation.Action
                    key="me"
                    icon="account-circle"
                    label="Me"
                    onPress={() => alert(this.state.active)}
                />
            </BottomNavigation>
        )
    }
}

export default withNavigation(AppBottomNav);