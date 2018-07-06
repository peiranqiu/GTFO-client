import React from 'react';
import {ScrollView, StyleSheet, TextInput} from "react-native";
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import {Button, Text} from 'react-native-elements';
import WidgetServiceClient from "../services/WidgetServiceClient";


export default class AssignmentWidget
    extends React.Component {

    static navigationOptions = {title: 'Assignment Editor'};

    constructor(props) {
        super(props);

        this.state = {
            assignmentId: 0,
            lessonId: 0,
            title: '',
            description: '',
            points: 0,
            widget: {},
            previewMode: false
        };

        this.widgetServiceClient = WidgetServiceClient.instance();
    }

    componentDidMount() {
        let lessonId = this.props.navigation.getParam('lessonId', 0);
        const assignmentId = this.props.navigation.getParam('assignmentId', 0);
        const title = this.props.navigation.getParam('title', '');
        const description = this.props.navigation.getParam('description', '');
        const points = this.props.navigation.getParam('points', 0);

        this.setState({lessonId: lessonId});
        this.setState({title: title});
        this.setState({assignmentId: assignmentId});
        this.setState({description: description});
        this.setState({points: points});
    }

    componentWillUnmount() {
        this.props.navigation.state.params.onGoBack();
    }

    render() {
        return (
            <ScrollView>
                {!this.state.previewMode &&
                <ScrollView>
                    <FormLabel>Title</FormLabel>
                    <FormInput onChangeText={(text) => {
                        this.setState({title: text});
                    }}>{this.state.title}</FormInput>
                    <FormValidationMessage>
                        {this.state.title === '' && 'Title is required'}
                        {this.state.title !== '' && ''}
                    </FormValidationMessage>

                    <FormLabel>Description</FormLabel>
                    <FormInput onChangeText={(text) => {
                        this.setState({description: text});
                    }}>{this.state.description}</FormInput>
                    <FormValidationMessage>
                        {this.state.description === '' && 'Description is required'}
                        {this.state.description !== '' && ''}
                    </FormValidationMessage>

                    <FormLabel>Points</FormLabel>
                    <FormInput onChangeText={(text) => {
                        this.setState({points: text.valueOf()});
                    }}>{this.state.points}</FormInput>
                    <FormValidationMessage>
                        {this.state.points === 0 && 'Points is required'}
                        {this.state.points !== 0 && ''}
                    </FormValidationMessage>

                    <Button buttonStyle={{
                        width: 330,
                        height: 40,
                        marginTop: 1,
                        margin: 10,
                    }}
                            backgroundColor='#4c73c4'
                            title='Save Assignment'
                            onPress={() => {
                                if (this.state.assignmentId === 0) {
                                    let assignment = {
                                        'title': this.state.title,
                                        'description': this.state.description,
                                        'points': this.state.points,
                                        'widgetType': 'Assignment'
                                    };

                                    this.widgetServiceClient.createAssignment(this.state.lessonId, assignment)
                                    // .then(this.props.navigation.navigate('LessonList'));
                                        .then(this.props.navigation.navigate('WidgetList', {lessonId: this.state.lessonId}));
                                }
                                if (this.state.assignmentId !== 0) {
                                    let assignment = {
                                        'title': this.state.title,
                                        'description': this.state.description,
                                        'points': this.state.points,
                                        'widgetType': 'Assignment'
                                    };

                                    this.widgetServiceClient.updateAssignment(this.state.assignmentId, assignment)
                                        .then(this.props.navigation.navigate('WidgetList', {lessonId: this.state.lessonId}));
                                    // .then(this.props.navigation.navigate('LessonList'));
                                }
                            }}/>
                    <Button backgroundColor='#4682B4'
                            color='white'
                            title='Cancel'
                            onPress={() => {
                                this.props.navigation.goBack()
                            }}
                            buttonStyle={{
                                width: 330,
                                height: 40,
                                marginTop: 1,
                                margin: 10,
                            }}/>
                    {this.state.assignmentId !== 0 &&
                    <Button backgroundColor='#FA8072'
                            title='Delete Assignment'
                            onPress={() => {
                                this.widgetServiceClient.deleteAssignment(this.state.assignmentId)
                                    .then(this.props.navigation.navigate('WidgetList', {lessonId: this.state.lessonId}));
                            }}
                            buttonStyle={{
                                width: 330,
                                height: 40,
                                marginTop: 1,
                                margin: 10,
                            }}/>}
                </ScrollView>}

                <Button title="Preview"
                        onPress={() => {
                            this.setState({previewMode: !this.state.previewMode})
                        }}
                        buttonStyle={{
                            width: 330,
                            height: 40,
                            marginTop: 1,
                            margin: 10,
                        }}/>

                {this.state.previewMode &&
                <ScrollView style={styles.textAreaContainer}>
                    <Text h4>{this.state.title}</Text>
                    <Text h5>{this.state.description}</Text>
                    <Text h5>{this.state.points} pts</Text>
                    <Text h4>Essay answer</Text>
                    <TextInput style={styles.textAreaContainer}
                               multiline={true}/>
                    <Text h4>Upload a file
                        <Button color='black'
                                buttonStyle={{
                                    backgroundColor: "lightgrey",
                                    width: 120,
                                    height: 40,
                                    borderColor: "transparent",
                                    borderWidth: 0,
                                    borderRadius: 5,
                                }}
                                title='Choose File'/>
                    </Text>
                    <TextInput style={styles.textAreaContainer}>
                        No file chosen
                    </TextInput>
                    <Text h4>Submit a link</Text>
                    <TextInput style={styles.textAreaContainer}/>
                </ScrollView>}
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    textAreaContainer: {
        borderColor: 'grey',
        borderWidth: 1,
        padding: 5
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start"
    }
});