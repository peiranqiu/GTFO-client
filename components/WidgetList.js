import React, {Component} from 'react'
import {ScrollView, Alert, Picker} from 'react-native'
import {Button, Text, ListItem} from 'react-native-elements'
import AssignmentService from "../services/AssignmentServiceClient";
import ExamService from "../services/ExamServiceClient";

class WidgetList extends Component {
    static navigationOptions = {title: 'Widgets'}

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.assignmentService = AssignmentService.instance;
        this.examService = ExamService.instance;

        this.state = {
            questionType: 'ASSIGNMENT',
            assignments: [],
            exams: [],
            courseId: 1,
            moduleId: 1,
            lessonId: 1,
            topicId: navigation.getParam("topicId")
        }
    }

    componentDidMount() {
        const {navigation} = this.props;
        const topicId = navigation.getParam("topicId");
        this.setState({topicId: topicId});

        this.examService.findAllExamsForTopic(topicId)
            .then(exams => this.setState({exams: exams}));
        this.assignmentService.findAllAssignmentsForTopic(topicId)
            .then(assignments => this.setState({assignments: assignments}));
    }

    componentWillReceiveProps(newProps) {
        const {navigation} = this.props;
        const topicId = navigation.getParam("topicId");
        this.setState({topicId: topicId});
        this.examService.findAllExamsForTopic(topicId)
            .then(exams => this.setState({exams: exams}));
        this.assignmentService.findAllAssignmentsForTopic(topicId)
            .then(assignments => this.setState({assignments: assignments}));
    }

    refreshFunction(topicId) {
        this.examService.findAllExamsForTopic(topicId)
            .then(exams => this.setState({exams: exams}));
        this.assignmentService.findAllAssignmentsForTopic(topicId)
            .then(assignments => this.setState({assignments: assignments}));
    }

    addWidget() {
        switch (this.state.questionType) {
            case "ASSIGNMENT":
                this.props.navigation.navigate("Assignment", {
                    topicId: this.state.topicId,
                    refreshFunc: () => this.refreshFunction(this.state.topicId)
                });
                return;
            case "EXAM":
                this.props.navigation.navigate("Exam", {
                    topicId: this.state.topicId,
                    refreshFunc: () => this.refreshFunction(this.state.topicId)
                });
                return;
            default:
                return;
        }
    }


    render() {
        return (
            <ScrollView style={{padding: 15}}>
                {this.state.assignments.map(
                    (assignment, index) => (
                        <ListItem
                            onPress={() => this.props.navigation.navigate("Assignment", {
                                assignmentId: assignment.id,
                                topicId: this.state.topicId,
                                title: assignment.title,
                                points: assignment.points,
                                description: assignment.description,
                                refreshFunc: () => this.refreshFunction(this.state.topicId)
                            })}
                            key={index}
                            leftIcon={{name: 'event-note'}}
                            subtitle={assignment.description + " - " + assignment.points + " pts"}
                            title={assignment.title}/>))}
                {this.state.exams.map(
                    (exam, index) => (
                        <ListItem
                            onPress={() => this.props.navigation.navigate("Exam", {
                                examId: exam.id,
                                topicId: this.state.topicId,
                                title: exam.title,
                                description: exam.description,
                                refreshFunc: () => this.refreshFunction(this.state.topicId)
                            })}
                            key={index}
                            leftIcon={{name: 'alarm'}}
                            title={exam.title}/>))}
                <Picker
                    style={{height: 120}}
                    itemStyle={{height: 100}}
                    onValueChange={(itemValue, itemIndex) => this.setState({questionType: itemValue})}
                    selectedValue={this.state.questionType}>
                    <Picker.Item value="ASSIGNMENT" label="Assignment"/>
                    <Picker.Item value="EXAM" label="Exam"/>
                </Picker>
                <Button
                    backgroundColor="cornflowerblue"
                    onPress={() => this.addWidget()}
                    color="white"
                    title="Add Widget"/>
                <Text>{"\n"}</Text>

            </ScrollView>
        )
    }
}

export default WidgetList