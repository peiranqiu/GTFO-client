import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Business from './Business'
import PostServiceClient from "../services/PostServiceClient";
import PropTypes from 'prop-types';
import ChatServiceClient from "../services/ChatServiceClient";
import Modal from "react-native-modal";

import {Avatar, Icon, SearchBar} from 'react-native-elements'

export default class CustomView extends Component {
    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.state = {
            business: null,
            visible: false,
        };
    }

    componentDidMount() {
        this.postService.findBusinessById(this.props.currentMessage.businessId)
            .then((business) => this.setState({business: business}));
    }

    render() {
        const business = this.state.business;
        return (
            <View>
                {business !== null &&
                <TouchableOpacity style={styles.container}
                    onPress={() => this.setState({visible: true})}>
                    <Image style={styles.image}
                           source={{uri: business.posts[0].photo}}
                    />
                    <View style={styles.text}>
                        <Text>{business.name}</Text>
                        <Text>{business.address}</Text>
                    </View>
                </TouchableOpacity>}
                <Modal isVisible={this.state.visible}>
                    <ScrollView style={styles.modal}>
                        <Icon name='close'
                              containerStyle={{position: 'absolute', right: 0, top: -30}}
                              iconStyle={{color: 'grey'}}
                              onPress={() => this.setState({visible: false})}
                        />
                        <Business business={this.state.business}/>
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
        width: 200,
        alignSelf: 'center',
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: 'white',
        shadowOpacity: 0.15,
        shadowRadius: 15,
        padding: 10
    },
    image: {
        height: 115,
        width: 180,
        resizeMode: 'cover',
        borderRadius: 10
    },
    text: {
        flexWrap: 'wrap',
        padding: 10
    },
});