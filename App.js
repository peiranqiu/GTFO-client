import React, {Component} from 'react';
import {Animated, AsyncStorage, Easing, YellowBox} from 'react-native';
import Storage from 'react-native-storage';
import {createAppContainer, createBottomTabNavigator, createStackNavigator} from "react-navigation";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import Explore from "./components/Explore";
import Me from "./components/Me";
import Search from "./components/Search";
import Chats from "./components/Chats";
import Friend from "./components/Friend";
import Message from "./components/Message";
import Share from "./components/Share";
import Terms from "./constants/Terms";
import Notification from "./components/Notification";
import Permission from "./components/Permission";
import FeedBack from "./components/FeedBack";
import * as constants from "./constants/constant";
import {AppLoading, Font} from 'expo'
import ExpoMixpanelAnalytics from 'expo-mixpanel-analytics';
import Geolocation from 'react-native-geolocation-service';
import me from './resources/icons/me.svg';
import home from './resources/icons/home.svg';
import explore from './resources/icons/explore.svg';
import chats from './resources/icons/chats.svg';
import SvgUri from 'react-native-svg-uri';
import {Permissions, Notifications} from 'expo';
import UserServiceClient from "./services/UserServiceClient";

YellowBox.ignoreWarnings(['Remote debugger']);

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24 * 30,
    enableCache: true
});
const analytics = new ExpoMixpanelAnalytics(constants.MIXPANEL_TOKEN);

const transitionConfig = () => ({
    transitionSpec: {
        duration: 0,
        timing: Animated.timing,
        easing: Easing.step0,
    },
});


const HomeStack = createStackNavigator({
        Home: Home,
        Search: Search,
        Share: Share,
    },
    {
        initialRouteName: "Home",
        headerMode: 'none',
        navigationOptions: ({navigation}) => ({
            headerVisible: false,
            tabBarVisible: navigation.state.routes[navigation.state.index].routeName === "Home",
        }),
        transitionConfig: transitionConfig,
    });

const ExploreStack = createStackNavigator({
        Explore: Explore,
        Search: Search,
        Share: Share,
        Permission: Permission,
        Notification: Notification,
    },
    {
        initialRouteName: "Explore",
        headerMode: 'none',
        navigationOptions: ({navigation}) => ({
            headerVisible: false,
            tabBarVisible: navigation.state.routes[navigation.state.index].routeName === "Explore",
        }),
        transitionConfig: transitionConfig,
    });

const ChatsStack = createStackNavigator({
        Chats: Chats,
        Message: Message,
        Share: Share,
    },
    {
        initialRouteName: "Chats",
        headerMode: 'none',
        navigationOptions: ({navigation}) => ({
            headerVisible: false,
            tabBarVisible: navigation.state.routes[navigation.state.index].routeName === "Chats",
        }),
        transitionConfig: transitionConfig,
    });

const MeStack = createStackNavigator({
        Me: Me,
        Search: Search,
        Friend: Friend,
        FeedBack: FeedBack,
        Terms: Terms,
    },
    {
        initialRouteName: "Me",
        headerMode: 'none',
        navigationOptions: ({navigation}) => ({
            headerVisible: false,
            tabBarVisible: navigation.state.routes[navigation.state.index].routeName === "Me",
        }),
        transitionConfig: transitionConfig,
    });


const TabNavigator = createBottomTabNavigator({
        Home: {
            screen: HomeStack,
            navigationOptions: {
                headerVisible: false,
                tabBarIcon: ({focused}) => (
                    <SvgUri fill={focused ? 'black' : '#cccccc'} width="26" height="38"
                            source={home}/>
                ),
            },
        },
        Explore: {
            screen: ExploreStack,
            navigationOptions: {
                headerVisible: false,
                tabBarIcon: ({focused}) => (
                    <SvgUri fill={focused ? 'black' : '#cccccc'} width="26" height="38"
                            source={explore}/>
                ),
            },
        },
        Chats: {
            screen: ChatsStack,
            navigationOptions: {
                headerVisible: false,
                tabBarIcon: ({focused}) => (
                    <SvgUri fill={focused ? 'black' : '#cccccc'} width="26" height="38"
                            source={chats}/>
                ),
            },
        },
        Me: {
            screen: MeStack,
            navigationOptions: {
                headerVisible: false,
                tabBarIcon: ({focused}) => (
                    <SvgUri fill={focused ? 'black' : '#cccccc'} width="26" height="38"
                            source={me}/>
                ),
            },
        },
    },
    {
        initialRouteName: "Home",
        headerMode: 'none',
        tabBarOptions: {
            style: {
                borderTopColor: "#dddddd",
            },
            showLabel: false,
            showIcon: true,
            activeTintColor: 'black',
            inactiveTintColor: 'gray',
        },
        transitionConfig: transitionConfig,
    });

const Navigation = createStackNavigator({
        Welcome: Welcome,
        Terms: Terms,
        Screens: TabNavigator
    },
    {
        initialRouteName: "Welcome",
        headerMode: 'none',
        navigationOptions: ({navigation}) => ({
            headerVisible: false,
        }),
        transitionConfig: transitionConfig,
    });

const AppContainer = createAppContainer(Navigation);

export default class App extends Component {
    state = {
        fontLoaded: false
    }

    async componentDidMount() {
        await Font.loadAsync({
            'Material Icons': require('@expo/vector-icons/fonts/MaterialIcons.ttf'),
            'FontAwesome': require('@expo/vector-icons/fonts/FontAwesome.ttf'),
        });
        this.setState({fontLoaded: true});
        this.getPermission();
        const user = await storage.load({key: 'user'});
        if (user.pushToken === null || user.pushToken === undefined) {
            this.registerForPushNotificationsAsync(user);
        }
    }

    async getPermission() {
        const response = await Permissions.getAsync(Permissions.LOCATION);
        this.setState({location: response.status});
        if (response.status === 'granted') {
            Geolocation.getCurrentPosition(
                position => {
                    storage.save({
                        key: 'region',
                        data: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: 0.08,
                            longitudeDelta: 0.08,
                        }
                    })
                },
                (error) => {
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000})
        }
    }

    async registerForPushNotificationsAsync(user) {
        const status = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        if (status === 'granted' || status.permissions.notifications.allowsAlert) {
            user.pushToken = await Notifications.getExpoPushTokenAsync();
            storage.save({
                key: 'user',
                data: {
                    token: user.token,
                    _id: user._id,
                    name: user.name,
                    avatar: user.avatar,
                    pushToken: user.pushToken,
                    blockedBusinessId: user.blockedBusinessId
                }
            });
            UserServiceClient.instance.updateUser(user._id, user);
        }
    }


    render() {
        global.storage = storage;
        global.activeNav = "home";
        global.analytics = analytics;
        if (!this.state.fontLoaded) {
            return (
                <AppLoading
                    autoHideSplash={true}
                />
            );
        }
        return <AppContainer/>;
    }
}