import React from 'react';
import LessonServiceClient from "../services/LessonServiceClient";
import {ScrollView} from 'react-native';
import {ListItem} from "react-native-elements";


export default class LessonList
    extends React.Component {

    static navigationOptions = {title: 'Lessons'};

    constructor(props) {
        super(props);

        this.state = {
            courseId: 0,
            moduleId: 0,
            lessons: []
        };

        this.lessonServiceClient = LessonServiceClient.instance();
    }

    componentDidMount() {
        const courseId = this.props.navigation.getParam('courseId', 0);
        const moduleId = this.props.navigation.getParam('moduleId', 0);

        this.setState({courseId: courseId});
        this.setState({moduleId: moduleId});

        this.lessonServiceClient.findAllLessonsForModule(courseId, moduleId)
            .then((lessons) => {
                this.setState({lessons: lessons});
            });
    }

    render() {
        return (
            <ScrollView>
                {this.state.lessons.map((lesson) =>
                    <ListItem
                        onPress={() =>
                            this.props.navigation.navigate("WidgetList", {
                                courseId: this.state.courseId,
                                moduleId: this.state.moduleId,
                                lessonId: lesson.id,
                            })}
                        title={lesson.title}
                        key={lesson.id}/>)}
            </ScrollView>
        );
    }
}