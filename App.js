import React, {Component} from 'react';
import {AsyncStorage, YellowBox, Animated, Easing} from 'react-native';
import Storage from 'react-native-storage';
import PostServiceClient from "./services/PostServiceClient.js";
import {createAppContainer, createStackNavigator} from "react-navigation";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import Explore from "./components/Explore";
import Me from "./components/Me";
import Search from "./components/Search";
import Chats from "./components/Chats";
import Friend from "./components/Friend";
import {Font} from 'expo'

YellowBox.ignoreWarnings(['Remote debugger']);


const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24 * 30,
    enableCache: true
});

const AppNavigator = createStackNavigator({
        Welcome: Welcome,
        Home: Home,
        Explore: Explore,
        Me: Me,
        Search: Search,
        Chats: Chats,
        Friend: Friend
    },
    {
        initialRouteName: "Explore",
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
        transitionConfig: () => ({
            transitionSpec: {
                duration: 0,
                timing: Animated.timing,
                easing: Easing.step0,
            },
        }),
    });
const AppContainer = createAppContainer(AppNavigator);


export default class App extends Component {
    state = {
        fontLoaded: false,
    };


    async componentDidMount() {
        await Font.loadAsync({
            'Material Icons': require('@expo/vector-icons/fonts/MaterialIcons.ttf'),
        });

        this.setState({fontLoaded: true});
    }

    render() {
        global.storage = storage;
        global.activeNav = "explore";
        this.interval = setInterval(() => PostServiceClient.instance.updateAll(), 1000 * 60 * 10);
        if (!this.state.fontLoaded) {
            return null;
        }
        return <AppContainer/>;
    }
}

