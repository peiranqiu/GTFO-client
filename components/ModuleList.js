import React, {Component} from 'react'
import {View} from 'react-native'
import {Text, ListItem} from 'react-native-elements'
import CourseServiceClient from '../services/CourseServiceClient'

class ModuleList extends Component {
    static navigationOptions = {title: 'Modules'}

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.courseService = CourseServiceClient.instance;
        this.state = {
            modules: [],
            courseId: 1
        }
    }

    componentDidMount() {
        const courseId = this.props.navigation.getParam("courseId", 1);
        this.setState({
            courseId: courseId
        });
        this.courseService.findAllModulesForCourse(courseId)
            .then(modules => this.setState({modules: modules}));
    }

    render() {
        return (
            <View style={{padding: 15}}>
                {this.state.modules.map((module, index) => (
                    <ListItem
                        onPress={() => this.props.navigation
                            .navigate("LessonList", {
                                courseId:
                                this.state.courseId, moduleId: module.id
                            })}
                        key={index}
                        leftIcon={{name: 'label-outline'}}
                        title={module.title}/>
                ))}
            </View>
        )
    }
}

export default ModuleList