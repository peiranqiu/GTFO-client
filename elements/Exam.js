
import React, {Component} from 'react'
import {ScrollView, View} from 'react-native'
import {Button, ListItem, Text, ButtonGroup} from 'react-native-elements'
import {FormLabel, FormValidationMessage, FormInput} from 'react-native-elements'
import QuestionTypeButtonGroupChooser from './QuestionTypeButtonGroupChooser'
import ExamServiceClient from "../services/ExamServiceClient";
import TrueFalseQuestionEditor from "./TrueFalseQuestionEditor";
import MultipleChoiceQuestionEditor from "./MultipleChoiceQuestionEditor";
import FillInTheBlankQuestionEditor from "./FillInTheBlankQuestionEditor";
import EssayQuestionEditor from "./EssayQuestionEditor";
import QuestionServiceClient from "../services/QuestionServiceClient";

export default class Exam extends Component {
    static navigationOptions = {title: 'Exam'};

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.examService = ExamServiceClient.instance;
        this.questionService = QuestionServiceClient.instance;
        this.selectQuestionType = this.selectQuestionType.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.navigationByType = this.navigationByType.bind(this);
        this.chooseIconByType = this.chooseIconByType.bind(this);
        this.chooseSubtitleByType = this.chooseSubtitleByType.bind(this);
        this.createExam = this.createExam.bind(this);
        this.updateExamInEditor = this.updateExamInEditor.bind(this);
        this.deleteExamFromEditor = this.deleteExamFromEditor.bind(this);

        this.state = {
            examId: navigation.getParam("examId"),
            topicId: navigation.getParam("topicId"),
            questions: [],
            selectedQuestionTypeIndex: 0,
            title: '',
            description: ''
        }
    }

    updateForm(newState) {
        this.setState(newState);
    }

    componentDidMount() {
        const {navigation} = this.props;
        const examId = navigation.getParam("examId");
        const topicId = navigation.getParam("topicId");
        const title = navigation.getParam("title");
        const description = navigation.getParam("description")

        if (this.state.examId !== undefined) {
            const topicId = navigation.getParam("topicId");
            const examId = navigation.getParam("examId");
            const title = navigation.getParam("title");
            const description = navigation.getParam("description");
            this.setState({
                topicId: topicId,
                examId: examId,
                title: title,
                description: description
            });
            this.questionService.findAllQuestionsForExam(this.state.examId)
                .then(questions => this.setState({questions: questions}));
        }
    }

    componentWillReceiveProps(newProps) {
        const {navigation} = this.props;
        const examId = navigation.getParam("examId");
        const topicId = navigation.getParam("topicId");
        const title = navigation.getParam("title");
        const description = navigation.getParam("description");

        if (this.state.examId !== undefined) {
            const topicId = navigation.getParam("topicId");
            const examId = navigation.getParam("examId");
            const title = navigation.getParam("title");
            const description = navigation.getParam("description");
            this.setState({
                topicId: topicId,
                examId: examId,
                title: title,
                description: description
            });
            this.questionService.findAllQuestionsForExam(this.state.examId)
                .then(questions => this.setState({questions: questions}));
        }
    }

    refreshFunction(examId) {
        this.questionService.findAllQuestionsForExam(this.state.examId)
            .then(questions => this.setState({questions: questions}));
    }

    componentWillUnmount() {
        this.props.navigation.state.params.refreshFunc(this.state.topicId);
    }

    selectQuestionType = (newQuestionTypeIndex) => {
        this.setState({selectedQuestionTypeIndex: newQuestionTypeIndex});
    };

    addQuestion() {
        switch (this.state.selectedQuestionTypeIndex) {
            case 0:
                this.props.navigation.navigate("MultipleChoiceQuestionEditor", {
                    examId: this.state.examId,
                    refreshFunc: () => this.refreshFunction(this.state.examId)
                });
                return;
            case 1:
                this.props.navigation.navigate("FillInTheBlankQuestionEditor", {
                    examId: this.state.examId,
                    refreshFunc: () => this.refreshFunction(this.state.examId)
                });
                return;
            case 2:
                this.props.navigation.navigate("EssayQuestionEditor", {
                    examId: this.state.examId,
                    refreshFunc: () => this.refreshFunction(this.state.examId)
                });
                return;
            case 3:
                this.props.navigation.navigate("TrueFalseQuestionEditor", {
                    examId: this.state.examId,
                    refreshFunc: () => this.refreshFunction(this.state.examId)
                });
                return;
            default:
                return;
        }
    }

    navigationByType(question) {
        switch (question.questionType) {
            case 'truefalse':
                this.props.navigation.navigate(
                    "TrueFalseQuestionEditor", {
                        examId: this.state.examId,
                        questionId: question.id,
                        title: question.title,
                        points: question.points,
                        description: question.description,
                        isTrue: question.isTrue,
                        refreshFunc: () => this.refreshFunction(this.state.examId)
                    });
                return;
            case 'choice':
                this.props.navigation.navigate(
                    "MultipleChoiceQuestionEditor", {
                        examId: this.state.examId,
                        questionId: question.id,
                        title: question.title,
                        points: question.points,
                        description: question.description,
                        options: question.options,
                        correctOption: question.correctOption,
                        refreshFunc: () => this.refreshFunction(this.state.examId)
                    });
                return;
            case 'blanks':
                this.props.navigation.navigate(
                    "FillInTheBlankQuestionEditor", {
                        examId: this.state.examId,
                        questionId: question.id,
                        title: question.title,
                        points: question.points,
                        description: question.description,
                        variables: question.variables,
                        refreshFunc: () => this.refreshFunction(this.state.examId)
                    });
                return;
            case 'essay':
                this.props.navigation.navigate(
                    "EssayQuestionEditor", {
                        examId: this.state.examId,
                        questionId: question.id,
                        title: question.title,
                        points: question.points,
                        description: question.description,
                        essay: question.essay,
                        refreshFunc: () => this.refreshFunction(this.state.examId)
                    });
                return;
            default:
                return;
        }
    }

    chooseIconByType(question) {
        switch (question.questionType) {
            case 'truefalse':
                return 'check';
            case 'choice':
                return 'list';
            case 'blanks':
                return 'code';
            case 'essay':
                return 'subject';
            default:
                return;
        }
    }

    chooseSubtitleByType(question) {
        switch (question.questionType) {
            case 'truefalse':
                return 'True or false';
            case 'choice':
                return 'Multiple choice';
            case 'blanks':
                return 'Fill in the blanks';
            case 'essay':
                return 'Essay';
            default:
                return;
        }
    }

    createExam(topicId) {
        let newExam = {
            title: this.state.title,
            description: this.state.description
        };
        this.examService.createExamForTopic(topicId, newExam);
        this.props.navigation.goBack();
    }

    updateExamInEditor(examId) {
        let newExam = {
            title: this.state.title,
            description: this.state.description
        };
        this.examService.updateExam(examId, newExam);
        this.props.navigation.goBack();
    }

    deleteExamFromEditor(examId) {
        this.examService.deleteExam(examId);
        this.props.navigation.goBack();
    }

    render() {
        const questionTypes =
            [
                'Multiple Choice',
                'Fill in the Blank',
                'Essay',
                'True or\nFalse'
            ];
        return (
            <ScrollView style={{padding: 10}}>
                <FormLabel>Title</FormLabel>
                {!this.state.preview &&
                <FormInput
                    value={this.state.title}
                    onChangeText={text => this.updateForm({title: text})}/>}
                {!this.state.preview && this.state.title === "" &&
                <FormValidationMessage>Title is required</FormValidationMessage>}
                {this.state.preview && <FormLabel h1> {this.state.title}</FormLabel>}

                <FormLabel>Description</FormLabel>
                {!this.state.preview &&
                <FormInput
                    value={this.state.description}
                    onChangeText={text => this.updateForm({description: text})}/>}
                {!this.state.preview && this.state.description === "" &&
                <FormValidationMessage>Description is required</FormValidationMessage>}

                <Text>{" "}</Text>
                <View style={{marginLeft: 22, marginRight: 22}}>
                    {this.state.questions.map((question, index) => (
                        <ListItem
                            onPress={() => this.navigationByType(question)}
                            key={index}
                            leftIcon={{name: this.chooseIconByType(question)}}
                            subtitle={this.chooseSubtitleByType(question) + " - " + question.points + " pts"}
                            title={question.title}/>
                    ))}
                </View>
                <Text>{" "}</Text>
                {this.state.examId !== undefined &&
                <ButtonGroup
                    onPress={this.selectQuestionType}
                    selectedIndex={this.state.selectedQuestionTypeIndex}
                    buttons={questionTypes}
                    containerStyle={{height: 75}}/>}
                <Text>{" "}</Text>
                {this.state.examId !== undefined &&
                <Button
                    backgroundColor="cornflowerblue"
                    onPress={() => this.addQuestion()}
                    color="white"
                    title="Add Question"/>}
                <Text>{"\n"}</Text><Text>{" "}</Text>

                {this.state.examId !== undefined &&
                <Button
                    onPress={() => this.updateExamInEditor(this.state.examId)}
                    backgroundColor="mediumseagreen"
                    color="white"
                    title="Update"/>}
                {this.state.examId === undefined &&
                <Button backgroundColor="deepskyblue"
                        onPress={() => this.createExam(this.state.topicId)}
                        color="white"
                        title="Save"/>}
                <Text>{" "}</Text>
                {this.state.examId !== undefined &&
                <Button
                    backgroundColor="white"
                    onPress={() => this.deleteExamFromEditor(this.state.examId)}
                    color="red"
                    title="Delete"/>}
                <Text>{"\n"}</Text>
            </ScrollView>
        )
    }
}