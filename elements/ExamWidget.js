import React from 'react';
import {ScrollView} from "react-native";
import {FormLabel, FormInput, FormValidationMessage} from "react-native-elements";
import {Button} from "react-native-elements";
import QuestionTypeButtonGroupChooser from "./QuestionTypeChooser";
import QuestionList from "../components/QuestionList";
import WidgetServiceClient from "../services/WidgetServiceClient";
import QuestionServiceClient from "../services/QuestionServiceClient";


export default class ExamWidget
    extends React.Component {

    static navigationOptions = {title: 'Exam Editor'};

    constructor(props) {
        super(props);

        this.state = {
            lessonId: 0,
            examId: 0,
            title: '',
            description: '',
            questions: []
        };

        this.refresh = this.refresh.bind(this);

        this.widgetServiceClient = WidgetServiceClient.instance();
        this.questionServiceClient = QuestionServiceClient.instance();
    }

    componentDidMount() {
        const lessonId = this.props.navigation.getParam('lessonId', 0);
        const examId = this.props.navigation.getParam('examId', 0);
        const title = this.props.navigation.getParam('title', '');
        const description = this.props.navigation.getParam('description', '');

        this.setState({lessonId: lessonId});
        this.setState({examId: examId});
        this.setState({title: title});
        this.setState({description: description});

        this.questionServiceClient.findAllQuestionsForExam(examId)
            .then((questions) => {
                this.setState({questions: questions});
            })
    }

    componentWillUnmount() {
        this.props.navigation.state.params.onGoBack();
    }

    refresh() {
        this.questionServiceClient.findAllQuestionsForExam(this.state.examId)
            .then((questions) => {
                this.setState({questions: questions});
            })
    }

    render() {
        return (
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

                <QuestionList navigation={this.props.navigation}
                              examId={this.state.examId}
                              questions={this.state.questions}
                              refresh={() => this.refresh()}/>

                <QuestionTypeButtonGroupChooser navigation={this.props.navigation}
                                                refresh={() => this.refresh()}/>

                <Button backgroundColor='#4c73c4'
                        title='Save Exam'
                        onPress={() => {
                            let exam = {
                                'title': this.state.title,
                                'description': this.state.description,
                            };

                            this.widgetServiceClient.updateExam(this.state.examId, exam)
                                .then(() => {
                                    this.props.navigation.navigate('WidgetList', {lessonId: this.state.lessonId});
                                })
                        }}
                        buttonStyle={{
                            width: 330,
                            height: 40,
                            marginTop: 2,
                            margin: 10,
                        }}/>
                <Button backgroundColor='#4682B4'
                        title='Cancel'
                        onPress={() => {
                            this.props.navigation.navigate('WidgetList', {lessonId: this.state.lessonId});
                        }}
                        buttonStyle={{
                            width: 330,
                            height: 40,
                            marginTop: 1, margin: 10,
                        }}/>
                <Button backgroundColor='#FA8072'
                        title='Delete Exam'
                        onPress={() => {
                            this.widgetServiceClient.deleteExam(this.state.examId)
                                .then(() => {
                                    this.props.navigation.navigate('WidgetList', {lessonId: this.state.lessonId})
                                })
                        }}
                        buttonStyle={{
                            width: 330,
                            height: 40,
                            marginTop: 1,
                            margin: 10,
                        }}/>
            </ScrollView>
        );
    }
}