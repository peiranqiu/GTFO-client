import React, {Component} from 'react'
import {StyleSheet, Dimensions, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import PostServiceClient from '../services/PostServiceClient'
import AppBottomNav from './AppBottomNav'
import {SearchBar} from 'react-native-elements'

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.state = {
            posts: [],
            user: null,
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
        this.postService.findAllPosts()
            .then(posts => {
                this.setState({posts: posts})
            });
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <SearchBar
                    noIcon
                    inputStyle = {styles.searchInput}
                    containerStyle={styles.searchContainer}
                    onFocus={() => this.props.navigation.navigate("Search")}
                    placeholder='Search Places'/>
                <ScrollView style={{marginTop: 60}}>
                    {this.state.posts.map((post, i) => (
                        <TouchableOpacity key={i} style={styles.card}>
                            <Image style={styles.image}
                                   source={{uri: post.photo}}
                            />
                            <View style={styles.text}>
                                <Text>{post.content}</Text>

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
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 0},
        marginVertical: 10,
        padding: 5
    },
    image: {
        height: 294,
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 10
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
        shadowOpacity: 0.06,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        width: 237,
        alignSelf: 'center',
        marginTop: 10
    },
    searchInput: {
        height: 24,
        backgroundColor: 'white',
        borderColor: 'white',
        borderRadius: 30,
        borderWidth: 1,
        fontSize: 14,
        textAlign: 'center'
    }
});