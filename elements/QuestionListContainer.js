import {Text, Button, List, ListItem} from 'react-native-elements'
import React, {Component} from 'react'
import {View, Alert} from "react-native";
import AddQuestionComponent from "./AddQuestionComponent";
import QuestionListComponent from "./QuestionListComponent";

const QuestionListContainer = ({questions, addQuestion}) => (
    <View>
        <AddQuestionComponent addQuestion={addQuestion}/>
        <QuestionListComponent questions={questions}/>
    </View>
)
export default QuestionListContainer