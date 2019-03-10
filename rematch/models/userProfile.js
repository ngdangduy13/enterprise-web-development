import { createModel } from "@rematch/core";
import { message } from 'antd';
import firebase from '../../firebase';
import Router from 'next/router';
import 'isomorphic-unfetch';


const initialState = {
    email: '',
    uid: '',
    fullname: '',
    role: '',

    isBusy: false
}

const profileModel = createModel({
    state: {
        email: '',
        uid: '',
        fullname: '',
        role: '',

        isBusy: false
    },
    reducers: {
        loginSuccessfully: (state, payload) => {
            return {
                ...state,
                ...payload
            }
        },
        logout: (state, payload) => {
            return {
                ...initialState,
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
                const resultLogin = await firebase.auth().signInWithEmailAndPassword(
                    payload.email,
                    payload.password
                );
                const userRef = await firebase.firestore().collection('users').doc(resultLogin.user.uid).get();
                const user = {
                    email: resultLogin.user.email,
                    uid: resultLogin.user.uid,
                    fullname: userRef.data().fullname,
                    role: userRef.data().role
                }
                const idToken = await firebase.auth().currentUser.getIdToken();
                fetch('/api/login', {
                    method: 'POST',
                    // eslint-disable-next-line no-undef
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                    credentials: 'same-origin',
                    body: JSON.stringify({ idToken })
                })
                this.loginSuccessfully(user)
                Router.push('/admin')
                message.success('Login successfully');
            } catch (er) {
                message.error(er.message);
            } finally {
                this.updateBusyState(false);
            }
        },
        async logoutFirebase(payload, rootState) {
            try {
                this.updateBusyState(true);
                const result = await firebase.auth().signOut();
                console.log(result);
                this.logout();
            } catch (er) {
                message.error(er.message);
            } finally {
                this.updateBusyState(false);
            }
        }
    })
});

export default profileModel;