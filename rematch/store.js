import { init } from '@rematch/core';
import userProfile from './models/userProfile';
import article from './models/article';


export const initStore = (initialState) => {
    return init({
        models: {
            userProfile,
            article
        },
        redux: {
            initialState
        }
    });
};

export default initStore;