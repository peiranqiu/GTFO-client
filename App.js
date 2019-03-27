import React, {Component} from 'react';
import {Animated, AsyncStorage, Easing, YellowBox} from 'react-native';
import Storage from 'react-native-storage';
import PostServiceClient from "./services/PostServiceClient.js";
import UserServiceClient from "./services/UserServiceClient.js";
import ChatServiceClient from "./services/ChatServiceClient.js";
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
import * as constants from "./constants/constant";
import {AppLoading, BackgroundFetch, Font, Notifications, TaskManager} from 'expo'

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

export default class App extends Component {
    state = {
        fontLoaded: false
    }

    async componentDidMount() {
        await Font.loadAsync({
            'Material Icons': require('@expo/vector-icons/fonts/MaterialIcons.ttf'),
        });
        this.setState({fontLoaded: true});
        this.getStatus();
    }

    getStatus() {
        BackgroundFetch.getStatusAsync().then(status => {
            if (status === BackgroundFetch.Status.Available) {
                TaskManager.getRegisteredTasksAsync().then(tasks => {
                    if (tasks.find(f => f.taskName === 'fetch') == null) {
                        BackgroundFetch.registerTaskAsync('fetch');
                        BackgroundFetch.setMinimumIntervalAsync(90);
                    }
                });
            }
        });
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

TaskManager.defineTask('fetch', async () => {
    PostServiceClient.instance.updateAll();
    storage.load({key: 'user'})
        .then(user => {
            ChatServiceClient.instance.findChatsForUser(user._id)
                .then(chats => {
                    Notifications.cancelAllScheduledNotificationsAsync();
                    chats.map(chat => {
                        let date = new Date(chat.time.slice(0, 19) + 'Z');
                        date.setMinutes(date.getMinutes() - 30); // timestamp
                        date = new Date(date);
                        if(chat.address.length > 0 && date > new Date()) {
                            let localNotification = {
                                title: 'Let\'s get out!',
                                body: chat.name + ' is happening in 30 minute at ' + chat.address,
                                ios: {
                                    sound: true
                                },
                            };
                            let schedulingOptions = {
                                time: date
                            };
                            Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
                        }
                    })
                });
            UserServiceClient.instance.findFriendRequests(user._id)
                .then(requests => {
                    if (requests.length > 0) {
                        let localNotification = {
                            title: 'New Friend',
                            body: requests[0].firstUser.name + " sent you a friend request",
                            ios: {
                                sound: true
                            },
                        };
                        let schedulingOptions = {
                            time: (new Date()).getTime() + 1000
                        };
                        Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
                    }
                });

        })
        .catch(err => {
        });
    return BackgroundFetch.Result.NewData;
});
