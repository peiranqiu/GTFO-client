import React, {Component} from 'react'
import {
    ButtonGroup,
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import PostServiceClient from '../services/PostServiceClient'
import AppBottomNav from './AppBottomNav'
import {Avatar, Icon, SearchBar} from 'react-native-elements'
import Modal from "react-native-modal";
import UserServiceClient from "../services/UserServiceClient";
import Business from './Business'
import * as constants from "../constants/constant";

const data = [
    {title: "All", key: ""},
    {title: "Restaurant", key: "food"},
    {title: "Coffee", key: "coffee"},
    {title: "Music", key: "music"},
    {title: "Shopping", key: "shopping"},
    {title: "Movie", key: "movie"},
    {title: "Art", key: "art"},
];

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.userService = UserServiceClient.instance;
        this.filterFriends = this.filterFriends.bind(this);
        this.state = {
            businesses: [],
            user: null,
            filter: "",
            visible: false,
            selected: null,
            appReady: false,
            selectedIndex: 0,
            gtfo: null
        }
    }

    componentDidMount() {
        this.userService.findUserById(constants.GTFO_ID)
            .then(gtfo => this.setState({gtfo: gtfo}));
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                this.userService.findFriendList(user._id)
                    .then((friends) => {
                        this.postService.findAllBusinesses()
                            .then(businesses => {
                                businesses = this.filterFriends(businesses, friends);
                                businesses.map(business => {
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
                                            if(response) {
                                                business.interested = response;
                                                this.setState({appReady: true});
                                            }
                                        });
                                });
                                this.setState({businesses: businesses.reverse(), appReady: true});
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
                if(friendIds.includes(post.user._id) || post.user._id === constants.GTFO_ID) {
                    posts.push(post);
                }
            });
            if(posts.length > 0) {
                business.posts = posts;
                results.push(business);
            }
        });
        return results;
    }

    userLikesBusiness(business) {
        this.postService.userLikesBusiness(business.id, this.state.user)
            .then(() => {
                let businesses = this.state.businesses;
                let index = businesses.findIndex(b => b.id === business.id);
                businesses[index].interested = !businesses[index].interested;
                if (businesses[index].interested) {
                    businesses[index].followers.push(this.state.user);
                }
                else {
                    businesses[index].followers = businesses[index].followers.filter(users =>
                        users._id !== this.state.user._id);
                }
                this.setState({businesses: businesses});
            })
    }

    render() {
        activeNav = "home";
        const filteredResults = this.state.businesses.filter(businesses => {
            return businesses.category.includes(this.state.filter);
        });

        return (
            <SafeAreaView style={{flex: 1}}>
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
                                      this.setState({businesses: businesses})}}/>
                    </ScrollView>
                </Modal>

                <ScrollView>
                    <SearchBar
                        noIcon
                        inputStyle={styles.searchInput}
                        containerStyle={styles.searchContainer}
                        onFocus={() => this.props.navigation.navigate("Search")}
                        placeholder='Search Places'/>
                    <FlatList horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              style={styles.tabGroup}
                              data={data}
                              extraData={this.state}
                              renderItem={({item}) => (
                                  item.key === this.state.filter ?
                                      <Text style={styles.activeTab}
                                            onPress={() => this.setState({filter: item.key})}>
                                          {item.title}
                                      </Text>
                                      :
                                      <Text style={styles.tab}
                                            onPress={() => this.setState({filter: item.key})}>
                                          {item.title}
                                      </Text>)}/>
                    {filteredResults.map((business, i) => {
                        let ready = false;
                        let followers = [];
                        let size = 0;
                        let data = business.followers;
                        if (data !== undefined) {
                            size = data.length;
                            followers = size > 3 ? data.slice(0, 3) : data;
                            ready = true;
                        }
                        return (
                            <TouchableOpacity key={i}
                                              style={styles.card}
                                              onPress={() => this.setState({selected: i, visible: true})}>
                                <Image style={styles.image}
                                       source={{uri: business.posts[0].photo}}
                                />
                                <View style={styles.text}>
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: "700",
                                                marginBottom: 3
                                            }}>{business.name}</Text>
                                        <Text style={{fontSize: 12}}>
                                            {business.address.slice(-7).includes("Canada") ?
                                                business.address.slice(0, -7) : business.address}
                                        </Text>
                                    </View>
                                    <View style={{position: 'absolute', right: 20, top: 0, flexDirection: 'row'}}>
                                        <Icon
                                            size={20}
                                            name={business.interested ? 'star' : 'star-border'}
                                            iconStyle={{color: 'grey'}}
                                            onPress={() => this.userLikesBusiness(business)}
                                        />
                                        <Icon name='share'
                                              size={20}
                                              iconStyle={{color: 'grey', marginLeft: 5}}
                                              onPress={() =>
                                                  this.props.navigation.navigate("Share", {business: business})}
                                        />
                                    </View>
                                </View>
                                {ready &&
                                <View style={{flexDirection: 'row', marginTop: 5, marginHorizontal: 20}}>
                                    {followers.map((user, i) =>
                                        <Avatar size={20} rounded key={i} source={{uri: user.avatar}}/>)}
                                    {size > 3 && <Text style={{marginVertical: 10, marginLeft: 10}}>+ {size - 3}</Text>}
                                    {size > 0 && <Text style={{margin: 10, fontSize: 12}}>Interested</Text>}
                                </View>}
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                <AppBottomNav style={{alignSelf: 'flex-end'}}/>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        height: 406,
        width: Dimensions.get('window').width - 20,
        left: 10,
        right: 10,
        backgroundColor: 'white',
        shadowRadius: 20,
        shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 0},
        marginVertical: 10,
        padding: 5
    },
    image: {
        height: 294,
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 15
    },
    text: {
        flexWrap: 'wrap',
        marginBottom: 5,
        marginLeft: 20,
        flexDirection: 'row'
    },
    searchContainer: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderRadius: 30,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        width: 237,
        alignSelf: 'center',
        marginTop: 10,
    },
    searchInput: {
        height: 24,
        backgroundColor: 'white',
        borderColor: 'white',
        borderRadius: 30,
        borderWidth: 1,
        fontSize: 14,
        textAlign: 'center'
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
    tab: {
        paddingHorizontal: 25,
        textAlign: 'center',
        color: '#cccccc'
    },
    activeTab: {
        paddingHorizontal: 25,
        textAlign: 'center',
        color: 'black'
    },
    tabGroup: {
        paddingTop: 40,
        paddingBottom: 20,
        height: 80,
        flex: 1,
    }
});