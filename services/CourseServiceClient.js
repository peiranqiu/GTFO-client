let _singleton = Symbol();

const COURSE_API_URL = 'https://myapp-peiran.herokuapp.com/api/course';

export default class CourseServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken) {
            throw new Error('Singleton course service.');
        }
    }

    static instance() {
        if(!this[_singleton]) {
            this[_singleton] = new CourseServiceClient(_singleton);
        }
        return this[_singleton];
    }

    createCourse(course) {
        return fetch(COURSE_API_URL, {
            method: 'post',
            body: JSON.stringify(course),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(function(response) {
                return response.json();
            });
    }

    deleteCourse(courseId) {
        return fetch(COURSE_API_URL + '/' + courseId, {
            method: 'delete'
        })
            .then(function(response) {
                return response;
            });
    }

    findAllCourses() {
        return fetch(COURSE_API_URL)
            .then(function(response) {
                return response.json();
            });
    }

    findCourseById(courseId) {
        return fetch(COURSE_API_URL + '/' + courseId)
            .then(function(response) {
                return response.json();
            })
    }

    updateCourse(course) {
        return fetch(COURSE_API_URL, {
            method: 'put',
            body: JSON.stringify(course),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(function(response) {
                if (response.status === 409) {
                    return null;
                }
                return response.json();
            });
    }
}