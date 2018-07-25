import React from 'react'
import {View, TextInput} from 'react-native'
import {Text, Button, CheckBox} from 'react-native-elements'
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements'
import QuestionServiceClient from '../services/QuestionService'

class EssayQuestionEditor extends React.Component {
    static navigationOptions = {title: "Essay"};

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.questionService = QuestionServiceClient.instance;
        this.createEssayQuestionInEditor = this.createEssayQuestionInEditor.bind(this);
        this.updateEssayQuestion = this.updateEssayQuestion.bind(this);
        this.state = {
            examId: navigation.getParam("examId"),
            questionID: navigation.getParam("questionId"),
            title: '',
            description: '',
            points: 0,
            essay: '',
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
            const essay = navigation.getParam("essay");
            this.setState({
                questionId: questionID,
                examId: examId,
                title: title,
                description: description,
                points: points,
                essay: essay
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

    deleteQuestion() {
        this.questionService.deleteQuestionById(this.state.questionID);
        this.props.navigation.goBack();
    }

    updateEssayQuestion(questionId) {
        let newEssayQuestion = {
            title: this.state.title,
            points: this.state.points,
            description: this.state.description,
            essay: this.state.essay
        };
        this.questionService.updateEssayQuestionForExam(
            this.state.examId, questionId, newEssayQuestion);
        this.props.navigation.goBack();
    }

    createEssayQuestionInEditor(examId) {
        let newEssayQuestion = {
            title: this.state.title,
            points: this.state.points,
            description: this.state.description,
            essay: this.state.essay,
            questionType: 'essay'
        };
        this.questionService.createEssayQuestion(examId, newEssayQuestion);
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
                {this.state.preview && <Text>{" "}</Text>}
                {this.state.preview &&
                <TextInput
                    value={this.state.essay}
                    multiline={true}
                    style={{
                        height: 100,
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
                <Button
                    backgroundColor="cornflowerblue"
                    onPress={() => this.setState({preview: !this.state.preview})}
                    color="white"
                    title="Preview"/>
                <Text>{" "}</Text>
                {this.state.questionId !== undefined &&
                <Button
                    onPress={() => this.updateEssayQuestion(this.state.questionID)}
                    backgroundColor="mediumseagreen"
                    color="white"
                    title="Update"/>}
                {this.state.questionId === undefined &&
                <Button
                    onPress={() => this.createEssayQuestionInEditor(this.state.examId)}
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

export default EssayQuestionEditor