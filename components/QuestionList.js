import React from 'react';
import {ScrollView} from 'react-native';
import {ListItem} from 'react-native-elements';
import QuestionServiceClient from "../services/QuestionServiceClient";

export default class QuestionList
    extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            examId: 0,
            questions: []
        };
        this.questionServiceClient = QuestionServiceClient.instance();
    }

    componentDidMount() {
        this.setState({examId: this.props.examId});
        this.setState({questions: this.props.questions});
    }

    componentWillReceiveProps(newProps) {
        this.setState({examId: newProps.examId});
        this.setState({questions: newProps.questions});
    }

    hardRefresh = () => {
        this.props.refresh();
    };

    render() {
        return (
            <ScrollView style={{padding: 15}}>
                {this.state.questions.map((question) => {
                    return (
                        <ListItem key={question.id}
                                  leftIcon={{name: question.icon}}
                                  onPress={() => {
                                      if (question.questionType === 'TrueFalse') {
                                          this.props.navigation.navigate('TrueFalseQuestionEditor',
                                              {
                                                  'questionId': question.id,
                                                  'examId': this.state.examId,
                                                  'title': question.title,
                                                  'description': question.description,
                                                  'points': question.points,
                                                  'isTrue': question.isTrue,
                                                  onGoBack: () => this.hardRefresh()
                                              })
                                      }
                                      if (question.questionType === 'Multiple') {
                                          this.props.navigation.navigate('MultipleChoiceQuestionEditor',
                                              {
                                                  'questionId': question.id,
                                                  'examId': this.state.examId,
                                                  'title': question.title,
                                                  'description': question.description,
                                                  'points': question.points,
                                                  'choices': question.choices,
                                                  'correctAnswer': question.correctAnswer,
                                                  onGoBack: () => this.hardRefresh()
                                              })
                                      }
                                      if (question.questionType === 'Essay') {
                                          this.props.navigation.navigate('EssayQuestionEditor',
                                              {
                                                  'questionId': question.id,
                                                  'examId': this.state.examId,
                                                  'title': question.title,
                                                  'description': question.description,
                                                  'points': question.points,
                                                  onGoBack: () => this.hardRefresh()
                                              })
                                      }
                                      if (question.questionType === 'FillInBlank') {
                                          this.props.navigation.navigate('FillInBlankQuestionEditor',
                                              {
                                                  'questionId': question.id,
                                                  'examId': this.state.examId,
                                                  'title': question.title,
                                                  'description': question.description,
                                                  'variables': question.variables,
                                                  'points': question.points,
                                                  onGoBack: () => this.hardRefresh()
                                              })
                                      }
                                  }}
                                  title={question.title}
                                  key={question.id}
                                  subtitle={question.questionType}/>
                    );
                })}
            </ScrollView>
        );
    }
}