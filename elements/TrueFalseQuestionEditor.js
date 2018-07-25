import React from 'react'
import {View} from 'react-native'
import {Text, Button, CheckBox} from 'react-native-elements'
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements'
import QuestionServiceClient from '../services/QuestionServiceClient'

class TrueFalseQuestionEditor extends React.Component {
    static navigationOptions = {title: "True or False"}
    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.questionService = QuestionServiceClient.instance;
        this.createTrueFalseQuestion = this.createTrueFalseQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.updateTrueFalseQuestion = this.updateTrueFalseQuestion.bind(this);
        this.state = {
            examId: navigation.getParam("examId"),
            questionID: navigation.getParam("questionId"),
            title: '',
            description: '',
            points: 0,
            isTrue: true,
            preview:false
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
            const isTrue = navigation.getParam("isTrue");
            this.setState({
                questionId: questionID,
                examId: examId,
                title: title,
                description: description,
                points: points,
                isTrue: isTrue
            });
        }
    }

    updateForm(newState) {
        this.setState(newState)
    }

    componentWillUnmount() {
        this.props.navigation.state.params.refreshFunc(this.state.examId);
    }

    pointsTextOnChanged(text){
        let newText = '';
        let numbers = '0123456789';

        for (var i=0; i < text.length; i++) {
            if(numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
        }
        this.setState({ points: newText });
    }

    createTrueFalseQuestion(examId) {
        let newTrueFalseQuestion = {
            title: this.state.title,
            points: this.state.points,
            description: this.state.description,
            isTrue: this.state.isTrue,
            questionType: 'truefalse'
        };
        this.questionService.createTrueFalseQuestionForExam(examId, newTrueFalseQuestion);
        this.props.navigation.goBack();
    }

    updateTrueFalseQuestion(questionId) {
        let newTrueFalseQuestion = {
            title: this.state.title,
            points: this.state.points,
            description: this.state.description,
            isTrue: this.state.isTrue
        };
        this.questionService.updateTrueFalseQuestionForExam(
            this.state.examId, questionId, newTrueFalseQuestion);
        this.props.navigation.goBack();
    }

    deleteQuestion() {
        this.questionService.deleteQuestionById(this.state.questionID);
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View>
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
                    onChangeText={(text)=> this.pointsTextOnChanged(text)}
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
                <CheckBox
                    onPress={() => this.updateForm({isTrue: !this.state.isTrue})}
                    checked={this.state.isTrue}
                    title='The answer is true'/>}
                {this.state.preview && this.state.isTrue && <FormLabel h1>{"True"}</FormLabel>}
                {this.state.preview && !this.state.isTrue && <FormLabel h1>{"False"}</FormLabel>}

                <Text>{"\n"}</Text>
                <Button
                    backgroundColor="cornflowerblue"
                    onPress={() => this.setState({preview:!this.state.preview})}
                    color="white"
                    title="Preview"/>
                <Text>{" "}</Text>
                {this.state.questionId !== undefined &&
                <Button
                    onPress={() => this.updateTrueFalseQuestion(this.state.questionID)}
                    backgroundColor="mediumseagreen"
                    color="white"
                    title="Update"/>}
                {this.state.questionId === undefined &&
                <Button
                    onPress={() => this.createTrueFalseQuestion(this.state.examId)}
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
            </View>
        )
    }
}

export default TrueFalseQuestionEditor