import React from 'react';
import TopicServiceClient from "../services/TopicServiceClient";
import {ScrollView} from 'react-native';
import {ListItem} from "react-native-elements";


export default class TopicList
    extends React.Component {

    static navigationOptions = {title: 'Topics'};

    constructor(props) {
        super(props);

        this.state = {
            courseId: 0,
            moduleId: 0,
            lessonId: 0,
            topics: []
        };

        this.topicServiceClient = TopicServiceClient.instance();
    }

    componentDidMount() {
        const courseId = this.props.navigation.getParam('courseId', 0);
        const moduleId = this.props.navigation.getParam('moduleId', 0);
        const lessonId = this.props.navigation.getParam('lessonId', 0);

        this.setState({courseId: courseId});
        this.setState({moduleId: moduleId});
        this.setState({lessonId: lessonId});

        this.topicServiceClient.findAllTopicsForLesson(courseId, moduleId,lessonId)
            .then((topics) => {
                this.setState({topics: topics});
            });
    }

    render() {
        return (
            <ScrollView>
                {this.state.topics.map((topic) =>
                    <ListItem
                        onPress={() =>
                            this.props.navigation.navigate("WidgetList", {
                                courseId: this.state.courseId,
                                moduleId: this.state.moduleId,
                                lessonId: this.state.lessonId,
                                topicId: topic.id,
                            })}
                        title={topic.title}
                        key={topic.id}/>)}
            </ScrollView>
        );
    }
}