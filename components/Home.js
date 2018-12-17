import React, {Component} from 'react'
import {ScrollView, View} from 'react-native'
import {ListItem} from 'react-native-elements'
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
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <ScrollView style={{marginTop: 30}}>
                    <View style={{padding: 15}}>
                        {this.state.posts.map((post, i) => (
                            <ListItem
                                title={post.content}
                                key={i}/>
                        ))}
                    </View>
                </ScrollView>
                <AppBottomNav/>
            </View>
        )
    }
}
