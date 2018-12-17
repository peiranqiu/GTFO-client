import React, {Component} from 'react'
import {SafeAreaView, View, Image, Text, StyleSheet} from 'react-native'
import {Card} from 'react-native-elements'
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
                    style={{flex: 1, justifyContent: 'flex-end'}}
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
                    {this.state.businesses !== undefined && this.state.businesses[this.state.selected] !== undefined &&
                    <View style={{
                        height: 175,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        borderRadius: 12,
                        borderWidth: 0,
                        backgroundColor: 'white',
                        margin: 10,
                        shadowOpacity: 0.15,
                        shadowRadius: 15,
                    }}>
                        <Image style={{
                            height: 115,
                            width: 115,
                            margin:20
                        }}
                               source={{uri: this.state.businesses[this.state.selected].posts[0].photo}}
                        />
                        <View>
                            <Text>{this.state.businesses[this.state.selected].name}</Text>
                            <Text>{this.state.businesses[this.state.selected].posts[0].content}</Text>

                        </View>
                    </View>}
                </MapView>
                }
                <SafeAreaView>
                    <AppBottomNav style={{alignSelf: 'flex-end'}}/>
                </SafeAreaView>
            </View>
        )


    }
}