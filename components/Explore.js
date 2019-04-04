import React, {Component} from 'react'
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import PostServiceClient from '../services/PostServiceClient'
import {MapView, Permissions, Notifications} from "expo"
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
import notification_new from '../resources/icons/notification_new.png';
import all_sm from '../resources/icons/all.png';
import mylocation from '../resources/icons/mylocation.png';
import {Avatar, Icon} from 'react-native-elements'
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
            initialRegion: null,
            selected: null,
            visible: false,
            appReady: false,
            icon: 0,
            notification: false,
            dropdown: false,
            gtfo: null,
            permission: null,
            boundingBox: {
                westLng: 0,
                southLat: 0,
                eastLng: 0,
                northLat: 0
            }
        }
        this.getPermission = this.getPermission.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        Notifications.setBadgeNumberAsync(0);
        this.userService.findUserById(constants.GTFO_ID)
            .then(gtfo => this.setState({gtfo: gtfo}));
        storage.load({key: 'region'})
            .then(region => {
                let boundingBox = this.getBoundingBox(region);
                this.setState({initialRegion: region, region: region, boundingBox: boundingBox});
                this.loadData(region);
            })
            .catch(err => this.getPermission());
    }

    getPosition() {
        Geolocation.getCurrentPosition(
            position => {
                let region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.08,
                };
                storage.save({
                    key: 'region',
                    data: region
                });
                let boundingBox = this.getBoundingBox(region);
                this.setState({initialRegion: region, region: region, boundingBox: boundingBox});
                this.loadData(region);
            },
            error => {
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000})
    }

    getPermission() {
        Permissions.getAsync(Permissions.LOCATION).then(response => {
            this.setState({location: response.status});
            console.log(response);
            if (response.status === 'granted') {
                this.setState({permission: true});
                this.getPosition();
            }
            else {
                this.setState({permission: false});
            }
        });
    }

    loadData(region) {
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                this.userService.findFriendRequests(user._id)
                    .then(requests => {
                        if(requests.length > 0) {
                            this.setState({notification: true});
                        }
                    });
                this.userService.findFriendList(user._id)
                    .then(friends => {
                        this.postService.findAllBusinesses()
                            .then(businesses => {
                                businesses = this.filterFriends(businesses, friends);
                                businesses.map(business => {
                                    business.interested = false;
                                    business.followers = [];
                                    this.postService.findFollowersForBusiness(business.id)
                                        .then(response => {
                                            let friendIds = [];
                                            friends.map(u => friendIds.push(u._id));
                                            friendIds.push(user._id);
                                            response = response.filter(u => friendIds.includes(u._id));
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
                                businesses = businesses.sort(function (b, a) {
                                    return Math.sqrt(Math.pow(b.latitude - region.latitude, 2)
                                        + Math.pow(b.longitude - region.longitude, 2))
                                        - Math.sqrt(Math.pow(a.latitude - region.latitude, 2)
                                            + Math.pow(a.longitude - region.longitude, 2));
                                });
                                for (let i = 0; i < businesses.length; i++) {
                                    businesses[i].key = i;
                                }
                                if (businesses.length > 0 && this.isInBoudingBox({
                                    latitude: businesses[0].latitude,
                                    longitude: businesses[0].longitude
                                })) {
                                    this.setState({selected: 0});
                                }
                                this.setState({
                                    businesses: businesses, appReady: true
                                });

                            });
                    });
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
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

    onRegionChangeComplete(region) {
        let boundingBox = this.getBoundingBox(region);
        this.setState({region: region, boundingBox: boundingBox});
    }

    getBoundingBox(region) {
        let boundingBox = {
            westLng: region.longitude - region.longitudeDelta / 2, // westLng - min lng
            southLat: region.latitude - region.latitudeDelta / 2, // southLat - min lat
            eastLng: region.longitude + region.longitudeDelta / 2, // eastLng - max lng
            northLat: region.latitude + region.latitudeDelta / 2 // northLat - max lat
        }

        return boundingBox;
    }

    isInBoudingBox(coordinate) {
        if (coordinate.latitude > this.state.boundingBox.southLat && coordinate.latitude < this.state.boundingBox.northLat &&
            coordinate.longitude > this.state.boundingBox.westLng && coordinate.longitude < this.state.boundingBox.eastLng) {
            return true;
        }

        return false;
    }

    render() {
        activeNav = "explore";
        if (this.state.permission !== null && !this.state.permission) {
            this.props.navigation.navigate("Permission");
        }
        let ready = false;
        let size = 0;
        let followers = [];
        let businesses = this.state.businesses;
        const filteredResults = businesses.filter(businesses =>
            this.isInBoudingBox({latitude: businesses.latitude, longitude: businesses.longitude}));

        if (businesses !== [] && businesses[this.state.selected] !== undefined && businesses[this.state.selected].followers !== undefined) {
            let data = businesses[this.state.selected].followers;
            size = data.length;
            followers = size > 3 ? data.slice(0, 3) : data;
            ready = true;
        }
        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle='dark-content'/>
                {this.state.region !== null && this.state.initialRegion !== null &&
                <MapView
                    ref={ref => this.map = ref}
                    style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
                    provider="google"
                    onPress={() => this.setState({dropdown: false})}
                    initialRegion={this.state.initialRegion}
                    onRegionChangeComplete={region => this.onRegionChangeComplete(region)}
                    customMapStyle={constants.MAP_STYLE}>
                    <MapView.Marker
                        zIndex={5000}
                        image={mylocation}
                        coordinate={{
                            latitude: this.state.initialRegion.latitude,
                            longitude: this.state.initialRegion.longitude
                        }}
                    />
                    {this.state.appReady && filteredResults.map((business, index) => (
                        business.category.includes(icons[this.state.icon].filter) &&
                        this.state.selected !== business.key &&
                        <MapView.Marker
                            key={business.key}
                            zIndex={index}
                            onPress={e => this.markerSelected(e._targetInst.return.key)}
                            image={this.getCategory(business.category)}
                            coordinate={{latitude: business.latitude, longitude: business.longitude}}
                        />
                    ))}
                    {this.state.selected !== null && businesses[this.state.selected] !== undefined &&
                    <MapView.Marker
                        zIndex={8000}
                        anchor={{x: 0.5, y: 1}}
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
                              iconStyle={{color: 'grey', height: 32, width: 32}}
                              onPress={() => this.setState({visible: false})}
                        />
                        <Business business={this.state.businesses[this.state.selected]}
                                  navigation={this.props.navigation}
                                  close={() => this.setState({visible: false})}
                                  refresh={business => {
                                      let businesses = this.state.businesses;
                                      businesses[this.state.selected] = business;
                                      this.setState({businesses: businesses})
                                  }}/>
                    </ScrollView>
                </Modal>

                <SafeAreaView style={styles.topBar}>
                    <TouchableOpacity style={styles.leftCircle}
                                      onPress={() => {
                                          analytics.track('explore page', {"type": "close"});
                                          analytics.track('notification page', {"type": "open"});
                                          this.setState({notification: false});
                                          this.props.navigation.navigate("Notification");
                                      }}>
                        <Image style={styles.icon} source={this.state.notification? notification_new : notification}/>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity style={styles.search}
                                          onPress={() => {
                                              analytics.track('explore page', {"type": "close"});
                                              analytics.track('search page', {"type": "open"});
                                              this.props.navigation.navigate("Search");}}>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Icon name='search'
                                      size={16}
                                      iconStyle={{color: 'grey'}}
                                />
                                <Text style={{color: 'grey'}}>{' '}Search Places</Text></View>
                        </TouchableOpacity></View>
                    {this.state.dropdown ?
                        <TouchableOpacity style={styles.dropdown}>
                            {icons.map((icon, i) =>
                                <TouchableOpacity key={i}
                                                  onPress={() => {
                                                      this.setState({icon: i, dropdown: false});
                                                      let firstIndex = businesses.findIndex(b => b.category.includes(icons[i].filter));
                                                      if (firstIndex >= 0 && this.isInBoudingBox({
                                                          latitude: businesses[firstIndex].latitude,
                                                          longitude: businesses[firstIndex].longitude
                                                      })) {
                                                          if (this.state.selected === null) {
                                                              this.setState({selected: firstIndex});
                                                          }
                                                          else {
                                                              if (!businesses[this.state.selected].category.includes(icons[i].filter)) {
                                                                  this.setState({selected: firstIndex});
                                                              }
                                                          }
                                                      }
                                                      else {
                                                          this.setState({selected: null});
                                                      }

                                                  }}>
                                    <Image style={styles.icon} source={icon.uri}/>
                                </TouchableOpacity>)}
                        </TouchableOpacity> :
                        <TouchableOpacity style={styles.rightCircle}
                                          onPress={() => this.setState({dropdown: true})}>
                            <Image style={styles.icon} source={icons[this.state.icon].uri}/>
                        </TouchableOpacity>
                    }
                </SafeAreaView>

                <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>

                    <Icon name='gps-not-fixed'
                          containerStyle={{position: 'absolute', top: -40, right: 20}}
                          onPress={() => this.map.animateToRegion({
                              latitude: this.state.initialRegion.latitude,
                              longitude: this.state.initialRegion.longitude,
                              latitudeDelta: 0.08,
                              longitudeDelta: 0.08,
                          }, 31)}/>
                    {ready && this.state.selected !== null && <TouchableOpacity style={styles.card}
                                                                                onPress={() => this.setState({visible: true})}>
                        <View style={{flexDirection: 'row'}}>
                            <Image style={styles.image}
                                   source={{uri: this.state.businesses[this.state.selected].posts[0].photo}}
                            />
                            <View style={styles.text}>
                                <Text style={{fontSize: 16, marginTop: 5}}>
                                    {this.state.businesses[this.state.selected].name.length > 32 ?
                                        this.state.businesses[this.state.selected].name.slice(0, 29) + '...' :
                                        this.state.businesses[this.state.selected].name}
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
                            {size > 3 && <Text style={{marginVertical: 10, fontSize: 12}}>{' '}+{size - 3}</Text>}
                            <Text style={{marginVertical: 10, fontSize: 12}}>{' '}Interested</Text>
                            <View style={{position: 'absolute', right: 0, bottom: 10, flexDirection: 'row'}}>
                                <Icon
                                    size={30}
                                    name={this.state.businesses[this.state.selected].interested ? 'favorite' : 'favorite-border'}
                                    iconStyle={{color: 'grey'}}
                                    onPress={() => this.userLikesBusiness()}
                                />
                                <Icon name='reply'
                                      size={32}
                                      iconStyle={{transform: [{scaleX: -1}], color: 'grey', marginLeft: 5}}
                                      onPress={() => {

                                          analytics.track('explore page', {"type": "close"});
                                          analytics.track('share page', {"type": "open"});
                                          this.props.navigation.navigate("Share", {business: this.state.businesses[this.state.selected]});}}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>}
                </View>
            </View>)
    }
}

const styles = StyleSheet.create({
    card: {
        height: 175,
        alignSelf: 'center',
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
    search: {
        borderRadius: 30,
        backgroundColor: 'white',
        height: 40,
        width: 237,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
    },
    modal: {
        flex: 1,
        backgroundColor: 'white',
        shadowRadius: 20,
        shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 0},
        paddingHorizontal: 5,
        paddingTop: 40,
        marginVertical: 10,
        borderRadius: 10
    },
    topBar: {
        flexDirection: 'row',
        flex: 1,
        position: 'absolute',
        top: 50,
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