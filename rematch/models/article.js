import { createModel } from "@rematch/core";
import { message } from 'antd';
import firebase from '../../firebase';
import Router from 'next/router';
import moment from 'moment';


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
                all: payload
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
                    timestamp: moment().format('LL'),
                    studentId: rootState.userProfile.uid,
                    isPublish: false
                });
                console.log(rootState)
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
                const articles = []
                querySnapshot.forEach(doc => {
                    articles.push({ ...doc.data(), id: doc.id })
                })
                message.success('Fetching articles successfully');

                this.fetchArticleSuccessfully(articles)
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