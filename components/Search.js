import React, {Component} from 'react';
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PostServiceClient from "../services/PostServiceClient";
import {SearchBar} from 'react-native-elements'
import {Icon} from 'react-native-elements'

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.state = {
            businesses: [],
            searchTerm: ''
        }
    }

    componentDidMount() {
        this.postService.findAllBusinesses()
            .then(businesses => {
                this.setState({businesses: businesses});
            });
    }

    render() {
        const filteredResults = (
            this.state.businesses === undefined ?
                [] :
                this.state.businesses.filter(business => {
                    return business.name.includes(this.state.searchTerm)
                        || business.category.includes(this.state.searchTerm)
                        || business.address.includes(this.state.searchTerm);
                }));
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <SearchBar
                        clearIcon
                        leftIcon={{name: 'chevron-left'}}
                        noIcon
                        value={this.state.searchTerm}
                        onChangeText={term => this.setState({searchTerm: term})}
                        inputStyle={styles.searchInput}
                        containerStyle={styles.searchContainer}
                        placeholder='Search Places'/>
                    <Icon name='chevron-left'
                          containerStyle={{position: 'absolute', left: 10, top: 20}}
                          iconStyle={{color: 'grey'}}
                          onPress={() => this.props.navigation.navigate("Home")}
                    />
                </View>
                <Text style={{marginHorizontal: 20, marginVertical: 30}}>Places</Text>
                <ScrollView>
                    {filteredResults.map((business, i) => (
                        <TouchableOpacity key={i} style={styles.resultItem}>
                            <View>
                                <Text>{business.name}</Text>
                                <Text>{business.address}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>


        );
    }
}

const styles = StyleSheet.create({
    resultItem: {
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 20
    },
    container: {
        width: '100%',
        height: 70,
        margin: 0,
        shadowOpacity: 0.06,
        shadowOffset: {width: 0, height: 14},
        shadowRadius: 10,
    },
    searchContainer: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        width: Dimensions.get('window').width,
        alignSelf: 'center',
        marginTop: 10
    },
    searchInput: {
        height: 36,
        width: Dimensions.get('window').width,
        position: 'absolute',
        right: 0,
        left: 0,
        backgroundColor: 'white',
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        shadowColor: 'grey',
        borderColor: 'white',
        borderWidth: 1,
        fontSize: 14,
        textAlign: 'center'
    }
});