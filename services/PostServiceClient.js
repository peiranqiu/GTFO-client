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

    findIfInterested(businessId, userId) {
        return fetch(constants.SERVER + 'interested/' + businessId + '/' + userId).then(response => response.json());
    }

    userLikesBusiness(businessId, user) {
        return fetch(constants.SERVER + 'interested/' + businessId, {
            method: 'post',
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response);
    }

    findFollowersForBusiness(businessId) {
        return fetch(constants.SERVER + 'interested/business/' + businessId).then(response => (response.json()));
    }

    findBusinessById(businessId) {
        return fetch(constants.SERVER + 'business/' + businessId).then(response => (response.json()));
    }
}