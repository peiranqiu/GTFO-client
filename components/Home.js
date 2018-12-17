import React, {Component} from 'react'
import {Image, SafeAreaView, ScrollView, Text, View} from 'react-native'
import {Card} from 'react-native-elements'
import PostServiceClient from '../services/PostServiceClient'
import AppBottomNav from './AppBottomNav'

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
            <SafeAreaView style={{flex: 1, justifyContent: 'flex-end'}}>
                <ScrollView>
                    <View style={{marginTop: 100}}>
                        {this.state.posts.map((post, i) => (
                            <Card key={i}>
                                <Image
                                    style={{height: 200}}
                                    source={{uri: post.photo}}
                                />
                                <Text>{post.content}</Text>
                            </Card>
                        ))}
                    </View>
                </ScrollView>
                <AppBottomNav/>
            </SafeAreaView>
        )
    }
}