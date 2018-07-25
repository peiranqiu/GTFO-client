import React from 'react'
import {createStackNavigator, StackNavigator} from 'react-navigation'

import CourseList from './components/CourseList'
import ModuleList from './components/ModuleList'
import LessonList from './components/LessonList'
import WidgetList from './components/WidgetList'

import Assignment from './elements/Assignment'
import Exam from './elements/Exam'

import EssayQuestionEditor from './elements/EssayQuestionEditor'
import FillInTheBlankQuestionEditor from './elements/FillInTheBlankQuestionEditor'
import TrueFalseQuestionEditor from './elements/TrueFalseQuestionEditor'
import MultipleChoiceQuestionEditor from './elements/MultipleChoiceQuestionEditor'
import TopicList from "./components/TopicList";

const App = createStackNavigator({
    CourseList,
    Assignment,
    Exam,
    ModuleList,
    LessonList,
    TopicList,
    WidgetList,
    TrueFalseQuestionEditor,
    MultipleChoiceQuestionEditor,
    EssayQuestionEditor,
    FillInTheBlankQuestionEditor,
});

export default App;