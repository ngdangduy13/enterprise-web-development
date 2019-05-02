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
  publishedArticles: [],
  isBusy: false
};

const uploadFile = (id, file) => {
  console.log(file);
  const data = new FormData();
  data.append("file", file);
  data.append("filename", file.name);
  data.append("id", id);
  return fetch("/api/articles/upload", {
    method: "POST",
    // headers: new Headers({ "Content-Type": "application/x-www-form-urlencoded" }),
    credentials: "same-origin",
    body: data
  });
};

const article = createModel({
  state: {
    all: [],
    selectedArticle: {},
    uploadedArticles: [],
    publishedArticles: [],

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
    fetchPublishedArticleSuccessfully: (state, payload) => {
      return {
        ...state,
        publishedArticles: payload
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
    }
  },
  effects: dispatch => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async uploadArticle(payload, rootState) {
      try {
        this.updateBusyState(true);
        const facultyId = rootState.userProfile.facultyId;
        const data = {
          title: payload.title,
          description:
            payload.description !== undefined ? payload.description : "",
          timestamp: moment().valueOf(),
          studentId: rootState.userProfile.uid,
          isPublish: false,
          eventId: payload.eventId,
          facultyId: facultyId,
          status: "Unpublish"
        };
        const articleRef = firebase.firestore().collection("articles");
        const resultRef = await articleRef.add(data);

        const pathsForDownload = new Array();
        const paths = { documents: new Array(), images: new Array() };

        for (const file of payload.files) {
          const t = await uploadFile(resultRef.id, file);
          const response = await t.json();
          console.log(response.file);
          pathsForDownload.push({
            path: response.file,
            name: file.name,
            uid: file.uid,
            type: file.type
          });
          if (
            file.name.split(".")[1] === "doc" ||
            file.name.split(".")[1] === "docx"
          ) {
            paths.documents.push(response.file);
          } else {
            paths.images.push(response.file);
          }
        }

        articleRef.doc(resultRef.id).set(
          {
            paths,
            pathsForDownload
          },
          { merge: true }
        );

        const facultyEmails = await firebase
          .firestore()
          .collection("users")
          .where("facultyId", "==", facultyId)
          .where("role", "==", "COORD")
          .get();
        const mails = [];
        facultyEmails.forEach(doc => {
          mails.push(doc.data().email);
        });

        fetch("/api/articles/send_email", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({
            mail: mails,
            subject: "New uploaded articles",
            html: `<p>There is new article updated with title: ${
              data.title
            } and by: ${
              rootState.userProfile.email
            }. Please make comment within 14 days</p>`
          })
        });

        const counterRef = firebase.firestore().collection("counter");
        const counterResult = await counterRef.doc(payload.eventId).get();
        const counterData = {
          contributions: counterResult.data().contributions + 1,
          contributionsByFaculty: {
            [facultyId]:
              counterResult.data().contributionsByFaculty[facultyId] !==
              undefined
                ? counterResult.data().contributionsByFaculty[facultyId] + 1
                : 1
          },
          contributionsWithoutComment:
            counterResult.data().contributionsWithoutComment + 1,
          contributors:
            _.findIndex(
              rootState.article.all,
              i => i.eventId === payload.eventId
            ) === -1
              ? counterResult.data().contributors + 1
              : counterResult.data().contributors === 0
              ? 1
              : counterResult.data().contributors,
          contributorsByFaculty: {
            [facultyId]:
              counterResult.data().contributorsByFaculty[facultyId] !==
              undefined
                ? _.findIndex(
                    rootState.article.all,
                    i => i.eventId === payload.eventId
                  ) === -1
                  ? counterResult.data().contributors + 1
                  : counterResult.data().contributors === 0
                  ? 1
                  : counterResult.data().contributors
                : 1
          }
        };
        counterRef.doc(payload.eventId).set(counterData, { merge: true });

        this.fetchArticles();
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
          .orderBy("timestamp", "desc")
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
          .orderBy("timestamp", "desc")
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
    async fetchPublishedArticles(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("articles")
          .where("status", "==", "Published")
          .orderBy("timestamp", "desc")
          .get();
        const articles = [];
        querySnapshot.forEach(doc => {
          articles.push({ ...doc.data(), id: doc.id });
        });
        message.success("Fetch articles successfully");

        this.fetchPublishedArticleSuccessfully(articles);
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async fetchAllArticles(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("articles")
          .orderBy("timestamp", "desc")
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
    async makeComment(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("articles")
          .doc(rootState.article.selectedArticle.id)
          .set(
            {
              status:
                rootState.article.selectedArticle.status === "Published"
                  ? rootState.article.selectedArticle.status
                  : "Processing",
              comments: rootState.article.selectedArticle.comments
                ? [
                    ...rootState.article.selectedArticle.comments,
                    { html: payload.comment, timestamp: moment().valueOf() }
                  ]
                : [{ html: payload.comment, timestamp: moment().valueOf() }]
            },
            { merge: true }
          );

        const counterRef = firebase.firestore().collection("counter");
        const counterResult = await counterRef.doc(payload.eventId).get();
        const counterData = {
          contributionsWithoutComment:
            counterResult.data().contributionsWithoutComment - 1
        };
        counterRef.doc(payload.eventId).set(counterData, { merge: true });
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
          .set(
            {
              status: "Published"
            },
            { merge: true }
          );
        const newList = rootState.article.uploadedArticles.map(i => {
          if (i.id === payload.id) {
            return { ...i, status: "Published" };
          }
          return { ...i };
        });
        this.fetchUploadedArticleSuccessfully(newList);
        message.success("Publish article successfully");
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async downloadArticle(payload, rootState) {
      try {
        this.updateBusyState(true);
        Router.push(`/api/articles/download/${payload.id}`);
        // fetch(`/api/articles/download/${payload.id}`, {
        //   method: "GET",
        //   // headers: new Headers({ "Content-Type": "application/json" }),
        //   credentials: "same-origin"
        // });
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async updateArticle(payload, rootState) {
      try {
        this.updateBusyState(true);

        const pathsForDownload = new Array();
        const paths = { documents: new Array(), images: new Array() };

        for (const file of payload.files) {
          if (file.status !== "done") {
            const t = await uploadFile(payload.id, file);
            const response = await t.json();
            pathsForDownload.push({
              path: response.file,
              name: file.name,
              uid: file.uid,
              type: file.type
            });
            if (
              file.name.split(".")[1] === "doc" ||
              file.name.split(".")[1] === "docx"
            ) {
              paths.documents.push(response.file);
            } else {
              paths.images.push(response.file);
            }
          } else {
            pathsForDownload.push({
              path: file.path,
              name: file.name,
              uid: file.uid,
              type: file.type
            });
            if (
              file.name.split(".")[1] === "doc" ||
              file.name.split(".")[1] === "docx"
            ) {
              paths.documents.push(file.path);
            } else {
              paths.images.push(file.path);
            }
          }
        }
        const data = {
          title: payload.title,
          description:
            payload.description !== undefined ? payload.description : "",
          timestamp: moment().valueOf(),
          pathsForDownload,
          paths
        };

        const articleRef = firebase.firestore().collection("articles");
        articleRef.doc(payload.id).set(
          {
            ...data
          },
          { merge: true }
        );

        this.fetchArticles();

        message.success("Update successfully");
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
