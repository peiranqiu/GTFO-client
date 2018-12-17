import React, {Component} from 'react'
import {StatusBar, ScrollView, View, Alert} from 'react-native'
import {Text, ListItem} from 'react-native-elements'
import CourseServiceClient from '../services/CourseServiceClient'

class CourseList extends Component {
    //static navigationOptions = {title: 'Courses'}

    constructor(props) {
        super(props);
        this.courseService = CourseServiceClient.instance;

        this.courseService.findAllCourses()
            .then(courses => {
                this.setState({courses: courses})
            });
        this.state = {
            courses: []
        }
    }

    render() {
        return (
            <ScrollView>
                <StatusBar barStyle="dark-content"/>
                <View style={{padding: 15}}>
                    {this.state.courses.map((course, index) => (
                        <ListItem
                            onPress={() => this.props.navigation.navigate("ModuleList",
                                {courseId: course.id})}
                            title={course.title}
                            leftIcon={{name: 'label'}}
                            key={index}/>
                    ))}
                </View>
            </ScrollView>
        )
    }
}

export default CourseList