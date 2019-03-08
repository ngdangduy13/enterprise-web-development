import { createModel } from "@rematch/core";
import { message } from 'antd';
import firebase from '../../firebase';


const profileModel = createModel({
    state: {
        isBusy: false
    },
    reducers: {
        loginSuccessfully: (state, payload) => {
            return {
                ...state,
                ...payload
            }
        },
        updateBusyState: (state, payload) => {
            return {
                ...state,
                isBusy: payload
            }
        },
    },
    effects: (dispatch) => ({
        // handle state changes with impure functions.
        // use async/await for async actions
        async loginFirebase(payload, rootState) {
            try {
                this.updateBusyState(true);
                const user = await firebase.auth().signInWithEmailAndPassword(
                    payload.email,
                    payload.password
                );
                console.log(user)

            } catch (er) {
                message.error(er.message);
            } finally {
                this.updateBusyState(false);
            }
        }
    })
});

export default profileModel;