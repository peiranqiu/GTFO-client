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
}