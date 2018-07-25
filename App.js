import React from 'react';import {createStackNavigator} from 'react-navigation'
import Exam from './elements/Exam'
import TrueFalseQuestionEditor from "./elements/TrueFalseQuestionEditor";
import CourseList from "./components/CourseList";
import ModuleList from "./components/ModuleList";
import LessonList from "./components/LessonList";
import WidgetList from "./components/WidgetList";
import TopicList from "./components/WidgetList";
import AddExamComponent from "./elements/AddExamComponent";
import Assignment from "./elements/Assignment";
import MultipleChoiceQuestionEditor from "./elements/MultipleChoiceQuestionEditor";
import EssayQuestionEditor from "./elements/EssayQuestionEditor";
import FillInBlankQuestionEditor from "./elements/FillInTheBlankQuestionEditor";

const App = createStackNavigator({
    CourseList: {
        screen: CourseList,
        navigationOptions: {
            header: null,
        }
    },
    ModuleList: {screen: ModuleList},
    LessonList: {screen: LessonList},
    TopicList: {screen: TopicList},
    WidgetList: {screen: WidgetList},
    AddExamComponent,
    ExamWidget: Exam,
    AssignmentWidget: Assignment,
    TrueFalseQuestionEditor,
    MultipleChoiceQuestionEditor,
    EssayQuestionEditor,
    FillInBlankQuestionEditor
});

export default App;