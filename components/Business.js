import React, {Component} from 'react'
import {Dimensions, Image, Linking, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native'
import {Notifications, MapView} from "expo"
import * as constants from "../constants/constant";
import art from '../resources/icons/art.png';
import coffee from '../resources/icons/coffee.png';
import empty from '../resources/icons/empty.png';
import movie from '../resources/icons/movie.png';
import food from '../resources/icons/food.png';
import music from '../resources/icons/music.png';
import {Avatar, Icon} from 'react-native-elements'
import call from "react-native-phone-call";
import PostServiceClient from "../services/PostServiceClient";
import UserServiceClient from "../services/UserServiceClient";
import RBSheet from "react-native-raw-bottom-sheet";

export default class Business extends Component {

    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.userService = UserServiceClient.instance;
        this.state = {
            user: null,
            interested: false,
            followers: [],
            open: false,
            expand: false,
            gtfo: null
        }
    }

    componentDidMount() {
        Notifications.setBadgeNumberAsync(0);
        this.userService.findUserById(constants.GTFO_ID)
            .then(gtfo => this.setState({gtfo: gtfo}));
        const business = this.props.business;
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                this.userService.findFriendList(user._id)
                    .then((friends) => {
                        this.postService.findFollowersForBusiness(business.id)
                            .then(response => {
                                let friendIds = [];
                                friends.map(user => friendIds.push(user._id));
                                friendIds.push(this.state.user._id);
                                response = response.filter(u => friendIds.includes(u._id));
                                response.push(this.state.gtfo);
                                this.setState({followers: response});
                            });
                    });
                this.postService.findIfInterested(business.id, user._id)
                    .then(response => this.setState({interested: response}));
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });

        var now = new Date();
        var day = now.getDay() - 1;
        if (day < 0) {
            day = 6;
        }
        var hourMinute = now.getHours() * 100 + now.getMinutes();
        business.schedules.map(schedule => {
            if (day === schedule.day && hourMinute > schedule.start && hourMinute < schedule.end) {
                this.setState({open: true});
            }
        })
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

    format(schedule) {
        var day = "";
        switch (schedule.day) {
            case 0:
                day = "MON";
                break;
            case 1:
                day = "TUE";
                break;
            case 2:
                day = "WED";
                break;
            case 3:
                day = "THU";
                break;
            case 4:
                day = "FRI";
                break;
            case 5:
                day = "SAT";
                break;
            default:
                day = "SUN";
        }
        return (day + " " + parseInt(schedule.start / 100) + ":"
            + (schedule.start % 100 < 10 ? "0" + schedule.start % 100 : schedule.start % 100) + " - "
            + parseInt(schedule.end / 100) + ":"
            + (schedule.end % 100 < 10 ? "0" + schedule.end % 100 : schedule.end % 100));
    }

    userLikesBusiness() {
        this.postService.userLikesBusiness(this.props.business.id, this.state.user)
            .then(() => {
                let business = this.props.business;
                this.setState({interested: !this.state.interested});
                let followers = this.state.followers;
                if (this.state.interested) {
                    followers.push(this.state.user);
                }
                else {
                    followers = followers.filter(users => users._id !== this.state.user._id);
                }
                this.setState({followers: followers});
                business.interested = this.state.interested;
                business.followers = this.state.followers;
                const refresh = this.props.refresh;
                if (typeof refresh === 'function') {
                    refresh(business);
                }
            })
    }

    updatePreviousPage() {
        let business = this.props.business;
        business.open = true;
        const refresh = this.props.refresh;
        if (typeof refresh === 'function') {
            refresh(business);
        }
        this.RBSheet.close();
        const hide = this.props.hide;
        if (typeof hide === 'function') {
            hide();
        }
    }

    reportBusiness() {
        if (this.props.business.id !== constants.GTFO_ID) {
            this.postService.reportBusiness(this.props.business.id);
        }
        this.blockBusiness();
    }

    blockBusiness() {
        let user = this.state.user;
        this.postService.blockBusiness(user._id, this.props.business.id).then(blockedBusiness => {
            let list = user.blockedBusinessId;
            list.push(blockedBusiness);
            storage.save({
                key: 'user',
                data: {
                    token: user.token,
                    _id: user._id,
                    name: user.name,
                    avatar: user.avatar,
                    pushToken: user.pushToken,
                    blockedBusinessId: list
                }
            });
            this.updatePreviousPage();
        });
    }

    render() {
        if (this.props.business === undefined) {
            return null;
        }
        const widthOffset = Dimensions.get('window').width > 350 ? 32 : 25;
        let size = 0;
        let followers = [];
        let data = this.state.followers;
        size = data.length;
        followers = size > 3 ? data.slice(0, 3) : data;

        return (
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                <RBSheet
                    ref={ref => {
                        this.RBSheet = ref;
                    }}
                    height={220}
                    duration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    }}
                ><TouchableOpacity style={styles.resultItem}
                                   onPress={() => this.reportBusiness()}>
                    <Text style={styles.resultText}>It's spam</Text>
                </TouchableOpacity>
                    <TouchableOpacity style={styles.resultItem}
                                      onPress={() => this.reportBusiness()}>
                        <Text style={styles.resultText}>It's inappropriate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resultItem}
                                      onPress={() => this.reportBusiness()}>
                        <Text style={styles.resultText}>It's a scam</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resultItem}
                                      onPress={() => this.blockBusiness()}>
                        <Text style={{
                            justifyContent: 'center',
                            fontSize: 14
                        }}>Don't show it again</Text>
                    </TouchableOpacity>
                </RBSheet>
                <View>
                    <Image style={styles.image}
                           source={{uri: this.props.business.posts[0].photo}}
                    />
                    <View style={{position: 'absolute', padding: 20, bottom: 20, flexDirection: 'row'}}>
                        <Avatar medium rounded source={{uri: this.props.business.posts[0].user.avatar}}/>
                        <Text style={styles.imageText}>
                            {this.props.business.posts[0].user.name === 'gtfo_guide' ?
                                '' : this.props.business.posts[0].user.name}
                            {this.props.business.posts[0].user.name === 'gtfo_guide' ? '' : ': '}
                            {this.props.business.posts[0].content}
                        </Text></View>
                </View>
                <View style={styles.text}>
                    <View>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "700",
                                marginBottom: 3
                            }}>{this.props.business.name.length > widthOffset ? this.props.business.name.slice(0, widthOffset - 3) + '...' : this.props.business.name}</Text>
                        <Text style={{fontSize: 12}}>
                            {this.props.business.address.slice(-7).includes("Canada") ?
                                this.props.business.address.slice(0, -7)
                                : this.props.business.address}
                        </Text>
                    </View>
                    <View style={{position: 'absolute', right: 10, top: -10, flexDirection: 'row'}}>
                        <Icon
                            size={30}
                            name={this.state.interested ? 'favorite' : 'favorite-border'}
                            iconStyle={{color: 'grey'}}
                            onPress={() => this.userLikesBusiness()}
                        />
                        <Icon name='reply'
                              size={32}
                              iconStyle={{transform: [{scaleX: -1}], color: 'grey', marginLeft: 5}}
                              onPress={() => {
                                  const close = this.props.close;
                                  if (typeof close === 'function') {
                                      close();
                                  }
                                  analytics.track('detail page', {"type": "close"});
                                  analytics.track('share page', {"type": "open"});
                                  this.props.navigation.navigate("Share", {business: this.props.business});
                              }}
                        />
                    </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 5, marginHorizontal: 20}}>
                    {followers.map((user, i) =>
                        <Avatar size={20} rounded key={i} source={{uri: user.avatar}}/>)}
                    {size > 3 && <Text style={{marginVertical: 10, fontSize: 12}}>{' '}+{size - 3}</Text>}
                    <Text style={{marginVertical: 10, fontSize: 12}}>{' '}Interested</Text>
                </View>
                <MapView
                    style={styles.map}
                    provider="google"
                    scrollEnabled={false}
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
                {this.props.business.schedules.length > 0 && <View style={{margin: 20}}>
                    <Text>{this.state.open ? "Open now" : "Closed"}</Text>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        <Text style={{fontSize: 12, color: 'grey', marginTop: 8}}>Hours</Text>
                        <Icon name={this.state.expand ? 'arrow-drop-up' : 'arrow-drop-down'}
                              iconStyle={{color: 'grey'}}
                              containerStyle={{marginTop: 0}}
                              size={32}
                              onPress={() => this.setState({expand: !this.state.expand})}
                        />
                    </View>
                    {this.state.expand &&
                    this.props.business.schedules.map(schedule =>
                        <Text style={{fontSize: 12, marginTop: 5, color: 'grey'}}>{this.format(schedule)}</Text>
                    )}
                </View>}
                <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row', marginBottom: 20}}>
                    <View>
                        <Icon iconStyle={styles.icon}
                              containerStyle={styles.iconOuter}
                              name='directions'
                              size={32}
                              onPress={() => {
                                  let url = "maps:0,0?q=" + this.props.business.name + "@" +
                                      this.props.business.latitude + "," + this.props.business.longitude;
                                  Linking.openURL(url);
                              }}/>
                        <Text style={styles.iconText}>Direction</Text>
                    </View>
                    <View>
                        <Icon iconStyle={styles.icon}
                              containerStyle={styles.iconOuter}
                              name='public'
                              size={32}
                              onPress={() => {
                                  Linking.canOpenURL(this.props.business.website).then(supported => {
                                      if (supported) {
                                          Linking.openURL(this.props.business.website);
                                      }
                                  });
                              }
                              }/>
                        <Text style={styles.iconText}>Yelp</Text>
                    </View>
                    <View>
                        <Icon iconStyle={styles.icon}
                              containerStyle={styles.iconOuter}
                              name='phone'
                              size={32}
                              onPress={() => {
                                  if (this.props.business.phone.length > 9) {
                                      const args = {
                                          number: this.props.business.phone,
                                          prompt: true
                                      };
                                      call(args).catch(console.error);
                                  }
                              }}/>
                        <Text style={styles.iconText}>Contact</Text>
                    </View>
                </View>
                <View style={{justifyContent: 'center', marginTop: 0, marginBottom: 70}}>
                    <Text style={{fontSize: 14, alignSelf: 'center', color: "red"}}
                          onPress={() => this.RBSheet.open()}
                    >Report & Block</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        height: 294,
        width: Dimensions.get('window').width - 60,
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 15,
        marginHorizontal: 5
    },
    text: {
        flexWrap: 'wrap',
        marginBottom: 5,
        marginLeft: 20,
        flexDirection: 'row'
    },

    iconOuter: {
        paddingTop: 10,
        paddingHorizontal: Dimensions.get('window').width < 350 ? 25 : 45,
    },
    icon: {
        color: '#4c4c4c',
        alignSelf: 'center',
    },
    iconText: {
        fontSize: 12,
        color: '#4c4c4c',
        alignSelf: 'center',
        marginTop: 5,
        marginBottom: 30
    },
    map: {
        width: Dimensions.get('window').width - 60,
        height: 200,
        marginTop: 20,
        borderRadius: 10,
        marginHorizontal: 5
    },
    imageText: {
        width: 230,
        height: 60,
        marginLeft: 10,
        lineHeight: 17,
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        marginTop: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 5
    },
    resultItem: {
        borderBottomWidth: 0.5,
        borderColor: 'white',
        padding: 15,
        justifyContent: 'center'
    },
    resultText: {
        color: 'red',
        justifyContent: 'center',
        fontSize: 14
    },
});