import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import Storage from 'react-native-storage';
import PostServiceClient from "./services/PostServiceClient.js";
import {createAppContainer, createStackNavigator} from "react-navigation";
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import Explore from "./components/Explore";

const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24 * 30,
    enableCache: true
});

const AppNavigator = createStackNavigator({
        Welcome: Welcome,
        Home: Home,
        Explore: Explore
    },
    {
        initialRouteName: "Explore",
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });
const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {

    render() {
        global.storage = storage;
        global.activeNav = "explore";
        this.interval = setInterval(() => PostServiceClient.instance.updateAll(), 1000 * 60 * 10);
        return <AppContainer/>;
    }
}

