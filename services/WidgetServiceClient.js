let _singleton = Symbol();
const LESSON_API_URL = 'https://myapp-peiran.herokuapp.com/api/lesson';
const ASSIGNMENT_API_URL = 'https://myapp-peiran.herokuapp.com/api/assignment';
const EXAM_API_URL = 'https://myapp-peiran.herokuapp.com/api/exam';


export default class WidgetServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken) {
            throw new Error('Singleton module service.');
        }
    }

    static instance() {
        if (!this[_singleton]) {
            this[_singleton] = new WidgetServiceClient(_singleton);
        }
        return this[_singleton];
    }

    findAllWidgetsForLesson(lessonId) {
        return fetch(LESSON_API_URL + '/' + lessonId + '/widget')
            .then((response) => (response.json()));
    }

    createAssignment(lessonId, assignment) {
        return fetch(LESSON_API_URL + '/' + lessonId + '/assignment',
            {
                method: 'post',
                body: JSON.stringify(assignment),
                headers: {
                    'content-type': 'application/json'
                }
            });
    }

    updateAssignment(assignmentId, assignment) {
        return fetch(ASSIGNMENT_API_URL + '/' + assignmentId, {
            method: 'put',
            body: JSON.stringify(assignment),
            headers: {
                'content-type': 'application/json'
            }
        });
    }

    deleteAssignment(assignmentId) {
        return fetch(ASSIGNMENT_API_URL + '/' + assignmentId, {
            method: 'delete'});
    }

    createExam(lessonId, exam) {
        return fetch(LESSON_API_URL + '/' + lessonId + '/exam', {
            method: 'post',
            body: JSON.stringify(exam),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => response.json());
    }

    updateExam(examId, exam) {
        return fetch(EXAM_API_URL + '/' + examId, {
            method: 'put',
            body: JSON.stringify(exam),
            headers: {
                'content-type': 'application/json'
            }
        })
    }

    deleteExam(examId) {
        return fetch(EXAM_API_URL + '/' + examId, {
            method: 'delete'
        })
    }
}