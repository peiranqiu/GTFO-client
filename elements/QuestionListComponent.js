import {Text, Button, List, ListItem} from 'react-native-elements'
import React, {Component} from 'react'
import {View, Alert} from "react-native";

const QuestionListComponent = ({questions}) => (
    <View>
        <Text h1>Question List({questions.length})</Text>
        <List>
            {questions.map((question, i) => (
                <ListItem
                    key={i} title={question.label}/>
            ))}
        </List>
    </View>
)
export default QuestionListComponent