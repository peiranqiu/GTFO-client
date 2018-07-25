let _singleton = Symbol();

const QUESTION_API_URL = 'https://myapp-peiran.herokuapp.com/api/exam/EID/QTYPE';
const DELETE_QUESTION_API_URL = 'https://myapp-peiran.herokuapp.com/api/question/QID';
const ALL_QUESTION_API_URL = 'https://myapp-peiran.herokuapp.com/api/exam/EID/question';

export default class QuestionServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new QuestionServiceClient(_singleton);
        return this[_singleton]
    }

    findAllQuestionsForExam(examId) {
        return fetch(ALL_QUESTION_API_URL.replace('EID',examId))
            .then(response => (response.json()));
    }

    updateMultipleChoiceQuestionForExam(examId, questionId, question) {
        return fetch(QUESTION_API_URL
            .replace('EID', examId)
            .replace('QTYPE', 'choice') + '/' + questionId, {
            method: 'put',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }

    updateEssayQuestionForExam(examId, questionId, question) {
        return fetch(QUESTION_API_URL
            .replace('EID', examId)
            .replace('QTYPE', 'essay') + '/' + questionId, {
            method: 'put',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }

    updateFillInTheBlankQuestionForExam(examId, questionId, question) {
        return fetch(QUESTION_API_URL
            .replace('EID', examId)
            .replace('QTYPE', 'blanks') + '/' + questionId, {
            method: 'put',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }

    updateTrueFalseQuestionForExam(examId, questionId, question) {
        return fetch(QUESTION_API_URL
            .replace('EID', examId)
            .replace('QTYPE', 'truefalse') + '/' + questionId, {
            method: 'put',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }

    deleteQuestionById(questionId) {
        return fetch(DELETE_QUESTION_API_URL.replace('QID', questionId), {
            method: 'delete'
        });
    }

    createTrueFalseQuestionForExam(examId, question) {
        return fetch(QUESTION_API_URL.replace('EID', examId).replace('QTYPE', 'truefalse'), {
            method: 'post',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }

    createMultipleChoiceQuestionForExam(examId, question) {
        return fetch(QUESTION_API_URL.replace('EID', examId).replace('QTYPE', 'choice'), {
            method: 'post',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }

    createEssayQuestion(examId, question) {
        return fetch(QUESTION_API_URL.replace('EID', examId).replace('QTYPE', 'essay'), {
            method: 'post',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }

    createFillInTheBlankQuestion(examId, question) {
        return fetch(QUESTION_API_URL.replace('EID', examId).replace('QTYPE', 'blanks'), {
            method: 'post',
            body: JSON.stringify(question),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }
}