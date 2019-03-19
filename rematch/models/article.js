import { createModel } from "@rematch/core";
import { message } from "antd";
import firebase from "../../firebase";
import Router from "next/router";
import moment from "moment";
import _ from "lodash";

const initialState = {
  all: [],
  uploadedArticles: [],
  selectedArticle: {},
  isBusy: false
};

const uploadToFirebase = (id, file) => {
  firebase
    .storage()
    .ref()
    .child(`${id}/${file.name}`)
    .put(file);
};

const article = createModel({
  state: {
    all: [],
    selectedArticle: {},
    uploadedArticles: [],
    isBusy: false
  },
  reducers: {
    updateBusyState: (state, payload) => {
      return {
        ...state,
        isBusy: payload
      };
    },
    fetchArticleSuccessfully: (state, payload) => {
      return {
        ...state,
        all: payload
      };
    },
    fetchUploadedArticleSuccessfully: (state, payload) => {
      return {
        ...state,
        uploadedArticles: payload
      };
    },
    findArticleSuccessfully: (state, payload) => {
      return {
        ...state,
        selectedArticle: payload
      };
    },
    deleteArticleSuccessfully: (state, payload) => {
      const newArticles = state.all.slice();
      _.remove(newArticles, i => i.id === payload.id);
      return {
        ...state,
        all: newArticles
      };
    },
  },
  effects: dispatch => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async uploadArticle(payload, rootState) {
      try {
        this.updateBusyState(true);
        const data = {
          title: payload.title,
          description:
            payload.description !== undefined ? payload.description : "",
          timestamp: moment().format("LL"),
          studentId: rootState.userProfile.uid,
          isPublish: false,
          eventId: payload.eventId,
          facultyId: rootState.userProfile.facultyId,
          status: 'Unpublish'
        };
        const articleRef = firebase.firestore().collection("articles");
        const resultRef = await articleRef.add(data);

        await payload.files.forEach(async file => {
          await uploadToFirebase(resultRef.id, file);
        });
        const paths = payload.files.map(item => `${resultRef.id}/${item.name}`);
        articleRef.doc(resultRef.id).set(
          {
            paths
          },
          { merge: true }
        );

        message.success("Upload successfully");
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async deleteArticle(payload, rootState) {
      try {
        this.updateBusyState(true);
        await firebase
          .firestore()
          .collection("articles")
          .doc(payload.id)
          .delete();
        // await firebase.storage().ref().child(`${payload.id}`).delete()
        this.deleteArticleSuccessfully({ id: payload.id });
        message.success("Delete successfully");
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async fetchArticles(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("articles")
          .where("studentId", "==", rootState.userProfile.uid)
          .get();
        const articles = [];
        querySnapshot.forEach(doc => {
          articles.push({ ...doc.data(), id: doc.id });
        });
        message.success("Fetch articles successfully");

        this.fetchArticleSuccessfully(articles);
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async fetchUploadedArticles(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("articles")
          .where("facultyId", "==", rootState.userProfile.facultyId)
          .get();
        const articles = [];
        querySnapshot.forEach(doc => {
          articles.push({ ...doc.data(), id: doc.id });
        });
        message.success("Fetch articles successfully");

        this.fetchUploadedArticleSuccessfully(articles);
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async makeComment(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("articles")
          .doc(rootState.article.selectedArticle.id)
          .set({
            status: 'Processing',
            comments: rootState.article.selectedArticle.comments
              ? [...rootState.article.selectedArticle.comments, { html: payload.comment, timestamp: moment().format("LL") }]
              : [{ html: payload.comment, timestamp: moment().format("LL") }]
          }, { merge: true });
        message.success("Add comment successfully");
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async publishArticle(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("articles")
          .doc(payload.id)
          .set({
            status: 'Published',
          }, { merge: true });
        const newList = rootState.article.uploadedArticles.map(i => {
          if (i.id === payload.id) {
            return { ...i, status: 'Published' };
          }
          return { ...i };
        });
        this.fetchUploadedArticleSuccessfully(newList)
        message.success("Publish article successfully");
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    }
  })
});

export default article;
