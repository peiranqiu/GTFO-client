import React, {Component} from 'react';
import {AsyncStorage, Alert, YellowBox, Animated, Easing} from 'react-native';
import Storage from 'react-native-storage';
import PostServiceClient from "./services/PostServiceClient.js";
import UserServiceClient from "./services/UserServiceClient.js";
import {createAppContainer, createStackNavigator} from "react-navigation";
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
import {Font, Asset, AppLoading} from 'expo'
import * as constants from "./constants/constant";

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
        Friend: Friend,
        Message: Message,
        Share: Share,
        Permission: Permission,
        Notification: Notification,
        FeedBack: FeedBack,
        Terms: Terms
    },
    {
        initialRouteName: "Home",
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

// BackgroundTask.define(async () => {
//     PostServiceClient.instance.updateAll();
//     UserServiceClient.instance.updateAvatar();
//
//     storage.load({key: 'user'})
//         .then(user => {
//             fetch(constants.SERVER + 'friend/request/' + user._id)
//                 .then(response => {
//                     let requests = response.json();
//                     if (requests.length > 0) {
//                         console.log(requests[0].firstUser.name);
//                     }
//                 })
//         })
//         .catch(err => console.log(err));
//     BackgroundTask.finish();
// });

export default class App extends Component {
    state = {
        fontLoaded: false,
    }

    async componentDidMount() {
        await Font.loadAsync({
            'Material Icons': require('@expo/vector-icons/fonts/MaterialIcons.ttf'),
        });

        this.setState({fontLoaded: true});
        // BackgroundTask.schedule({
        //     period: 900,
        // });
    }

    render() {
        global.storage = storage;
        global.activeNav = "home";
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

