import { init } from '@rematch/core';
import userProfile from './models/userProfile';


export const initStore = () => {
    return init({
        models: {
            userProfile
        }
    });
};

export default initStore;