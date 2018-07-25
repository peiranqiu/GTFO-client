import React, {Component} from 'react'
import {ScrollView, View, Alert} from 'react-native'
import {Text, ListItem} from 'react-native-elements'
import CourseServiceClient from '../services/CourseServiceClient'

class LessonList extends Component {
    static navigationOptions = {title: 'Lessons'}

    constructor(props) {
        super(props);
        this.courseService = CourseServiceClient.instance;
        const {navigation} = this.props;
        this.state = {
            lessons: [],
            courseId: 1,
            moduleId: 1
        }
    }

    componentDidMount() {
        const {navigation} = this.props;
        const courseId = navigation.getParam("courseId", 1);
        const moduleId = navigation.getParam("moduleId", 1);
        this.courseService.findAllLessonsForModule(courseId, moduleId)
            .then(lessons => this.setState({lessons: lessons}));
    }

    render() {
        return (
            <View style={{padding: 15}}>
                {this.state.lessons.map((lesson, index) => (
                        <ListItem
                            leftIcon={{name: 'label-outline'}}
                            onPress={() => this.props.navigation
                                .navigate("TopicList", {
                                    courseId: this.state.courseId,
                                    moduleId: this.state.moduleId,
                                    lessonId: lesson.id
                                })}
                            key={index}
                            title={lesson.title}/>
                    ))}
            </View>
        )
    }
}

export default LessonList