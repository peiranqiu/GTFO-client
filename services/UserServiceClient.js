let _singleton = Symbol();
import * as constants from "../constants/constant";


export default class UserServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new UserServiceClient(_singleton);
        return this[_singleton]
    }

    updateAvatar() {
        return fetch(constants.SERVER + 'instagram/user/update').then(response => (response.json()));
    }

    createUser(token) {
        return fetch(constants.SERVER + 'instagram/user/' + token, {
            method: 'post'
        }).then(response => (response.json()));
    }

    findUserById(userId) {
        return fetch(constants.SERVER + 'user/' + userId).then(response => (response.json()));
    }

    findAllUsers() {
        return fetch(constants.SERVER + 'user').then(response => (response.json()));
    }

    findFriendList(userId) {
        return fetch(constants.SERVER + 'friend/user/' + userId).then(response => (response.json()));

    }
    findFriendRequests(userId) {
        return fetch(constants.SERVER + 'friend/request/' + userId).then(response => (response.json()));
    }
}