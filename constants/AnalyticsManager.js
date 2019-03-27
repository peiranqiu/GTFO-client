
import Mixpanel from 'react-native-mixpanel'

import * as constants from "./constant";
class AnalyticsManager {
    constructor() {
        this.mixpanel = callback => Mixpanel.default.sharedInstanceWithToken(constants.MIXPANEL_TOKEN)
            .then(() => callback())
            .catch(error => console.log('Failed to initialize Mixpanel: ', error));
    }

    track = async (event) => {
        this.mixpanel(() => Mixpanel.track(event));
    };
}

export default new AnalyticsManager();