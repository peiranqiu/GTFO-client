import React, {Component} from 'react'
import {BottomNavigation} from 'react-native-material-ui';
import {withNavigation, StackActions, NavigationActions} from 'react-navigation';
import me from '../resources/icons/me.svg';
import home from '../resources/icons/home.svg';
import explore from '../resources/icons/explore.svg';
import chats from '../resources/icons/chats.svg';
import SvgUri from 'react-native-svg-uri';

class AppBottomNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: activeNav,
        }
    }

    handleNavigate(tab) {
        analytics.track(activeNav + ' page', { "type": "close" });
        analytics.track(tab.toLowerCase() + ' page', { "type": "open" });
        const resetAction = StackActions.push({
            routeName: tab,
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <BottomNavigation
                style={{
                    container: {
                        borderWidth: 0,
                        shadowOpacity: 0
                    }
                }}
                hidden={false}>
                <BottomNavigation.Action
                    key="home" icon={<SvgUri fill={activeNav === "home" ? 'black' : '#cccccc'} width="26" height="38"
                                             source={home}/>}
                    onPress={() => {
                        if (activeNav !== "home") {
                            this.handleNavigate('Home');
                        }
                    }}
                />
                <BottomNavigation.Action
                    key="explore"
                    icon={<SvgUri fill={activeNav === "explore" ? 'black' : '#cccccc'} width="30" height="40"
                                  source={explore}/>}
                    onPress={() => {
                        if (activeNav !== "explore") {
                            this.handleNavigate("Explore");
                        }
                    }
                    }
                />
                <BottomNavigation.Action
                    key="chats" icon={<SvgUri fill={activeNav === "chats" ? 'black' : '#cccccc'} width="24" height="36"
                                              source={chats}/>}
                    onPress={() => {
                        if (activeNav !== "chats") {
                            this.handleNavigate("Chats");
                        }
                    }}
                />
                <BottomNavigation.Action
                    key="me"
                    icon={<SvgUri fill={activeNav === "me" ? 'black' : '#cccccc'} width="24" height="40" source={me}/>}
                    onPress={() => {
                        if (activeNav !== "me") {
                            this.handleNavigate("Me");
                        }
                    }
                    }
                />
            </BottomNavigation>
        )
    }
}

export default withNavigation(AppBottomNav);
