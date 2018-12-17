import React, {Component} from 'react'
import {View} from 'react-native'
import PostServiceClient from '../services/PostServiceClient'
import AppBottomNav from './AppBottomNav'
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

export default class Explore extends Component {

    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.state = {
            businesses: [],
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
                this.setState({businesses: businesses})
            });
        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
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
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                {this.state.region !== null &&
                <MapView
                    //provider={PROVIDER_GOOGLE}
                    region={this.state.region}
                    onRegionChange={(region) => this.setState({region: region})}
                />}
                <AppBottomNav/>
            </View>
        )
    }
}