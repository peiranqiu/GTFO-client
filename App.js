import React from 'react';
import {StyleSheet, Text, View, StatusBar, ScrollView, Alert} from 'react-native';
import {createStackNavigator} from 'react-navigation'
import FixedHeader from './elements/FixedHeader'
import TextHeadings from './elements/TextHeadings'
import Icons from './elements/Icons'
import ExamWidget from './elements/ExamWidget'
import QuestionTypeChooser from './elements/QuestionTypeChooser'
import QuestionTypePicker from "./elements/QuestionTypePicker";
import TrueFalseQuestionEditor from "./elements/TrueFalseQuestionEditor";
import {Button} from "react-native-elements";
import ScreenX from './elements/ScreenX'
import QuestionListContainer from "./elements/QuestionListContainer";

let questions = [
    {id:1, label:'Question 1'},
    {id:2, label:'Question 2'},
    {id:3, label:'Question 3'},
]

class Home extends React.Component {
    static navigationOptions = {title: 'Home'};

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ScrollView>
                <StatusBar
                    hidden={true}/>
                <QuestionListContainer questions={questions}
                addQuestion={()=> Alert.alert('add question')}/>
                <FixedHeader/>
                <Button title="Go to Screen X"
                        onPress={() => this.props.navigation.navigate('ScreenX', {parameter: 'Parameter Value'})}/>
                <Button title="Go to Screen A"
                        onPress={() => this.props.navigation.navigate('ScreenA')}/>
                <Button title="Go to Screen B"
                        onPress={() => this.props.navigation.navigate('ScreenB')}/>
                <TrueFalseQuestionEditor/>
                <QuestionTypeChooser/>
                <QuestionTypePicker/>
                <ExamWidget/>
                <TextHeadings/>
                <Icons/>
            </ScrollView>
        )
    }
}

class ScreenA extends React.Component {
    static navigationOptions = {title: 'Screen A'};

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
                <Text h1>Screen A</Text>
                <Button title="Go Home"
                        onPress={() => this.props.navigation.navigate('Home')}/>
            </View>
        )
    }
}

class ScreenB extends React.Component {
    static navigationOptions = {title: 'Screen B'};

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
                <Text h1>Screen B</Text>
            </View>
        )
    }
}

const App = createStackNavigator({
    Home, ScreenA, ScreenB, ScreenX
});

export default App;