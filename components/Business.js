import React, {Component} from 'react'
import {Image, Linking, StyleSheet, Text, View} from 'react-native'
import {MapView} from "expo"
import * as constants from "../constants/constant";
import art from '../resources/icons/art.png';
import coffee from '../resources/icons/coffee.png';
import empty from '../resources/icons/empty.png';
import movie from '../resources/icons/movie.png';
import food from '../resources/icons/food.png';
import music from '../resources/icons/music.png';
import {Icon} from 'react-native-elements'
import call from "react-native-phone-call";
import openMap from "react-native-open-maps";


export default class Business extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
        }
    }

    componentDidMount() {
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
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

    render() {

        if (this.props.business === undefined) {
            return null;
        }
        return (
            <View style={{flex: 1}}>
                <Image style={styles.image}
                       source={{uri: this.props.business.posts[0].photo}}
                />
                <View style={styles.text}>
                    <Text>{this.props.business.name}</Text>
                    <Text>{this.props.business.address}</Text>
                    <Text>{this.props.business.posts[0].user.name}</Text>
                    <Text>{this.props.business.posts[0].content}</Text>

                </View>
                <MapView
                    style={{width: '100%', height: 200}}
                    provider="google"
                    region={{
                        latitude: this.props.business.latitude,
                        longitude: this.props.business.longitude,
                        latitudeDelta: 0.08,
                        longitudeDelta: 0.08,
                    }}
                    customMapStyle={constants.MAP_STYLE}>
                    <MapView.Marker
                        image={this.getCategory(this.props.business.category)}
                        coordinate={{
                            latitude: this.props.business.latitude,
                            longitude: this.props.business.longitude
                        }}
                    />
                </MapView>
                <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                    <Icon iconStyle={styles.icon} containerStyle={styles.iconOuter} name='directions'
                          onPress={() => openMap({
                              latitude: this.props.business.latitude,
                              longitude: this.props.business.longitude
                          })
                          }/>
                    <Icon iconStyle={styles.icon} containerStyle={styles.iconOuter} name='public'
                          onPress={() => {
                              Linking.canOpenURL(this.props.business.website).then(supported => {
                                  if (supported) {
                                      Linking.openURL(this.props.business.website);
                                  }
                              });
                          }
                          }/>
                    <Icon iconStyle={styles.icon} containerStyle={styles.iconOuter} name='phone'
                          onPress={() => {
                              if (this.props.business.phone.length > 9) {
                                  const args = {
                                      number: this.props.business.phone,
                                      prompt: true
                                  };
                                  call(args).catch(console.error);
                              }
                          }}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        height: 294,
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 20
    },
    text: {
        flexWrap: 'wrap',
        marginBottom: 20
    },

    iconOuter: {
        paddingVertical: 30,
        paddingHorizontal: 40,
    },
    icon: {
        color: '#333333',
        alignSelf: 'center'
    }
});