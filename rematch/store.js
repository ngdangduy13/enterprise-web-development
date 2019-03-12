import { init } from '@rematch/core';
import userProfile from './models/userProfile';
import student from './models/student';
import article from './models/article';


export const initStore = (initialState) => {
    return init({
        models: {
            userProfile,
            article,
            student
        },
        redux: {
            initialState
        }
    });
};

export default initStore;