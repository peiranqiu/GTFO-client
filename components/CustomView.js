import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import Business from './Business'
import PostServiceClient from "../services/PostServiceClient";
import PropTypes from 'prop-types';
import ChatServiceClient from "../services/ChatServiceClient";

export default class CustomView extends Component {
    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.state = {business: null};
    }

    componentDidMount() {
        this.postService.findBusinessById(this.props.currentMessage.businessId)
            .then((business) => this.setState({business: business}));
    }
    render() {
        const business = this.state.business;
        return (
            business !== null &&
            <View>
                <Text>{business.name}</Text>
                <Text>{business.address}</Text>
            </View>
        );
    }
}