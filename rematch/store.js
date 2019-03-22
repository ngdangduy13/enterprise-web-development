import { init } from '@rematch/core';
import userProfile from './models/userProfile';
import student from './models/student';
import event from './models/event';
import user from './models/user';
import article from './models/article';
import faculty from './models/faculty';


export const initStore = (initialState) => {
    return init({
        models: {
            userProfile,
            article,
            student,
            event,
            user,
            faculty
        },
        redux: {
            initialState
        }
    });
};

export default initStore;