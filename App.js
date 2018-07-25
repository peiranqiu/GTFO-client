import React from 'react';import {createStackNavigator} from 'react-navigation'
import ExamWidget from './elements/ExamWidget'
import TrueFalseQuestionEditor from "./elements/TrueFalseQuestionEditor";
import CourseList from "./components/CourseList";
import ModuleList from "./components/ModuleList";
import LessonList from "./components/LessonList";
import WidgetList from "./components/WidgetList";
import TopicList from "./components/WidgetList";
import AddExamComponent from "./elements/AddExamComponent";
import AssignmentWidget from "./elements/AssignmentWidget";
import MultipleChoiceQuestionEditor from "./elements/MultipleChoiceQuestionEditor";
import EssayQuestionEditor from "./elements/EssayQuestionEditor";
import FillInBlankQuestionEditor from "./elements/FillInBlankQuestionEditor";

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
    ExamWidget,
    AssignmentWidget,
    TrueFalseQuestionEditor,
    MultipleChoiceQuestionEditor,
    EssayQuestionEditor,
    FillInBlankQuestionEditor
});

export default App;