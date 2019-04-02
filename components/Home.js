import React, {Component} from 'react'
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    VirtualizedList,
} from 'react-native'
import {Permissions, Notifications} from "expo"
import PostServiceClient from '../services/PostServiceClient'
import {Avatar, Divider, Icon} from 'react-native-elements'
import Modal from "react-native-modal";
import UserServiceClient from "../services/UserServiceClient";
import Business from './Business'
import * as constants from "../constants/constant";
import {CollapsibleHeaderScrollView} from 'react-native-collapsible-header-views';
import DoubleClick from "react-native-double-tap";

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
        this.state = {
            businesses: [],
            user: null,
            filter: "",
            visible: false,
            selected: null,
            selectedIndex: 0,
            gtfo: null
        }
        this.getPermission = this.getPermission.bind(this);
        analytics.track('home page', { "type": "open" });
    }

    componentDidMount() {
        Notifications.setBadgeNumberAsync(0);
        this.userService.findUserById(constants.GTFO_ID)
            .then(gtfo => this.setState({gtfo: gtfo}));
        storage.load({key: 'user'})
            .then(user => {
                this.setState({user: user});
                this.userService.findFriendList(user._id)
                    .then((friends) => {
                        this.postService.findAllBusinesses()
                            .then(result => {
                                    let businesses = result.filter(result => result.order >= 0)
                                        .sort((a, b) => a.order - b.order)
                                        .concat(result.filter(result => result.order < 0).reverse());
                                    let friendIds = [];
                                    friends.map(u => friendIds.push(u._id));
                                    friendIds.push(this.state.user._id);
                                    businesses.map(business => {
                                        let posts = [];
                                        business.posts.map(post => {
                                            if (friendIds.includes(post.user._id) || post.user._id === constants.GTFO_ID) {
                                                posts.push(post);
                                            }
                                        });
                                        if (posts.length > 0) {
                                            business.posts = posts;
                                            business.interested = false;
                                            business.followers = [];
                                            this.postService.findFollowersForBusiness(business.id)
                                                .then(response => {
                                                    response = response.filter(u => friendIds.includes(u._id));
                                                    response.push(this.state.gtfo);
                                                    business.followers = response;
                                                });
                                            this.postService.findIfInterested(business.id, user._id)
                                                .then(response => business.interested = response);
                                            business.key = business.id.toString();
                                            let allBusinesses = this.state.businesses;
                                            allBusinesses.push(business);
                                            this.setState({businesses: allBusinesses});
                                        }
                                    });
                                }
                            );
                    });
            })
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
        storage.load({key: 'region'})
            .then(region => {})
            .catch(err => this.getPermission());
    }

    async getPermission() {
        await Permissions.getAsync(Permissions.LOCATION)
            .then(async (response) => {
                this.setState({location: response.status});
                if (response.status === 'granted') {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            storage.save({
                                key: 'region',
                                data: {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    latitudeDelta: 0.08,
                                    longitudeDelta: 0.08,
                                }
                            })
                        },
                        (error) => {
                        },
                        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000})
                }
            });
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
            });
    }


    render() {
        activeNav = "home";
        const filteredResults = this.state.businesses.filter(businesses =>
            businesses.category.includes(this.state.filter));
        const length = filteredResults.length;

        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar barStyle='dark-content'/>
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
                                  refresh={(business) => {
                                      let businesses = this.state.businesses;
                                      businesses[this.state.selected] = business;
                                      this.setState({businesses: businesses})
                                  }}/>
                    </ScrollView>
                </Modal>
                <CollapsibleHeaderScrollView
                    CollapsibleHeaderComponent={<View style={{height: 120}}>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.search}
                                              onPress={() => {
                                                  analytics.track('home page', {"type": "close"});
                                                  analytics.track('search page', {"type": "open"});
                                                  this.props.navigation.navigate("Search");}}>
                                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                    <Icon name='search'
                                          size={16}
                                          iconStyle={{color: 'grey'}}
                                    />
                                    <Text style={{color: 'grey'}}>{' '}Search Places</Text></View>
                            </TouchableOpacity>
                        </View>
                        <FlatList horizontal={true}
                                  showsHorizontalScrollIndicator={false}
                                  style={styles.tabGroup}
                                  data={data}
                                  extraData={this.state}
                                  renderItem={({item}) => (
                                      item.key === this.state.filter ?
                                          <View><Text style={styles.activeTab}
                                                      onPress={() => this.setState({filter: item.key})}>
                                              {item.title}
                                          </Text><View style={{marginTop: 2, width: 30, alignSelf: 'center'}}>
                                              <Divider style={{backgroundColor: 'black', height: 4}}/></View></View>
                                          :
                                          <Text style={styles.tab}
                                                onPress={() => this.setState({filter: item.key})}>
                                              {item.title}
                                          </Text>)}/></View>}
                    headerHeight={125}
                    statusBarHeight={0}
                >
                    {(this.state.filter !== "" && length === 0) ?
                        <View style={{paddingTop: '50%', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Text>Oops, this category is empty:(</Text>
                        </View> :
                        <VirtualizedList data={filteredResults}
                                         getItem={(data, index) => data[index]}
                                         getItemCount={() => length}
                                         initialNumToRender = {2}
                                         maxToRenderPerBatch = {2}
                                         renderItem={({item, index}) => {
                                             let ready = false;
                                             let followers = [];
                                             let size = 0;
                                             let data = item.followers;
                                             if (data !== undefined) {
                                                 size = data.length;
                                                 followers = size > 3 ? data.slice(0, 3) : data;
                                                 ready = true;
                                             }
                                             return (
                                                 <TouchableOpacity key={index}
                                                                   activeOpacity={1}
                                                                   style={styles.card}
                                                                   onPress={() => this.setState({
                                                                       selected: index,
                                                                       visible: true
                                                                   })}>
                                                     <View>
                                                         <DoubleClick
                                                             doubleTap={() => this.userLikesBusiness(item)}
                                                             delay={200}
                                                         >
                                                             <Image style={styles.image}
                                                                    source={{uri: item.posts[0].photo}}
                                                             /></DoubleClick>
                                                         <View style={{
                                                             position: 'absolute',
                                                             padding: 20,
                                                             bottom: 20,
                                                             flexDirection: 'row'
                                                         }}>
                                                             <Avatar medium rounded
                                                                     source={{uri: item.posts[0].user.avatar}}/>
                                                             <Text style={styles.imageText}>
                                                                 {item.posts[0].user.name === 'gtfo_guide' ?
                                                                     '' : item.posts[0].user.name}
                                                                 {item.posts[0].user.name === 'gtfo_guide' ? '' : ': '}
                                                                 {item.posts[0].content}
                                                             </Text></View>
                                                     </View>
                                                     <View style={styles.text}>
                                                         <View>
                                                             <Text
                                                                 style={{
                                                                     fontSize: 14,
                                                                     fontWeight: "700",
                                                                     marginBottom: 3
                                                                 }}>{item.name.length > 32? item.name.slice(0, 29) + '...' : item.name}</Text>
                                                             <Text style={{fontSize: 12}}>
                                                                 {item.address.slice(-7).includes("Canada") ?
                                                                     item.address.slice(0, -7) : item.address}
                                                             </Text>
                                                         </View>
                                                         <View style={{
                                                             position: 'absolute',
                                                             right: 10,
                                                             top: -10,
                                                             flexDirection: 'row'
                                                         }}>
                                                             <Icon
                                                                 size={30}
                                                                 name={item.interested ? 'favorite' : 'favorite-border'}
                                                                 iconStyle={{color: 'grey'}}
                                                                 onPress={() => this.userLikesBusiness(item)}
                                                             />
                                                             <Icon name='reply'
                                                                   size={32}
                                                                   iconStyle={{
                                                                       transform: [{scaleX: -1}],
                                                                       color: 'grey',
                                                                       marginLeft: 5
                                                                   }}
                                                                   onPress={() => {
                                                                       analytics.track('home page', {"type": "close"});
                                                                       analytics.track('share page', {"type": "open"});
                                                                       this.props.navigation.navigate("Share", {business: item});}}
                                                             />
                                                         </View>
                                                     </View>
                                                     {ready &&
                                                     <View
                                                         style={{
                                                             flexDirection: 'row',
                                                             marginTop: 5,
                                                             marginHorizontal: 20
                                                         }}>
                                                         {followers.map((user, i) =>
                                                             <Avatar size={20} rounded key={i}
                                                                     source={{uri: user.avatar}}/>)}
                                                         {size > 3 &&
                                                         <Text style={{
                                                             marginVertical: 10,
                                                             fontSize: 12
                                                         }}>{' '}+{size - 3}</Text>}
                                                         <Text style={{
                                                             marginVertical: 10,
                                                             fontSize: 12
                                                         }}>{' '}Interested</Text>
                                                     </View>}
                                                 </TouchableOpacity>)
                                         }}/>}
                </CollapsibleHeaderScrollView>
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
        padding: 5,
        borderRadius: 10
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
    tab: {
        paddingHorizontal: 25,
        textAlign: 'center',
        color: '#7f7f7f'
    },
    activeTab: {
        paddingHorizontal: 25,
        textAlign: 'center',
        color: 'black'
    },
    tabGroup: {
        paddingTop: 30,
        paddingBottom: 20,
        height: 80,
        flex: 1,
    },
    search: {
        borderRadius: 30,
        backgroundColor: 'white',
        height: 42,
        width: 237,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
    },
    imageText: {
        width: 250,
        height: 60,
        marginLeft: 20,
        lineHeight: 17,
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
        marginTop: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 5
    }
});