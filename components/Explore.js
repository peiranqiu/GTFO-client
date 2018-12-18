import React, {Component} from 'react'
import {SafeAreaView, View, Image, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native'
import PostServiceClient from '../services/PostServiceClient'
import AppBottomNav from './AppBottomNav'
import {MapView} from "expo"
import Geolocation from 'react-native-geolocation-service';
import * as constants from "../constants/constant";
import art from '../resources/icons/art.png';
import coffee from '../resources/icons/coffee.png';
import empty from '../resources/icons/empty.png';
import movie from '../resources/icons/movie.png';
import food from '../resources/icons/food.png';
import music from '../resources/icons/music.png';


export default class Explore extends Component {

    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.state = {
            businesses: [],
            posts: [],
            user: null,
            region: null,
            selected: 2
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
        this.postService.findAllBusinesses()
            .then(businesses => {
                this.setState({businesses: businesses});
                // let posts = [];
                // businesses.map(business => {
                //     posts.concat(business.posts)
                // });
                // this.setState({posts: posts});
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
            default:
                return empty;
        }
    }

    markerSelected(index) {
        this.setState({selected: index});
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.region !== null &&
                <MapView
                    style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
                    provider="google"
                    region={this.state.region}
                    customMapStyle={constants.MAP_STYLE}>
                    {this.state.businesses !== undefined &&
                    this.state.businesses.map((business, index) => (
                        <MapView.Marker
                            key={index}
                            onPress={(e) => this.markerSelected(e._targetInst.return.key)}
                            image={this.getCategory(business.category)}
                            coordinate={{latitude: business.latitude, longitude: business.longitude}}
                        />))}
                </MapView>
                }

                <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
                    {this.state.businesses !== undefined && this.state.businesses[this.state.selected] !== undefined &&
                    <TouchableOpacity style={styles.card}>
                        <Image style={styles.image}
                               source={{uri: this.state.businesses[this.state.selected].posts[0].photo}}
                        />
                        <View style={styles.text}>
                            <Text>{this.state.businesses[this.state.selected].name}</Text>
                            <Text>{this.state.businesses[this.state.selected].posts[0].content}</Text>

                        </View>
                    </TouchableOpacity>}
                    <View style={{backgroundColor: 'white', bottom: 0}}>
                        <SafeAreaView>
                            <AppBottomNav/></SafeAreaView>
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
    }
});