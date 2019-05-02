import React, {Component} from 'react';
import {Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PostServiceClient from "../services/PostServiceClient";
import {Icon, SearchBar} from 'react-native-elements'
import Modal from "react-native-modal";
import Business from "./Business";
import {Notifications} from 'expo';


export default class Search extends Component {
    constructor(props) {
        super(props);
        this.postService = PostServiceClient.instance;
        this.state = {
            businesses: [],
            searchTerm: '',
            visible: false,
            selected: null
        };
    }

    componentDidMount() {
        Notifications.setBadgeNumberAsync(0);
        storage.load({key: 'user'})
            .then(user => {
                let blockedBusinessId = [];
                user.blockedBusinessId.map(blockedBusiness =>
                    blockedBusinessId.push(blockedBusiness.businessId)
                );
                this.postService.findAllBusinesses().then(result => {
                    this.setState({businesses: result.filter(business => !business.open && !blockedBusinessId.includes(business.id))});
                });
            })
            .catch(err =>
                this.props.navigation.navigate("Welcome")
            );
    }

    render() {
        const filteredResults =
            (this.state.businesses === undefined || this.state.searchTerm === "") ?
                [] :
                this.state.businesses.filter(business =>
                    !business.open && (business.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())
                    || business.category.includes(this.state.searchTerm.toLowerCase())
                    || business.address.toLowerCase().includes(this.state.searchTerm.toLowerCase()))).reverse();
        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar barStyle='dark-content'/>
                <View style={styles.container}>
                    <SearchBar
                        clearIcon
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        leftIcon={{name: 'chevron-left'}}
                        noIcon
                        value={this.state.searchTerm}
                        onChangeText={term => this.setState({searchTerm: term})}
                        inputStyle={styles.searchInput}
                        containerStyle={styles.searchContainer}
                        placeholder='Search Places'/>
                    <Icon name='chevron-left'
                          containerStyle={{position: 'absolute', left: 10, top: 20}}
                          size={40}
                          onPress={() => {
                              analytics.track('search page', {"type": "close"});
                              this.props.navigation.goBack();
                          }}
                    />
                </View>
                <Text style={{marginHorizontal: 20, marginVertical: 30}}>Places</Text>
                <ScrollView>
                    {filteredResults.map((business, i) => (
                        <TouchableOpacity key={i} style={styles.resultItem}
                                          onPress={() => this.setState({visible: true, selected: business})}>
                            <View>
                                <Text>{business.name}</Text>
                                <Text>{business.address}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Modal isVisible={this.state.visible}>
                    <ScrollView style={styles.modal} showsVerticalScrollIndicator={false}>
                        <Icon name='close'
                              containerStyle={{position: 'absolute', right: 0, top: -30}}
                              iconStyle={{color: 'grey', height: 32, width: 32}}
                              onPress={() => this.setState({visible: false})}
                        />
                        <Business business={this.state.selected}
                                  navigation={this.props.navigation}
                                  refresh={business => {
                                      let businesses = this.state.businesses;
                                      businesses[this.state.selected] = business;
                                      this.setState({businesses: businesses})
                                  }}
                                  hide={() => this.setState({visible: false})}
                                  close={() => this.setState({visible: false})}/>
                    </ScrollView>
                </Modal>
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
        textAlign: 'left',
        paddingBottom: 12,
        paddingLeft: 30
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
});
