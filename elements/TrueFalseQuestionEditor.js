import React, {Component} from 'react'
import {FormLabel, FormInput, FormValidationMessage, Button, Text, CheckBox} from 'react-native-elements'
import {View} from "react-native";

export default class TrueFalseQuestionEditor extends Component {
    static navigationOptions =
        {title: 'True Or False Question Editor'};

    constructor(props) {
        super(props)
        this.state = {title: '', description: '', points: 0, isTrue: true}
        this.formUpdate = this.formUpdate.bind(this)
    }

    formUpdate(update) {
        this.setState(update)
    }

    render() {
        return (
            <View>
                <FormLabel>Title</FormLabel>
                <FormInput onChangeText={
                    text => this.formUpdate({title: text})}/>
                <FormValidationMessage>
                    Title is required
                </FormValidationMessage>

                <FormLabel>Description</FormLabel>
                <FormInput onChangeText={
                    text => this.formUpdate({description: text})}/>
                <FormValidationMessage>
                    Description is required
                </FormValidationMessage>

                <CheckBox title='The answer is true'
                          onPress={() => this.formUpdate
                          ({isTrue: !this.state.isTrue})}
                          checked={this.state.isTrue}/>
                <Button

                    backgroundColor="green"
                    color="white"
                    title="Save"/>
                <Button
                    backgroundColor="red"
                    color="white"
                    title="Cancel"/>
                <Text h3>Preview</Text>

                <Text h4>{this.state.title}</Text>
                <Text>{this.state.description}</Text>
            </View>
        )
    }
}