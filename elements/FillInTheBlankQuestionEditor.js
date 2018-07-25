import React from 'react'
import {ScrollView, View, TextInput} from 'react-native'
import {Text, Button, CheckBox} from 'react-native-elements'
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements'
import QuestionServiceClient from "../services/QuestionService"

export default class FillInTheBlankQuestionEditor
    extends React.Component {
    static navigationOptions = {title: "Fill in the Blank"};

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.questionService = QuestionServiceClient.instance;
        this.createFillInTheBlankQuestionInEditor = this.createFillInTheBlankQuestionInEditor.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.updateFillInTheBlankQuestion = this.updateFillInTheBlankQuestion.bind(this);
        this.state = {
            examId: navigation.getParam("examId"),
            questionID: navigation.getParam("questionId"),
            title: '',
            description: '',
            points: 0,
            variables: '',
            preview: false
        }
    }

    componentDidMount() {
        if (this.state.questionID !== undefined) {
            const {navigation} = this.props;
            const examId = navigation.getParam("examId");
            const questionID = navigation.getParam("questionId");
            const title = navigation.getParam("title");
            const points = navigation.getParam("points");
            const description = navigation.getParam("description");
            const variables = navigation.getParam("variables");
            this.setState({
                questionId: questionID,
                examId: examId,
                title: title,
                description: description,
                points: points,
                variables: variables
            });
        }
    }

    componentWillUnmount() {
        this.props.navigation.state.params.refreshFunc(this.state.examId);
    }

    updateForm(newState) {
        this.setState(newState)
    }

    pointsTextOnChanged(text) {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
        }
        this.setState({points: newText});
    }

    createFillInTheBlankQuestionInEditor(examId) {
        let newFillInTheBlankQuestion = {
            title: this.state.title,
            points: this.state.points,
            description: this.state.description,
            variables: this.state.variables,
            questionType: 'blanks'
        };
        this.questionService.createFillInTheBlankQuestion(examId, newFillInTheBlankQuestion);
        this.props.navigation.goBack();
    }

    updateFillInTheBlankQuestion(questionId) {
        let newFillInTheBlankQuestion = {
            title: this.state.title,
            points: this.state.points,
            description: this.state.description,
            variables: this.state.variables
        };
        this.questionService.updateFillInTheBlankQuestionForExam(
            this.state.examId, questionId, newFillInTheBlankQuestion);
        this.props.navigation.goBack();
    }

    deleteQuestion() {
        this.questionService.deleteQuestionById(this.state.questionID);
        this.props.navigation.goBack();
    }

    renderVairables(variables) {
        let parts = variables.split(/[[\]]{1,2}/);
        parts.length--;
        let res = [];
        for (var i = 0; i < parts.length - 1; i += 2) {
            res[i / 2] =
                <View key={i / 2} style={{padding: 10}}>
                    <Text h3
                          className="match"
                          key={i}
                          style={{
                              padding: 7
                          }}>
                        {parts[i]}
                    </Text>
                    <TextInput
                        style={{
                            fontSize: 30,
                            flex: 1,
                            borderColor: 'gray',
                            borderWidth: 1,
                            marginRight: 40,
                            backgroundColor: "white",
                            justifyContent: 'space-between'
                        }}
                        className="match" key={i + 1}/>
                </View>
        }
        return (
            res
        );
    }

    render() {
        return (
            <ScrollView>
                <FormLabel>Title</FormLabel>
                {!this.state.preview &&
                <FormInput
                    value={this.state.title}
                    onChangeText={text => this.updateForm({title: text})}/>}
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

                {!this.state.preview &&
                <FormLabel>Question Body, "e.g. 1+1=[2]"</FormLabel>}
                {this.state.preview && <Text>{"\n"}</Text>}
                {!this.state.preview &&
                <FormInput
                    value={this.state.variables}
                    onChangeText={text => this.updateForm({variables: text})}/>}
                {!this.state.preview && this.state.variables === "" &&
                <FormValidationMessage>Question Body is required</FormValidationMessage>}


                {this.state.preview && this.renderVairables(this.state.variables)}
                {this.state.preview && <Text>{" "}</Text>}


                <Text>{"\n"}</Text>
                <Button
                    backgroundColor="cornflowerblue"
                    onPress={() => this.setState({preview: !this.state.preview})}
                    color="white"
                    title="Preview"/>
                <Text>{" "}</Text>
                {this.state.questionId !== undefined &&
                <Button
                    onPress={() => this.updateFillInTheBlankQuestion(this.state.questionID)}
                    backgroundColor="mediumseagreen"
                    color="white"
                    title="Update"/>}
                {this.state.questionId === undefined &&
                <Button
                    onPress={() => this.createFillInTheBlankQuestionInEditor(this.state.examId)}
                    backgroundColor="deepskyblue"
                    color="white"
                    title="Save"/>}
                <Text>{"\n"}</Text><Text>{"\n"}</Text>
                {this.state.questionId !== undefined &&
                <Button
                    backgroundColor="white"
                    onPress={() => this.deleteQuestion()}
                    color="red"
                    title="Delete"/>}
            </ScrollView>
        )
    }
}