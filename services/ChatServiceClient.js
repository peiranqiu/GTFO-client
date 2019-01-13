let _singleton = Symbol();
import * as constants from "../constants/constant";


export default class ChatServiceClient {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new ChatServiceClient(_singleton);
        return this[_singleton]
    }

    findChatsForUser(userId) {
        return fetch(constants.SERVER + 'user/' + userId + '/chat').then(response => (response.json()));

    }
    createChat(users) {
        return fetch(constants.SERVER + 'chat', {
            method: 'post',
            body: JSON.stringify(users),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json());
    }

    createMessage(chatId, message) {
        return fetch(constants.SERVER + 'chat/' + chatId + '/message', {
            method: 'post',
            body: JSON.stringify(message),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json());

    }

    findMessagesForChat(chatId) {
        return fetch(constants.SERVER + 'chat/' + chatId + '/message').then(response => (response.json()));

    }
}