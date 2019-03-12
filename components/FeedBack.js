import React, {Component} from 'react';
import {
    Dimensions,
    Linking,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {FormInput, Icon} from "react-native-elements";
import dismissKeyboard from 'react-native-dismiss-keyboard';

export default class FeedBack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            text: ""
        };
    }

    componentDidMount() {
        storage.load({key: 'user'})
            .then(user => this.setState({user: user}))
            .catch(err => {
                this.props.navigation.navigate("Welcome");
            });
    }

    submit() {
        let url = 'mailto:contact@gtfo.gg?subject=feedback&body=' + this.state.text;
        Linking.openURL(url);
        this.setState({text: ""});
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
                <SafeAreaView style={{flex: 1}}>
                    <View style={styles.container}>
                        <Text style={styles.searchContainer}>Feedback</Text>
                        <Icon name='chevron-left'
                              containerStyle={{position: 'absolute', left: 10, top: 20}}
                              size={30}
                              onPress={() => this.props.navigation.navigate("Me")}
                        />
                    </View>
                    <FormInput containerStyle={{marginTop: 100, minHeight: 155, borderBottomWidth: 0}}
                               inputStyle={{
                                   width: '80%',
                                   alignSelf: 'center',
                                   textAlign: 'center',
                                   lineHeight: 50,
                                   fontSize: 14
                               }}
                               multiline={true}
                               numberOfLines={4}
                               onChangeText={text => this.setState({text: text})}
                               placeholder="Hey👋 We’d love to hear your feedback! If you’d like a response, please include your email, we’ll get back to you asap."/>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        {this.state.text.length > 0 ?
                            <TouchableOpacity style={styles.button}
                                              onPress={() => this.submit()}>
                                <Text style={{color: 'white'}}>Submit</Text>
                            </TouchableOpacity> :
                            <View style={styles.disabledButton}>
                                <Text style={{color: 'white'}}>Submit</Text>
                            </View>}
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    }
}
const styles = StyleSheet.create({
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
        height: 70,
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 16,
        paddingTop: 25,
        width: Dimensions.get('window').width,
    },
    button: {
        borderRadius: 20,
        backgroundColor: '#4c4c4c',
        height: 42,
        width: 139,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 280,
        marginTop:10
    },
    disabledButton: {
        borderRadius: 20,
        backgroundColor: '#c8c8c8',
        height: 42,
        width: 139,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 280,
        marginTop:10
    },
});
