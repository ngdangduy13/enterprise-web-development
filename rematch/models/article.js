import { createModel } from "@rematch/core";
import { message } from 'antd';
import firebase from '../../firebase';
import Router from 'next/router';
import moment from 'moment';


const initialState = {
    all: [],

    isBusy: false
}

const uploadToFirebase = (id, file) => {
    firebase.storage().ref().child(`${id}/${file.name}`).put(file)
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
                    description: payload.description === undefined ? payload.description : '',
                    timestamp: moment().format('LL'),
                    studentId: rootState.userProfile.uid,
                    isPublish: false
                });
                payload.files.forEach(async (file) => {
                    await uploadToFirebase(docRef.id, file)
                })
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