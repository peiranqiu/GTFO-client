import React, {Component} from 'react'
import {Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import PostServiceClient from '../services/PostServiceClient'
import AppBottomNav from './AppBottomNav'
import {MapView} from "expo"
import Geolocation from 'react-native-geolocation-service';
import * as constants from "../constants/constant";
import art from '../resources/icons/art.png';
import coffee from '../resources/icons/coffee.png';
import empty from '../resources/icons/empty.png';
import movie from '../resources/icons/movie.png';
import shopping from '../resources/icons/shopping.png';
import food from '../resources/icons/food.png';
import music from '../resources/icons/music.png';
import art_sm from '../resources/icons/art-sm.png';
import coffee_sm from '../resources/icons/coffee-sm.png';
import movie_sm from '../resources/icons/movie-sm.png';
import food_sm from '../resources/icons/food-sm.png';
import music_sm from '../resources/icons/music-sm.png';
import shopping_sm from '../resources/icons/shopping-sm.png';
import notification from '../resources/icons/notification.png';
import all_sm from '../resources/icons/all.png';
import {Icon, SearchBar} from 'react-native-elements'
import Modal from "react-native-modal";
import Business from "./Business";


const icons = [{uri: all_sm, filter:""},
    {uri: food_sm, filter:"food"},
    {uri: coffee_sm, filter:"coffee"},
    {uri: shopping_sm, filter:"shopping"},
    {uri: music_sm, filter:"music"},
    {uri: art_sm, filter:"art"},
    {uri: movie_sm, filter:"movie"}];


export default class Explore extends Component {

    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.state = {
            businesses: [],
            user: null,
            region: null,
            selected: 0,
            visible: false,
            appReady: false,
            icon: 0,
            dropdown: false
        }
        activeNav = "explore";
    }

    componentDidMount() {
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
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
            },
            (error) => {
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );

        this.postService.findAllBusinesses()
            .then(businesses => {
                this.setState({businesses: businesses, appReady: true});
            });
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

    render() {

        if (!this.state.appReady) {
            return null;
        }
        const filteredResults = this.state.businesses.filter(businesses => {
            return businesses.category.includes(icons[this.state.icon].filter);
        });

        return (
            <View style={{flex: 1}}>
                {this.state.region !== null &&
                <MapView
                    style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
                    provider="google"
                    onPress={() => this.setState({dropdown: false})}
                    region={this.state.region}
                    customMapStyle={constants.MAP_STYLE}>
                    {filteredResults.map((business, index) => (
                        <MapView.Marker
                            key={index}
                            onPress={(e) => {
                                this.markerSelected(e._targetInst.return.key)
                            }}
                            image={this.getCategory(business.category)}
                            coordinate={{latitude: business.latitude, longitude: business.longitude}}
                        />))}
                </MapView>
                }

                <Modal isVisible={this.state.visible}>
                    <ScrollView style={styles.modal}>
                        <Icon name='close'
                              containerStyle={{position: 'absolute', right: 0, top: -30}}
                              iconStyle={{color: 'grey'}}
                              onPress={() => this.setState({visible: false})}
                        />
                        <Business business={this.state.businesses[this.state.selected]}/>
                    </ScrollView>
                </Modal>

                <SafeAreaView style={styles.topBar}>
                    <TouchableOpacity style={styles.leftCircle}
                                      onPress={() => this.props.navigation.navigate("Me")}>
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
                                <TouchableOpacity key={i * 10}
                                                  onPress={() =>
                                                      this.setState({icon: i,dropdown: false})}>
                                    <Image style={styles.icon} source={icon.uri} key={i}/>
                                </TouchableOpacity>)}
                        </TouchableOpacity> :
                        <TouchableOpacity style={styles.rightCircle}
                                          onPress={() => this.setState({dropdown: true})}>
                            <Image style={styles.icon} source={icons[this.state.icon].uri}/>
                        </TouchableOpacity>
                    }
                </SafeAreaView>
                <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
                    <TouchableOpacity style={styles.card}
                                      onPress={() => this.setState({visible: true})}>
                        <Image style={styles.image}
                               source={{uri: this.state.businesses[this.state.selected].posts[0].photo}}
                        />
                        <View style={styles.text}>
                            <Text>{this.state.businesses[this.state.selected].name}</Text>
                            <Text>{this.state.businesses[this.state.selected].posts[0].user.name}</Text>
                            <Text>{this.state.businesses[this.state.selected].posts[0].content}</Text>

                        </View>
                    </TouchableOpacity>
                    <View style={{backgroundColor: 'white', bottom: 0}}>
                        <SafeAreaView>
                            <AppBottomNav/>
                        </SafeAreaView>
                    </View>
                </View>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    card: {
        height: 175,
        alignSelf: 'center',
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'white',
        shadowOpacity: 0.15,
        shadowRadius: 15,
        margin: 10,
        padding: 20
    },
    image: {
        height: 115,
        width: 115,
        resizeMode: 'cover',
        borderRadius: 10
    },
    text: {
        width: Dimensions.get('window').width - 175,
        flexWrap: 'wrap',
        paddingHorizontal: 20
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