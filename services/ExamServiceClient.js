let _singleton = Symbol();

const EXAM_API_URL = 'http://localhost:8080/api/exam';
const EXAM_TOPIC_API_URL = 'http://localhost:8080/api/topic/TID/exam';

export default class ExamServiceClient {


    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new ExamServiceClient (_singleton);
        return this[_singleton]
    }

    findAllAExams() {
        return fetch(EXAM_API_URL)
            .then(function (response) {
                return response.json();
            });
    }

    findExamById(examId) {
        return fetch(EXAM_API_URL + '/' + examId)
            .then(response => (response.json()));
    }

    updateExam(examId, exam) {
        return fetch(EXAM_API_URL+'/'+examId, {
            method: 'put',
            body: JSON.stringify(exam),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }

    findAllExamsForTopic(topicId) {
        return fetch(EXAM_TOPIC_API_URL.replace('TID', topicId))
            .then(response => (response.json()));
    }

    createExamForTopic(topicId, exam) {
        // alert("creating");
        return fetch(EXAM_TOPIC_API_URL.replace('TID', topicId), {
            method: 'post',
            body: JSON.stringify(exam),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }

    deleteExam(examId) {
        return fetch(EXAM_API_URL + '/' + examId, {
            method: 'delete'
        });
    }
}