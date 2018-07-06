let _singleton = Symbol();
const COURSE_API_URL = 'https://myapp-peiran.herokuapp.com/api/course';
const MODULE_API_URL = 'https://myapp-peiran.herokuapp.com/api/module';

export default class ModuleServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken) {
            throw new Error('Singleton module service.')
        }
    }

    static instance() {
        if (!this[_singleton]) {
            this[_singleton] = new ModuleServiceClient(_singleton);
        }
        return this[_singleton];
    }

    createModule(courseId, module) {
        return fetch(COURSE_API_URL + '/' + courseId + '/module', {
            method: 'post',
            body: JSON.stringify(module),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(function(response) {
                return response.json();
            })
    }

    deleteModule(moduleId) {
        return fetch(MODULE_API_URL + '/' + moduleId, {
            method: 'delete'
        })
            .then(function(response) {
                return response;
            });
    }

    findAllModules() {
        return fetch(MODULE_API_URL)
            .then((response) => {
                return response.json();
            });
    }

    findModuleById(moduleId) {
        return fetch(MODULE_API_URL + '/' + moduleId)
            .then((response) => {
                return response.json();
            });
    }

    findAllModulesForCourse(courseId) {
        return fetch(COURSE_API_URL + '/' + courseId + '/module')
            .then(function(response) {
                return response.json();
            });
    }

    updateModule(moduleId, module) {
        return fetch(MODULE_API_URL + '/' + moduleId, {
            method: 'put',
            body: JSON.stringify(module),
            headers: {
                'content-type': 'application/json'
            }
        })
    }
}