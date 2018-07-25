import React from 'react';
import {ScrollView, TextInput} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import {Button, Text} from 'react-native-elements';
import QuestionServiceClient from "../services/QuestionServiceClient";


export default class EssayQuestionEditor
    extends React.Component {

    static navigationOptions = {title: 'Essay'};

    constructor(props) {
        super(props);

        this.state = {
            questionId: 0,
            title: '',
            description: '',
            points: 0,
            examId: 0,
            previewMode: false,
            icon: 'subject'
        };

        this.questionServiceClient = QuestionServiceClient.instance();
    }

    componentDidMount() {
        const examId = this.props.navigation.getParam('examId', 0);
        const questionId = this.props.navigation.getParam('questionId', 0);
        const title = this.props.navigation.getParam('title', '');
        const description = this.props.navigation.getParam('description', '');
        const points = this.props.navigation.getParam('points', 0);

        this.setState({questionId: questionId});
        this.setState({examId: examId});
        this.setState({title: title});
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
                    <FormInput onChangeText={(text) =>
                        this.setState({title: text})}>{this.state.title}</FormInput>
                    <FormValidationMessage>
                        {this.state.title === '' && 'Title is required'}
                        {this.state.title !== '' && ''}
                    </FormValidationMessage>

                    <FormLabel>Description</FormLabel>
                    <FormInput
                        onChangeText={(text) =>
                            this.setState({description: text})}>{this.state.description}</FormInput>
                    <FormValidationMessage>
                        {this.state.description === '' && 'Description is required'}
                        {this.state.description !== '' && ''}
                    </FormValidationMessage>

                    <FormLabel>Points</FormLabel>
                    <FormInput
                        onChangeText={(text) =>
                            this.setState({points: text.valueOf()})}>{this.state.points}</FormInput>
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
                            color='white'
                            title='Save'
                            onPress={() => {
                                if (this.state.questionId === 0) {
                                    let question = {
                                        'title': this.state.title,
                                        'description': this.state.description,
                                        'points': this.state.points,
                                        'questionType': 'Essay',
                                        'icon': this.state.icon
                                    };

                                    this.questionServiceClient.createEssayQuestion(this.state.examId, question)
                                        .then(this.props.navigation.navigate('ExamWidget', {examId: this.state.examId}));
                                }
                                else {
                                    let question = {
                                        'title': this.state.title,
                                        'description': this.state.description,
                                        'points': this.state.points,
                                    };

                                    this.questionServiceClient.updateEssayQuestion(this.state.questionId, question)
                                        .then(this.props.navigation.navigate('ExamWidget', {examId: this.state.examId}));
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
                    {this.state.questionId !== 0 &&
                    <Button backgroundColor='#FA8072'
                            color='white'
                            title='Delete'
                            onPress={() => {
                                this.questionServiceClient.deleteEssayQuestion(this.state.questionId)
                                    .then(this.props.navigation.navigate('ExamWidget', {examId: this.state.examId}));
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
                <ScrollView style={{borderColor: 'lightgrey',borderWidth: 1,padding: 5,margin: 10}}>
                    <Text h4>{this.state.description}</Text>
                    <Text h5>{this.state.points} pts</Text>
                    <TextInput
                        style={{height: 150,justifyContent: "flex-start"}}
                        placeholder={"Type your answer here."}
                        placeholderTextColor={"grey"}
                        numberOfLines={10}
                        multiline={true}/>
                </ScrollView>}
            </ScrollView>
        );
    }
}