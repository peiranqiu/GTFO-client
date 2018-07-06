let _singleton = Symbol();
const COURSE_API_URL = 'https://myapp-peiran.herokuapp.com/api/course';
const LESSON_API_URL = 'https://myapp-peiran.herokuapp.com/api/lesson';

export default class LessonServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken) {
            throw new Error('Singleton lesson service.')
        }
    }

    static instance() {
        if (!this[_singleton]) {
            this[_singleton] = new LessonServiceClient(_singleton);
        }
        return this[_singleton];
    }

    createLesson(courseId, moduleId, lesson) {
        let url = COURSE_API_URL + '/' + courseId + '/module/' + moduleId + '/lesson';
        return fetch(url, {
            method: 'post',
            body: JSON.stringify(lesson),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then((response) => {
                return response.json();
            })
    }

    deleteLesson(lessonId) {
        return fetch(LESSON_API_URL + '/' + lessonId, {
            method: 'delete'
        })
            .then((response) => {
                return response;
            });
    }

    findAllLessons() {
        return fetch(LESSON_API_URL)
            .then((response) => {
                return response.json();
            });
    }

    findLessonById(lessonId) {
        return fetch(LESSON_API_URL + '/' + lessonId)
            .then((response) => {
                return response.json();
            })
    }

    findAllLessonsForModule(courseId, moduleId) {
        let url = COURSE_API_URL + '/' + courseId + '/module/' + moduleId + '/lesson';
        return fetch(url)
            .then((response) => {
                if (response.status === 409) {
                    return null;
                }
                return response.json();
            });
    }

    updateLesson(lessonId, newLesson) {
        return fetch(LESSON_API_URL + '/' + lessonId, {
            method: 'put',
            body: JSON.stringify(newLesson),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then((response) => {
                return response.json();
            })
    }
}