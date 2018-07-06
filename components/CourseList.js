import React from 'react';
import {ListItem} from 'react-native-elements';
import CourseServiceClient from "../services/CourseServiceClient";
import {StatusBar, ScrollView} from 'react-native';
import FixedHeader from "../elements/FixedHeader";


export default class CourseList
    extends React.Component {
    static navigationOptions = {title: 'Courses'};

    constructor(props) {
        super(props);

        this.state = {
            courses: []
        };

        this.courseServiceClient = CourseServiceClient.instance();
    }

    componentDidMount() {
        this.courseServiceClient.findAllCourses()
            .then((courses) => {
                this.setState({courses: courses})
            })
    }

    render() {
        return (
            <ScrollView>
                <StatusBar barStyle='light-content'/>
                <FixedHeader/>
                {this.state.courses.map((course) =>
                    (<ListItem
                        onPress={() => {
                            this.props.navigation.navigate("ModuleList", {courseId: course.id})
                        }}
                        title={course.title}
                        key={course.id}/>))}
            </ScrollView>
        );
    }
}