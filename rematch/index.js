import { init } from '@rematch/core';
import userProfile from './models/userProfile';
import article from './models/article';


export const initStore = () => {
    return init({
        models: {
            userProfile,
            article
        }
    });
};

export default initStore;