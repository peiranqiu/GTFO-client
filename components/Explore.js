import React, {Component} from 'react'
import {Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import PostServiceClient from '../services/PostServiceClient'
import AppBottomNav from './AppBottomNav'
import {MapView, Permissions} from "expo"
import Geolocation from 'react-native-geolocation-service';
import * as constants from "../constants/constant";
import art from '../resources/icons/art.png';
import coffee from '../resources/icons/coffee.png';
import empty from '../resources/icons/empty.png';
import movie from '../resources/icons/movie.png';
import shopping from '../resources/icons/shopping.png';
import food from '../resources/icons/food.png';
import music from '../resources/icons/music.png';
import art_lg from '../resources/icons/art_lg.png';
import coffee_lg from '../resources/icons/coffee_lg.png';
import movie_lg from '../resources/icons/movie_lg.png';
import food_lg from '../resources/icons/food_lg.png';
import music_lg from '../resources/icons/music_lg.png';
import shopping_lg from '../resources/icons/shopping_lg.png';
import empty_lg from '../resources/icons/empty_lg.png';
import art_sm from '../resources/icons/art-sm.png';
import coffee_sm from '../resources/icons/coffee-sm.png';
import movie_sm from '../resources/icons/movie-sm.png';
import food_sm from '../resources/icons/food-sm.png';
import music_sm from '../resources/icons/music-sm.png';
import shopping_sm from '../resources/icons/shopping-sm.png';
import notification from '../resources/icons/notification.png';
import all_sm from '../resources/icons/all.png';
import mylocation from '../resources/icons/mylocation.png';
import {Avatar, Icon, SearchBar} from 'react-native-elements'
import Modal from "react-native-modal";
import Business from "./Business";
import UserServiceClient from "../services/UserServiceClient";


const icons = [{uri: all_sm, filter: ""},
    {uri: food_sm, filter: "food"},
    {uri: coffee_sm, filter: "coffee"},
    {uri: shopping_sm, filter: "shopping"},
    {uri: music_sm, filter: "music"},
    {uri: art_sm, filter: "art"},
    {uri: movie_sm, filter: "movie"}];


export default class Explore extends Component {

    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.userService = UserServiceClient.instance;
        this.state = {
            businesses: [],
            user: null,
            region: null,
            selected: 0,
            visible: false,
            appReady: false,
            icon: 0,
            dropdown: false,
            gtfo: null,
            permission: null
        }
        this.getPermission = this.getPermission.bind(this);
    }

    componentDidMount() {
        this.getPermission();
        this.userService.findUserById(constants.GTFO_ID)
            .then(gtfo => this.setState({gtfo: gtfo}));
        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.08,
                        longitudeDelta: 0.08,
                    }
                });
                storage.load({key: 'user'})
                    .then(user => {
                        this.setState({user: user});
                        this.userService.findFriendList(user._id)
                            .then(friends => {
                                this.postService.findAllBusinesses()
                                    .then(businesses => {
                                        businesses = this.filterFriends(businesses, friends);
                                        businesses.map(business => {
                                            console.log(business.posts.length);
                                            business.interested = false;
                                            business.followers = [];
                                            this.postService.findFollowersForBusiness(business.id)
                                                .then(response => {
                                                    response.push(this.state.gtfo);
                                                    business.followers = response;
                                                    this.setState({appReady: true});
                                                });
                                            this.postService.findIfInterested(business.id, user._id)
                                                .then(response => {
                                                    if (response) {
                                                        business.interested = response;
                                                        this.setState({appReady: true});
                                                    }
                                                });
                                        });
                                        this.setState({
                                            businesses: businesses.sort(function (b, a) {
                                                return Math.sqrt(Math.pow(b.latitude - position.coords.latitude, 2)
                                                    + Math.pow(b.longitude - position.coords.longitude, 2))
                                                    - Math.sqrt(Math.pow(a.latitude - position.coords.latitude, 2)
                                                        + Math.pow(a.longitude - position.coords.longitude, 2));
                                            }), appReady: true
                                        });
                                    });
                            });
                    })
                    .catch(err => {
                        this.props.navigation.navigate("Welcome");
                    });
            },
            (error) => {
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
    }

    async getPermission() {
        await Permissions.getAsync(Permissions.LOCATION)
            .then(async (response) => {
                this.setState({location: response.status});
                if (response.status === 'granted') {
                    this.setState({permission: true});
                }
                else {
                    this.setState({permission: false});
                }
            });
    }

    filterFriends(businesses, friends) {
        let friendIds = [];
        friends.map(user => friendIds.push(user._id));
        friendIds.push(this.state.user._id);
        let results = [];
        businesses.map(business => {
            let posts = [];
            business.posts.map(post => {
                if (friendIds.includes(post.user._id) || post.user._id === constants.GTFO_ID) {
                    posts.push(post);
                }
            });
            if (posts.length > 0) {
                business.posts = posts;
                results.push(business);
            }
        });
        return results;
    }

    markerSelected(index) {
        this.setState({selected: index});
    }

    getCategory(category) {
        switch (category) {
            case "coffee":
                return coffee;
                break;
            case "music":
                return music;
                break;
            case "movie":
                return movie;
                break;
            case "art":
                return art;
                break;
            case "food":
                return food;
                break;
            case "shopping":
                return shopping;
                break;
            default:
                return empty;
        }
    }

    getLargeCategory(category) {
        switch (category) {
            case "coffee":
                return coffee_lg;
                break;
            case "music":
                return music_lg;
                break;
            case "movie":
                return movie_lg;
                break;
            case "art":
                return art_lg;
                break;
            case "food":
                return food_lg;
                break;
            case "shopping":
                return shopping_lg;
                break;
            default:
                return empty_lg;
        }
    }

    userLikesBusiness() {
        this.postService.userLikesBusiness(this.state.businesses[this.state.selected].id, this.state.user)
            .then(() => {
                var businesses = this.state.businesses;
                businesses[this.state.selected].interested = !businesses[this.state.selected].interested;
                if (businesses[this.state.selected].interested) {
                    businesses[this.state.selected].followers.push(this.state.user);
                }
                else {
                    businesses[this.state.selected].followers = businesses[this.state.selected].followers.filter(users =>
                        users._id !== this.state.user._id);
                }
                this.setState({businesses: businesses});
            })
    }

    render() {
        activeNav = "explore";
        if(this.state.permission !== null && !this.state.permission) {
            this.props.navigation.navigate("Permission");
        }
        let ready = false;
        let size = 0;
        let followers = [];
        let businesses = this.state.businesses;
        if (businesses !== [] && businesses[this.state.selected] !== undefined && businesses[this.state.selected].followers !== undefined) {
            let firstIndex = businesses.findIndex(b => b.category.includes(icons[this.state.icon].filter));
            if (firstIndex >= 0 && !businesses[this.state.selected].category.includes(icons[this.state.icon].filter)) {
                this.setState({selected: firstIndex});
            }
            let data = businesses[this.state.selected].followers;
            const interested = businesses[this.state.selected].interested;
            size = data.length;
            followers = size > 3 ? data.slice(0, 3) : data;
            ready = true;
        }

        return (
            <View style={{flex: 1}}>
                {this.state.region !== null &&
                <MapView
                    ref={ref => this.map = ref}
                    style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
                    provider="google"
                    onPress={() => this.setState({dropdown: false})}
                    region={this.state.region}
                    customMapStyle={constants.MAP_STYLE}>
                    <MapView.Marker
                        zIndex={5000}
                        image={mylocation}
                        coordinate={{
                            latitude: this.state.region.latitude,
                            longitude: this.state.region.longitude
                        }}
                    />
                    {this.state.appReady && this.state.businesses.map((business, index) => (
                        business.category.includes(icons[this.state.icon].filter) &&
                        this.state.selected !== index &&
                        <MapView.Marker
                            key={index}
                            zIndex={index}
                            onPress={e => this.markerSelected(e._targetInst.return.key)}
                            image={this.getCategory(business.category)}
                            coordinate={{latitude: business.latitude, longitude: business.longitude}}
                        />
                    ))}
                    {businesses[this.state.selected] !== undefined &&
                    <MapView.Marker
                        zIndex={5000}
                        anchor={{x: 0.5, y: 0.81}}
                        image={this.getLargeCategory(businesses[this.state.selected].category)}
                        coordinate={{
                            latitude: businesses[this.state.selected].latitude,
                            longitude: businesses[this.state.selected].longitude
                        }}
                    />}

                </MapView>
                }
                <Modal isVisible={this.state.visible}>
                    <ScrollView style={styles.modal}>
                        <Icon name='close'
                              containerStyle={{position: 'absolute', right: 0, top: -30}}
                              iconStyle={{color: 'grey'}}
                              onPress={() => this.setState({visible: false})}
                        />
                        <Business business={this.state.businesses[this.state.selected]}
                                  refresh={(business) => {
                                      let businesses = this.state.businesses;
                                      businesses[this.state.selected] = business;
                                      this.setState({businesses: businesses})
                                  }}/>
                    </ScrollView>
                </Modal>

                <SafeAreaView style={styles.topBar}>
                    <TouchableOpacity style={styles.leftCircle}
                                      onPress={() => this.props.navigation.navigate("Notification")}>
                        <Image style={styles.icon} source={notification}/>
                    </TouchableOpacity>
                    <SearchBar
                        noIcon
                        inputStyle={styles.searchInput}
                        containerStyle={styles.searchContainer}
                        onFocus={() => this.props.navigation.navigate("Search")}
                        placeholder='Search Places'/>
                    {this.state.dropdown ?
                        <TouchableOpacity style={styles.dropdown}>
                            {icons.map((icon, i) =>
                                <TouchableOpacity key={i}
                                                  onPress={() =>
                                                      this.setState({icon: i, dropdown: false})}>
                                    <Image style={styles.icon} source={icon.uri}/>
                                </TouchableOpacity>)}
                        </TouchableOpacity> :
                        <TouchableOpacity style={styles.rightCircle}
                                          onPress={() => this.setState({dropdown: true})}>
                            <Image style={styles.icon} source={icons[this.state.icon].uri}/>
                        </TouchableOpacity>
                    }
                </SafeAreaView>
                {ready &&
                <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>

                    <Icon name='gps-not-fixed'
                          containerStyle={{position: 'absolute', top: -40, right: 20}}
                          onPress={() => this.map.animateToCoordinate(this.state.region, 31)}/>
                    <TouchableOpacity style={styles.card}
                                      onPress={() => this.setState({visible: true})}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={styles.image}
                                   source={{uri: this.state.businesses[this.state.selected].posts[0].photo}}
                            />
                            <View style={styles.text}>
                                <Text style={{fontSize: 16, marginTop: 5}}>
                                    {this.state.businesses[this.state.selected].name}
                                </Text>
                                <Text style={{lineHeight: 20, fontSize: 14, color: 'grey', marginTop: 10}}>
                                    {this.state.businesses[this.state.selected].posts[0].user.name === 'gtfo_guide' ?
                                        '' : this.state.businesses[this.state.selected].posts[0].user.name}
                                    {this.state.businesses[this.state.selected].posts[0].user.name === 'gtfo_guide' ? '' : ': '}
                                    {this.state.businesses[this.state.selected].posts[0].content}
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', margin: 4}}>
                            {followers.map((user, i) =>
                                <Avatar size={20} rounded key={i} source={{uri: user.avatar}}/>)}
                            {size > 3 && <Text style={{marginVertical: 10, marginLeft: 10}}>+ {size - 3}</Text>}
                            {size > 0 && <Text style={{margin: 10}}>Interested</Text>}
                            {size === 0 && <Text style={{margin: 10, color: 'white'}}>Interested</Text>}
                            <View style={{position: 'absolute', right: 5, bottom: 10, flexDirection: 'row'}}>
                                <Icon
                                    size={20}
                                    name={this.state.businesses[this.state.selected].interested ? 'star' : 'star-border'}
                                    iconStyle={{color: 'grey'}}
                                    onPress={() => this.userLikesBusiness()}
                                />
                                <Icon name='share'
                                      size={20}
                                      iconStyle={{color: 'grey', marginLeft: 5}}
                                      onPress={() =>
                                          this.props.navigation.navigate("Share", {business: this.state.businesses[this.state.selected]})}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={{backgroundColor: 'white', bottom: 0}}>
                        <SafeAreaView>
                            <AppBottomNav/>
                        </SafeAreaView>
                    </View>
                </View>}
            </View>
        )

    }
}

const styles = StyleSheet.create({
    card: {
        height: 175,
        alignSelf: 'center',
        //flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'white',
        shadowOpacity: 0.15,
        shadowRadius: 15,
        margin: 10,
        padding: 15
    },
    image: {
        height: 115,
        width: 115,
        resizeMode: 'cover',
        borderRadius: 10
    },
    text: {
        width: Dimensions.get('window').width - 175,
        paddingHorizontal: 20,
        height: 90
    },
    searchContainer: {
        backgroundColor: 'white',
        height: 40,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderRadius: 30,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        width: 237,
    },
    searchInput: {
        height: 24,
        backgroundColor: 'white',
        borderColor: 'white',
        borderRadius: 30,
        borderWidth: 1,
        fontSize: 14,
        textAlign: 'center',
    },
    modal: {
        flex: 1,
        backgroundColor: 'white',
        shadowRadius: 20,
        shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 0},
        paddingHorizontal: 5,
        paddingTop: 40,
        marginVertical: 30
    },
    topBar: {
        flexDirection: 'row',
        flex: 1,
        position: 'absolute',
        top: 54,
        left: 0,
        right: 0,
        width: Dimensions.get('window').width,
        justifyContent: 'center'
    },
    leftCircle: {
        height: 40,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        marginRight: 30

    },
    icon: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
        margin: 10,
    },
    rightCircle: {
        height: 40,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        marginLeft: 30
    },
    dropdown: {
        height: 280,
        width: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        marginLeft: 30

    }
});