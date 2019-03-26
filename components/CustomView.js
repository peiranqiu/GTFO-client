import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Business from './Business'
import PostServiceClient from "../services/PostServiceClient";
import Modal from "react-native-modal";
import {Avatar, Icon} from 'react-native-elements'
import * as constants from "../constants/constant";
import UserServiceClient from "../services/UserServiceClient";

export default class CustomView extends Component {
    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.userService = UserServiceClient.instance;
        this.state = {
            business: null,
            followers: [],
            visible: false,
        };
    }

    componentDidMount() {
        this.userService.findUserById(constants.GTFO_ID)
            .then(gtfo => this.postService.findBusinessById(this.props.currentMessage.businessId)
                .then(business => this.postService.findFollowersForBusiness(this.props.currentMessage.businessId)
                    .then(response => {
                        response.push(gtfo);
                        this.setState({business: business, followers: response});
                    })));
    }

    render() {
        const business = this.state.business;
        const size = this.state.followers.length;
        const followers = size > 3 ? this.state.followers.slice(0, 3) : this.state.followers;
        return (
            <View>
                {business !== null &&
                <TouchableOpacity style={styles.container}
                                  activeOpacity = {1}
                                  onPress={() => this.setState({visible: true})}>
                    <Image style={styles.image}
                           source={{uri: business.posts[0].photo}}
                    />
                    <View style={styles.text}>
                        <Text style={{fontSize: 17, marginTop: 15}}>
                            {business.name}
                        </Text>
                        <Text style={{lineHeight: 16, fontSize: 14, color: 'grey', marginTop: 10}}>
                            {business.posts[0].user.name === 'gtfo_guide' ?
                                '' : business.posts[0].user.name}
                            {business.posts[0].user.name === 'gtfo_guide' ? '' : ': '}
                            {business.posts[0].content}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', paddingHorizontal: 15, position:'absolute', bottom: 10}}>
                        {followers.map((user, i) =>
                            <Avatar size={20} rounded key={i} source={{uri: user.avatar}}/>)}
                        {size > 3 && <Text style={{marginVertical: 10, fontSize: 12}}>{' '}+{size - 3}</Text>}
                        <Text style={{marginVertical: 10, fontSize: 12}}>{' '}Interested</Text>
                    </View>
                </TouchableOpacity>}
                <Modal isVisible={this.state.visible}>
                    <ScrollView style={styles.modal}>
                        <Icon name='close'
                              containerStyle={{position: 'absolute', right: 0, top: -30}}
                              iconStyle={{color: 'grey'}}
                              onPress={() => this.setState({visible: false})}
                        />
                        <Business business={this.state.business}
                                  navigation = {this.props.navigation}/>
                    </ScrollView>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
    container: {
        width: 222,
        height: 301,
        alignSelf: 'center',
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'white',
        shadowOpacity: 0.15,
        shadowRadius: 15,
        padding: 7,
        marginBottom: 5
    },
    image: {
        height: 138,
        width: 209,
        resizeMode: 'cover',
        borderRadius: 10
    },
    text: {
        width: Dimensions.get('window').width - 208,
        paddingHorizontal: 10,
        height: 60
    },
});