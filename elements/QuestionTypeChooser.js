import React from 'react';
import {ScrollView} from 'react-native';
import {ButtonGroup, Button} from 'react-native-elements';


export default class QuestionTypeChooser
    extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            examId: 0,
            selectedTypeIndex: 0
        };

        this.selectQuestionType = this.selectQuestionType.bind(this);
    }

    componentDidMount() {
        const examId = this.props.navigation.getParam('examId', 0);
        this.setState({examId: examId});
    }

    selectQuestionType = (newTypeIndex) => {
        this.setState({selectedTypeIndex: newTypeIndex});
    };

    hardRefresh = () => {
        this.props.refresh();
    };

    render() {
        const questionTypes = [
            'Multiple Choice',
            'Fill in the blank',
            'Essay',
            'True or\nfalse'
        ];

        return (
            <ScrollView>
                <ButtonGroup
                    onPress={this.selectQuestionType}
                    selectedIndex={this.state.selectedTypeIndex}
                    containerStyle={{height: 80}}
                    buttons={questionTypes}/>
                <Button style={{padding: 10}}
                        backgroundColor='#4c73c4'
                        title='Add Question'
                        onPress={() => {
                            if (this.state.selectedTypeIndex === 0) {
                                this.props.navigation.navigate("MultipleChoiceQuestionEditor", {
                                    'examId': this.state.examId,
                                    onGoBack: () => this.hardRefresh()});
                            }
                            if (this.state.selectedTypeIndex === 1) {
                                this.props.navigation.navigate("FillInBlankQuestionEditor", {
                                    'examId': this.state.examId,
                                    onGoBack: () => this.hardRefresh()});
                            }
                            if (this.state.selectedTypeIndex === 2) {
                                this.props.navigation.navigate("EssayQuestionEditor", {
                                    'examId': this.state.examId,
                                    onGoBack: () => this.hardRefresh()});
                            }
                            if (this.state.selectedTypeIndex === 3) {
                                this.props.navigation.navigate("TrueFalseQuestionEditor", {
                                    'examId': this.state.examId,
                                    onGoBack: () => this.hardRefresh()});
                            }
                        }}/>
            </ScrollView>
        );
    }
}