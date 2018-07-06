let _singleton = Symbol();
const COURSE_API_URL = 'https://myapp-peiran.herokuapp.com/api/course';
const TOPIC_API_URL = 'https://myapp-peiran.herokuapp.com/api/topic';

export default class TopicServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken) {
            throw new Error('Singleton topic service.')
        }
    }

    static instance() {
        if (!this[_singleton]) {
            this[_singleton] = new TopicServiceClient(_singleton);
        }
        return this[_singleton];
    }

    createTopic(courseId, moduleId, lessonId, topic) {
        let url = COURSE_API_URL + '/' + courseId + '/module/' + moduleId + '/lesson/'+lessonId+'/topic';
        return fetch(url, {
            method: 'post',
            body: JSON.stringify(topic),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then((response) => {
                return response.json();
            })
    }

    deleteTopic(topicId) {
        return fetch(TOPIC_API_URL + '/' + topicId, {
            method: 'delete'
        })
            .then((response) => {
                return response;
            });
    }

    findAllTopics() {
        return fetch(TOPIC_API_URL)
            .then((response) => {
                return response.json();
            });
    }

    findTopicById(topicId) {
        return fetch(TOPIC_API_URL + '/' + topicId)
            .then((response) => {
                return response.json();
            })
    }

    findAllTopicsForLesson(courseId, moduleId, lessonId) {
        let url = COURSE_API_URL + '/' + courseId + '/module/' + moduleId + '/lesson'+lessonId+'/topic';
        return fetch(url)
            .then((response) => {
                if (response.status === 409) {
                    return null;
                }
                return response.json();
            });
    }

    updateTopic(topicId, newTopic) {
        return fetch(TOPIC_API_URL + '/' + topicId, {
            method: 'put',
            body: JSON.stringify(newTopic),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then((response) => {
                return response.json();
            })
    }
}