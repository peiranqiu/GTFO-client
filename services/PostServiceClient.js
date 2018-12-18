let _singleton = Symbol();
import * as constants from "../constants/constant";


export default class PostServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new PostServiceClient(_singleton);
        return this[_singleton]
    }

    updateAll() {
        return fetch(constants.SERVER + 'instagram/newpost').then(response => (response.json()));
    }

    findAllPosts() {
        return fetch(constants.SERVER + 'post').then(response => (response.json()));
    }

    findAllBusinesses() {
        return fetch(constants.SERVER + 'business').then(response => (response.json()));
    }

    findBusinessforPost(postId) {
        return fetch(constants.SERVER + 'post/' + postId + '/business').then(response => (response.json()));
    }
}