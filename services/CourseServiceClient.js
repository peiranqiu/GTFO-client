let _singleton = Symbol();

const COURSE_API_URL = 'https://myapp-peiran.herokuapp.com/api/course';
const MODULE_API_URL = 'https://myapp-peiran.herokuapp.com/api/course/CID/module';
const LESSON_API_URL = 'https://myapp-peiran.herokuapp.com/api/course/CID/module/MID/lesson';
const TOPIC_API_URL = 'https://myapp-peiran.herokuapp.com/api/course/CID/module/MID/lesson/LID/topic';

export default class CourseServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new CourseServiceClient(_singleton);
        return this[_singleton]
    }

    findAllTopicsForLesson(courseId, moduleId, lessonId) {
        return fetch(TOPIC_API_URL
            .replace('CID', courseId)
            .replace('MID', moduleId)
            .replace('LID', lessonId))
            .then(response => (response.json()));
    }

    findAllLessonsForModule(courseId, moduleId) {
        return fetch(LESSON_API_URL
            .replace('CID', courseId)
            .replace('MID', moduleId))
            .then(response => (response.json()));
    }

    findAllCourses() {
        return fetch(COURSE_API_URL)
            .then(response => (response.json()));
    }

    findAllModulesForCourse(courseId) {
        return fetch(MODULE_API_URL
            .replace('CID', courseId))
            .then(response => (response.json()))

    }
}