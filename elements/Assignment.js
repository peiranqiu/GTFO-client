
import React, {Component} from 'react'
import {View} from 'react-native'
import {Divider, Button, Text, FormLabel} from 'react-native-elements'
import {FormInput, FormValidationMessage} from 'react-native-elements'
import {ScrollView, TextInput} from 'react-native'
import AssignmentServiceClient from '../services/AssignmentServiceClient'
import ExamServiceClient from "../services/ExamServiceClient";

class Assignment extends Component {
    static navigationOptions = {title: 'Assignment'};

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.assignmentService = AssignmentServiceClient.instance;
        this.examService = ExamServiceClient.instance;
        this.createAssignmentForTopic = this.createAssignmentForTopic.bind(this);
        this.deleteAssignmentFromEditor = this.deleteAssignmentFromEditor.bind(this);
        this.updateAssignment = this.updateAssignment.bind(this);
        this.state = {
            points: 0,
            title: "",
            description: "",
            preview: false,
            assignmentId: navigation.getParam("assignmentId"),
            topicId: navigation.getParam("topicId")

        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        if (this.state.assignmentId !== undefined) {
            const topicId = navigation.getParam("topicId");
            const assignmentId = navigation.getParam("assignmentId");
            const title = navigation.getParam("title");
            const points = navigation.getParam("points");
            const description = navigation.getParam("description");
            this.setState({
                topicId: topicId,
                assignmentId: assignmentId,
                title: title,
                description: description,
                points: points,
            });
        }
    }

    componentWillUnmount() {
        this.props.navigation.state.params.refreshFunc(this.state.topicId);
    }

    pointsTextOnChanged(text) {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                alert("please enter numbers only");
            }
        }
        this.setState({points: newText});
    }

    updateForm(newState) {
        this.setState(newState);
    }

    updateAssignment(assignmentId) {
        let newAssignment = {
            title: this.state.title,
            points: this.state.points,
            description: this.state.description
        };
        this.assignmentService.updateAssignmentForTopic(
            assignmentId, this.state.topicId, newAssignment);
        this.props.navigation.goBack();
    }

    createAssignmentForTopic(topicId) {
        let newAssignment = {
            title: this.state.title,
            points: this.state.points,
            description: this.state.description
        };
        this.assignmentService.createAssignmentForTopic(topicId, newAssignment);
        this.props.navigation.goBack();
    }

    deleteAssignmentFromEditor() {
        this.assignmentService.deleteAssignment(this.state.assignmentId);
        this.props.navigation.goBack();
    }

    render() {
        const parameter = this.props.navigation.getParam('parameter', 'Assignment title');
        return (
            <View>
                <FormLabel>Title</FormLabel>
                {!this.state.preview &&
                <FormInput
                    value={this.state.title}
                    onChangeText={text => {
                        this.updateForm({title: text})
                    }}/>}
                {!this.state.preview && this.state.title === "" &&
                <FormValidationMessage>Title is required</FormValidationMessage>}
                {this.state.preview && <FormLabel h1> {this.state.title}</FormLabel>}

                <FormLabel>Points</FormLabel>
                {!this.state.preview &&
                <FormInput
                    value={this.state.points.toString()}
                    keyboardType='numeric'
                    onChangeText={(text) => this.pointsTextOnChanged(text)}
                    maxLength={2}/>}
                {!this.state.preview && this.state.points === 0 &&
                <FormValidationMessage>Points is required</FormValidationMessage>}
                {this.state.preview && <FormLabel h1> {this.state.points}</FormLabel>}

                <FormLabel>Description</FormLabel>
                {!this.state.preview &&
                <FormInput
                    value={this.state.description}
                    onChangeText={text => this.updateForm({description: text})}/>}
                {!this.state.preview && this.state.description === "" &&
                <FormValidationMessage>Description is required</FormValidationMessage>}
                {this.state.preview && <FormLabel h1> {this.state.description}</FormLabel>}

                {this.state.preview && <FormLabel>Upload a file</FormLabel>}
                {this.state.preview &&
                <Button
                    style={{
                        borderColor: 'gray',
                        borderWidth: 1,
                        padding: 7,
                        marginTop: 5,
                        marginLeft: 20,
                        marginRight: 40,
                        marginBottom: 5,
                        backgroundColor: "white",
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'}}>
                    choose</Button>}

                {this.state.preview && <FormLabel>Submit a link</FormLabel>}
                {this.state.preview &&
                <TextInput
                    value={this.state.essay}
                    multiline={true}
                    style={{
                        // height: 100,
                        borderColor: 'gray',
                        borderWidth: 1,
                        padding: 7,
                        marginTop: 5,
                        marginLeft: 20,
                        marginRight: 40,
                        marginBottom: 5,
                        backgroundColor: "white",
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}/>}

                <Text>{"\n"}</Text>
                <Button backgroundColor="cornflowerblue"
                        onPress={() => this.setState({preview: !this.state.preview})}
                        color="white"
                        title="Preview"/>
                <Text>{" "}</Text>
                {this.state.assignmentId !== undefined &&
                <Button
                    onPress={() => this.updateAssignment(this.state.assignmentId)}
                    backgroundColor="mediumseagreen"
                    color="white"
                    title="Update"/>}
                {this.state.assignmentId === undefined &&
                <Button backgroundColor="deepskyblue"
                        onPress={() => this.createAssignmentForTopic(this.state.topicId)}
                        color="white"
                        title="Save"/>}
                <Text>{"\n"}</Text><Text>{"\n"}</Text>
                {this.state.assignmentId !== undefined &&
                <Button
                    backgroundColor="white"
                    onPress={() => this.deleteAssignmentFromEditor()}
                    color="red"
                    title="Delete"/>}
            </View>
        )
    }
}

export default Assignment