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

    createUser(token) {
        // alert("creating");
        return fetch(constants.SERVER + 'instagram/user/' + token, {
            method: 'post'
        }).then(response => (response.json()));
    }
}