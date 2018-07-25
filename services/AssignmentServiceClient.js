let _singleton = Symbol();


const ASSIGNMENT_API_URL = 'https://myapp-peiran.herokuapp.com/api/assignment';

const ASSIGNMENT_TOPIC_API_URL = 'https://myapp-peiran.herokuapp.com/api/topic/TID/assignment';

export default class AssignmentServiceClient {


    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new AssignmentServiceClient(_singleton);
        return this[_singleton]
    }

    findAllAssignments() {
        return fetch(ASSIGNMENT_API_URL)
            .then(function (response) {
                return response.json();
            });
    }

    findAssignmentById(assignmentId) {
        return fetch(ASSIGNMENT_API_URL + '/' + assignmentId)
            .then(response => (response.json()));
    }

    findAllAssignmentsForTopic(topicId) {
        return fetch(ASSIGNMENT_TOPIC_API_URL.replace('TID', topicId))
            .then(response => (response.json()));
    }

    createAssignmentForTopic(topicId, assignment) {
        return fetch(ASSIGNMENT_TOPIC_API_URL.replace('TID', topicId), {
            method: 'post',
            body: JSON.stringify(assignment),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }

    updateAssignmentForTopic(assignmentId, topicId, assignment) {
        return fetch(ASSIGNMENT_TOPIC_API_URL
            .replace('TID', topicId)+'/'+assignmentId, {
            method: 'put',
            body: JSON.stringify(assignment),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => (response.json()));
    }

    deleteAssignment(assignmentId) {
        return fetch(ASSIGNMENT_API_URL + '/' + assignmentId, {
            method: 'delete'
        });
    }
}