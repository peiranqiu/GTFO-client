import React from 'react';
import {ScrollView, StyleSheet, TextInput, View} from 'react-native';
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import {Button, Text} from 'react-native-elements';
import QuestionServiceClient from "../services/QuestionServiceClient";


export default class EssayQuestionEditor
    extends React.Component {

    static navigationOptions = {title: 'Fill In Blank'};

    constructor(props) {
        super(props);

        this.state = {
            examId: 0,
            questionId: 0,
            title: '',
            description: '',
            variables: '',
            points: 0,
            previewMode: false,
            icon: 'code'
        };

        this.questionServiceClient = QuestionServiceClient.instance();
    }

    componentDidMount() {
        const examId = this.props.navigation.getParam('examId', 0);
        const questionId = this.props.navigation.getParam('questionId', 0);
        const title = this.props.navigation.getParam('title', '');
        const description = this.props.navigation.getParam('description', '');
        const points = this.props.navigation.getParam('points', 0);
        const variables = this.props.navigation.getParam('variables', '');

        this.setState({questionId: questionId});
        this.setState({examId: examId});
        this.setState({title: title});
        this.setState({description: description});
        this.setState({points: points});
        this.setState({variables: variables});
    }

    componentWillUnmount() {
        this.props.navigation.state.params.onGoBack();
    }

    render() {
        const texts = this.state.variables.split('\n');

        return (
            <ScrollView>
                {!this.state.previewMode &&
                <ScrollView>
                    <FormLabel>Title</FormLabel>
                    <FormInput onChangeText={(text) => this.setState({title: text})}>
                        {this.state.title}
                    </FormInput>
                    <FormValidationMessage>
                        {this.state.title === '' && 'Title is required'}
                        {this.state.title !== '' && ''}
                    </FormValidationMessage>

                    <FormLabel>Description</FormLabel>
                    <FormInput onChangeText={(text) => this.setState({description: text})}>
                        {this.state.description}
                    </FormInput>
                    <FormValidationMessage>
                        {this.state.description === '' && 'Description is required'}
                        {this.state.description !== '' && ''}
                    </FormValidationMessage>

                    <FormLabel>Variables e.g.(1+1=[two=2])</FormLabel>
                    <TextInput style={styles.textAreaContainer}
                               multiline={true}
                               onChangeText={(text) => this.setState({variables: text})}>
                        {this.state.variables}
                    </TextInput>
                    <FormValidationMessage>
                        {this.state.variables === '' && 'Variables are required'}
                        {this.state.variables !== '' && ''}
                    </FormValidationMessage>

                    <FormLabel>Points</FormLabel>
                    <FormInput onChangeText={(text) => this.setState({points: text.valueOf()})}>
                        {this.state.points}
                    </FormInput>
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
                                        'variables': this.state.variables,
                                        'questionType': 'FillInBlank',
                                        'icon': this.state.icon
                                    };

                                    this.questionServiceClient.createFillInBlanksQuestion(this.state.examId, question)
                                        .then(this.props.navigation.navigate('ExamWidget', {examId: this.state.examId}));
                                }
                                else {
                                    let question = {
                                        'title': this.state.title,
                                        'description': this.state.description,
                                        'points': this.state.points,
                                        'variables': this.state.variables
                                    };

                                    this.questionServiceClient.updateFillInBlanksQuestion(this.state.questionId, question)
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
                                this.questionServiceClient.deleteFillInBlanksQuestion(this.state.questionId)
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
                <ScrollView style={styles.textAreaContainer}>
                    <Text h4>{this.state.description}</Text>
                    <Text h5>{this.state.points} pts</Text>
                    {texts.map((text, index) => (
                        parseBlank(text, index)
                    ))}
                </ScrollView>}
            </ScrollView>
        );
    }
}

const parseBlank = (text, index) => {
    let open = 0;
    let previousClose = -1;
    let close = 0;
    let expressions = [];

    while (text.indexOf('[', previousClose + 1) !== -1) {
        open = text.indexOf('[', previousClose + 1);
        close = text.indexOf(']', open);
        if (open === 0) {
            expressions.push('[]');
        }
        else {
            expressions.push(text.substring(previousClose + 1, open));
            expressions.push('[]');
        }
        previousClose = close;
    }
    if (close !== text.length - 1) {

        expressions.push(text.substring(close + 1, text.length));
    }

    return (
        <View style={styles.row} key={index}>
            {expressions.map((expression, index) => {
                if (expression === '[]') {
                    return (<TextInput key={index}
                                       style={styles.input}/>);
                }
                else {
                    return (<Text h4 key={index}>{expression}</Text>);
                }
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row"
    },
    textAreaContainer: {
        borderColor: 'lightgrey',
        borderWidth: 1,
        padding: 5,
        margin: 10
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start"
    },
    input: {
        height: 40,
        width: 80,
        borderColor: 'black',
        borderWidth: 1
    },
});