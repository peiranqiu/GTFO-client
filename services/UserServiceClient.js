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

    acceptFriendRequest(friendId) {
        return fetch(constants.SERVER + 'friend/' + friendId, {
            method: 'post'
        }).then(response => response);
    }

    sendFriendRequest(userId, user) {
        return fetch(constants.SERVER + 'friend/request/' + userId, {
            method: 'post',
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => console.log(response));
    }

    findFriendSends(userId) {
        return fetch(constants.SERVER + 'friend/send/' + userId).then(response => (response.json()));
    }

    deleteFriend(userId, anotherUserId) {
        return fetch(constants.SERVER + 'friend/' + userId + '/delete/' + anotherUserId, {
            method: 'delete'
        }).then(response => console.log(response));
    }

    reportUser(userId) {
        return fetch(constants.SERVER + 'user/' + userId + '/status/block', {
            method: 'put'
        }).then(response => console.log(response));
    }

    updateUser(userId, user) {
        return fetch(constants.SERVER + 'user/' + userId + '/update', {
            method: 'put',
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => console.log(response));
    }
}