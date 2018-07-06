import React from 'react';
import ModuleServiceClient from "../services/ModuleServiceClient";
import {ScrollView} from "react-native";
import {ListItem} from "react-native-elements";


export default class ModuleList
    extends React.Component {

    static navigationOptions = {title: 'Modules'};

    constructor(props) {
        super(props);

        this.state = {
            courseId: 0,
            modules: []
        };

        this.moduleServiceClient = ModuleServiceClient.instance();
    }

    componentDidMount() {
        const courseId = this.props.navigation.getParam('courseId', 0);

        this.setState({courseId: courseId});

        this.moduleServiceClient.findAllModulesForCourse(courseId)
            .then((modules) => {
                this.setState({
                    modules: modules
                });
            });
    }

    render() {
        return (
            <ScrollView>
                {this.state.modules.map((module) => {
                    return (
                        <ListItem
                            onPress={() => {
                                this.props.navigation.navigate("LessonList", {
                                    courseId: this.state.courseId,
                                    moduleId: module.id
                                })
                            }}
                            title={module.title}
                            key={module.id}/>
                    );
                })}
            </ScrollView>
        );
    }
}