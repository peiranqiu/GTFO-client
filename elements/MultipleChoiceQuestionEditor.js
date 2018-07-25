import React from 'react'
import {View, ScrollView} from 'react-native'
import {Text, Button, CheckBox} from 'react-native-elements'
import {FormLabel, FormInput, FormValidationMessage}
    from 'react-native-elements'
import QuestionServiceClient from "../services/QuestionServiceClient"
import CustomMultiPicker from "react-native-multiple-select-list"

class MultipleChoiceQuestionEditor extends React.Component {
    static navigationOptions = {title: "Multiple Choice"}

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.questionService = QuestionServiceClient.instance;
        this.createMultipleChoiceQuestion = this.createMultipleChoiceQuestion.bind(this);
        this.updateMultipleChoiceQuestion = this.updateMultipleChoiceQuestion.bind(this);
        this.renderChoices = this.renderChoices.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);

        var choices = navigation.getParam("options");
        this.state = {
            examId: navigation.getParam("examId"),
            questionID: navigation.getParam("questionId"),
            title: '',
            description: '',
            points: 0,
            options: navigation.getParam("options") === undefined ? "" : navigation.getParam("options"),
            correctOption: navigation.getParam("correctOption"),
            userList: this.renderChoices(choices)
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
            const options = navigation.getParam("options");
            const correctOption = navigation.getParam("correctOption");
            const userList = Object.assign({}, this.renderChoices(options));

            this.setState({
                questionId: questionID,
                examId: examId,
                title: title,
                description: description,
                points: points,
                correctOption: correctOption,
                options: options,
                userList: Object.assign({},userList)
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

    updateMultipleChoiceQuestion(questionId) {
        let newMultipleChoiceQuestion = {
            title: this.state.title,
            points: this.state.points,
            description: this.state.description,
            options: this.state.options,
            correctOption: this.state.correctOption
        };
        this.questionService.updateMultipleChoiceQuestionForExam(
            this.state.examId, questionId, newMultipleChoiceQuestion);
        this.props.navigation.goBack();
    }


    createMultipleChoiceQuestion(examId) {
        let newMultipleChoiceQuestion = {
            title: this.state.title,
            points: this.state.points,
            description: this.state.description,
            options: this.state.options,
            correctOption: this.state.correctOption,
            questionType: 'choice'
        };
        this.questionService.createMultipleChoiceQuestionForExam(examId, newMultipleChoiceQuestion);
        this.props.navigation.goBack();
    }

    deleteQuestion() {
        this.questionService.deleteQuestionById(this.state.questionID);
        this.props.navigation.goBack();
    }


    renderChoices(choices) {
        if (choices === undefined || choices === '') return {};
        let res = {}; // create an empty array
        let choicesSpliced = choices.split(',');
        for (var i = 0; i < choicesSpliced.length; i++) {
            res[i] = choicesSpliced[i];
        }
        return res;
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

                <FormLabel>Choices{!this.state.preview && ", e.g. \'choice1, choice2, choice3\'"}</FormLabel>
                {!this.state.preview &&
                <FormInput
                    value={this.state.options}
                    onChangeText={text => this.updateForm({options: text})}/>}
                {!this.state.preview && this.state.options === "" &&
                <FormValidationMessage>Description is required</FormValidationMessage>}
                <CustomMultiPicker
                    options={this.renderChoices(this.state.options)}
                    placeholderTextColor={'#757575'}
                    returnValue={"label"} // label or value
                    callback={(res) => this.setState({
                        correctOption: (this.state.options.split(',')).indexOf(res.toString())
                    })}
                    rowHeight={40}
                    iconColor={"#00a2dd"}
                    iconSize={25}
                    selectedIconName={"ios-checkmark-circle-outline"}
                    unselectedIconName={"ios-radio-button-off-outline"}
                    selected={this.state.userList[this.state.correctOption]}
                />

                <Text>{"\n"}</Text>
                <Button
                    backgroundColor="cornflowerblue"
                    onPress={() => this.setState({preview: !this.state.preview})}
                    color="white"
                    title="Preview"/>
                <Text>{" "}</Text>
                {this.state.questionId !== undefined &&
                <Button
                    onPress={() => this.updateMultipleChoiceQuestion(this.state.questionID)}
                    backgroundColor="mediumseagreen"
                    color="white"
                    title="Update"/>}
                {this.state.questionId === undefined &&
                <Button
                    onPress={() => this.createMultipleChoiceQuestion(this.state.examId)}
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

export default MultipleChoiceQuestionEditor