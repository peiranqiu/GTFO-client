import React from 'react';
import {ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import {FormLabel, FormInput, FormValidationMessage} from 'react-native-elements';
import ExamServiceClient from "../services/ExamServiceClient";


export default class AddExamComponent
    extends React.Component {

    static navigationOptions = {title: 'Create Exam'};

    constructor(props) {
        super(props);

        this.state = {
            lessonId: 0,
            title: '',
            description: ''
        };

        this.widgetServiceClient = ExamServiceClient.instance();
    }

    componentDidMount() {
        const lessonId = this.props.navigation.getParam('lessonId', 0);

        this.setState({lessonId: lessonId});
    }

    componentWillUnmount() {
        this.props.navigation.state.params.onGoBack();
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

                <Button backgroundColor="#4c73c4"
                        title="Create Exam"
                        onPress={() => {
                            let exam = {
                                'title': this.state.title,
                                'description': this.state.description,
                                // 'points': this.state.points,
                                'widgetType': 'Exam'
                            };

                            this.widgetServiceClient.createExam(this.state.lessonId, exam)
                                .then((exam) => {
                                    this.props.navigation.navigate('WidgetList', {
                                        lessonId: this.state.lessonId,
                                        onGoBack: () => this.props.navigation.state.params.onGoBack
                                    })
                                });
                        }}
                        buttonStyle={{
                            width: 330,
                            height: 40,
                            marginTop: 1,
                            margin: 10,}}/>
                <Button backgroundColor="#4682B4"
                        title="Cancel"
                        onPress={() => {
                            this.props.navigation.goBack()}}
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