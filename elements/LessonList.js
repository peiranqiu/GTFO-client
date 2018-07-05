import React, {Component} from 'react'
import {ListItem, Text} from 'react-native-elements'
import {View} from 'react-native'

class LessonList extends Component {
    static navigationOptions = {title: 'Lessons'}

    constructor(props) {
        super(props)
        this.state = {modules: [], courseId: 2, moduleId: 52}
    }

    componentDidMount() {
        const courseId = this.props.navigation.getParam("courseId", 2);
        const moduleId = this.props.navigation.getParam("moduleId", 52);
        this.setState({courseId: courseId})
        this.setState({moduleId: moduleId})
        fetch('https://myapp-peiran.herokuapp.com/api/course'
            + courseId + '/module/' + moduleId + '/lesson')
            .then(response => (response.json()))
            .then(lessons => {
                this.setState({lessons:lessons})
            })
    }

    render() {
        return (
            <View style={{padding: 15}}>
                {this.state.lessons.map((lesson, index) => (
                    <ListItem
                        title={lesson.title}
                        key={index}/>
                ))}
            </View>
        )
    }
}

export default LessonList