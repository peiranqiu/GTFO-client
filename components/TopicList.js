import React, {Component} from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {Text, ListItem} from 'react-native-elements'
import CourseServiceClient from '../services/CourseService'


export default class TopicList
    extends React.Component {

    static navigationOptions = {title: 'Topics'};

    constructor(props) {
        super(props);

        this.state = {
            courseId: 1,
            moduleId: 1,
            lessonId: 1,
            topics: []
        };

        this.courseService = CourseServiceClient.instance();
    }

    componentDidMount() {

        const {navigation} = this.props;
        const courseId = this.props.navigation.getParam('courseId', 1);
        const moduleId = this.props.navigation.getParam('moduleId', 1);
        const lessonId = this.props.navigation.getParam('lessonId', 1);

        this.setState({courseId: courseId});
        this.setState({moduleId: moduleId});
        this.setState({lessonId: lessonId});

        this.courseService.findAllTopicsForLesson(courseId, moduleId,lessonId)
            .then((topics) => {
                this.setState({topics: topics});
            });
    }

    render() {
        return (
            <ScrollView style={{padding: 15}}>
                {this.state.topics.map(
                    (topic, index) => (
                    <ListItem
                        leftIcon={{name: 'equalizer'}}
                        onPress={() =>
                            this.props.navigation.navigate("WidgetList", {
                                courseId: this.state.courseId,
                                moduleId: this.state.moduleId,
                                lessonId: this.state.lessonId,
                                topicId: topic.id,
                            })}
                        title={topic.title}
                        key={index}/>))}
            </ScrollView>
        );
    }
}