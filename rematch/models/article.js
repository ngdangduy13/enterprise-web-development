import { createModel } from "@rematch/core";
import { message } from 'antd';
import firebase from '../../firebase';
import Router from 'next/router';


const initialState = {
    all: [],

    isBusy: false
}

const article = createModel({
    state: {
        all: [],

        isBusy: false
    },
    reducers: {
        updateBusyState: (state, payload) => {
            return {
                ...state,
                isBusy: payload
            }
        },
        fetchArticleSuccessfully: (state, payload) => {
            return {
                ...state,
                ...payload
            }
        },
    },
    effects: (dispatch) => ({
        // handle state changes with impure functions.
        // use async/await for async actions
        async uploadArticle(payload, rootState) {
            try {
                this.updateBusyState(true);
                const docRef = await firebase.firestore().collection('articles').add({
                    title: payload.title,
                    description: payload.description,
                    timestamp: new Date(),
                    studentId: rootState.userProfile.uid,
                    isPublish: false
                });
                const storageRef = await firebase.storage().ref().child(`${docRef.id}.docx`).put(payload.file)
                message.success('Upload successfully');
            } catch (er) {
                console.log(er)
                message.error(er.message);
            } finally {
                this.updateBusyState(false);
            }
        },
        async fetchArticles(payload, rootState) {
            try {
                this.updateBusyState(true);
                const querySnapshot = await firebase.firestore().collection('articles').where("studentId", "==", rootState.userProfile.uid).get();
                console.log(rootState)
                const result = []
                querySnapshot.forEach(doc => {
                    result.push(doc.data())
                })
                console.log(result)
                this.fetchArticleSuccessfully(result)
            } catch (er) {
                console.log(er)
                message.error(er.message);
            } finally {
                this.updateBusyState(false);
            }
        }
    })
});

export default article;