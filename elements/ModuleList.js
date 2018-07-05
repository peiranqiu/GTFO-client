import React, {Component} from 'react'
import {ListItem, Text} from 'react-native-elements'
import {View} from 'react-native'

class ModuleList extends Component {
    static navigationOptions = {title: 'Modules'}

    constructor(props) {
        super(props)
        this.state = {modules: [], courseId: 2}
    }

    componentDidMount() {
        const courseId = this.props.navigation.getParam("courseId", 2);
        this.setState({courseId: courseId})
        fetch('https://myapp-peiran.herokuapp.com/api/course' + courseId + '/module')
            .then(response => (response.json()))
            .then(modules => {
                this.setState({modules: modules})
            })
    }

    render() {
        return (
            <View style={{padding: 15}}>
                {this.state.modules.map((module, index) => (
                    <ListItem
                        onPress={() => this.props.navigation
                            .navigate("LessonList", {
                                courseId: this.state.courseId,
                                moduleId: module.id})}
                        title={module.title}
                        key={index}/>
                ))}
            </View>
        )
    }
}

export default ModuleList