import React, {Component} from 'react'
import {SafeAreaView, View} from 'react-native'
import PostServiceClient from '../services/PostServiceClient'
import AppBottomNav from './AppBottomNav'
import {MapView} from "expo"
import Geolocation from 'react-native-geolocation-service';
import * as constants from "../constants/constant";

export default class Explore extends Component {

    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.state = {
            businesses: [],
            posts: [],
            user: null,
            region: null
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

    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.region !== null &&
                <MapView
                    style={{flex: 1}}
                    provider="google"
                    region={this.state.region}
                    customMapStyle={constants.MAP_STYLE}
                >
                    {this.state.businesses !== undefined &&
                    this.state.businesses.map(business => (
                        <MapView.Marker
                            key={business.id}
                            coordinate={{latitude: business.latitude, longitude: business.longitude}}
                        />))}
                </MapView>
                }
                <SafeAreaView style={{justifyContent: 'flex-end'}}>
                    <AppBottomNav/>
                </SafeAreaView>
            </View>
        )
    }
}