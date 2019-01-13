import React, {Component} from 'react'
import {
    ButtonGroup,
    FlatList,
    Dimensions,
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
import {Icon, SearchBar} from 'react-native-elements'
import Modal from "react-native-modal";
import UserServiceClient from "../services/UserServiceClient";
import Business from './Business'

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
            appReady: false,
            selectedIndex: 0
        }
        activeNav = "home";
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
                this.setState({businesses: businesses.reverse(), appReady: true});
            });
    }

    render() {
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
                        <Business business={this.state.businesses[this.state.selected]}/>
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
                    {filteredResults.map((business, i) => (
                        <TouchableOpacity key={i}
                                          style={styles.card}
                                          onPress={() => this.setState({selected: i, visible: true})}>
                            <Image style={styles.image}
                                   source={{uri: business.posts[0].photo}}
                            />
                            <View style={styles.text}>

                                <Text>{business.posts[0].user.name}</Text>
                                <Text>{business.posts[0].content}</Text>
                                <Text>{business.name}</Text>
                                <Text>{business.address}</Text>

                            </View>
                        </TouchableOpacity>
                    ))}
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
        marginBottom: 20
    },
    text: {
        flexWrap: 'wrap',
        paddingHorizontal: 20
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