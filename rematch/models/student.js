import { createModel } from "@rematch/core";
import { message } from "antd";
import firebase from "../../firebase";
import Router from "next/router";
import moment from "moment";
import _ from "lodash";

const initialState = {
  all: [],
  selectedArticle: {},
  isBusy: false
};

const student = createModel({
  state: {
    all: [],
    selectedArticle: {},
    isBusy: false
  },
  reducers: {
    updateBusyState: (state, payload) => {
      return {
        ...state,
        isBusy: payload
      };
    },
    fetchStudentsSuccessfully: (state, payload) => {
      return {
        ...state,
        all: payload
      };
    }
  },
  effects: dispatch => ({
    async fetchStudents(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("users")
          .where("faculityId", "==", rootState.userProfile.faculityId)
          .where("role", "==", "STUDENT")
          .get();
        const students = [];
        querySnapshot.forEach(doc => {
          students.push({ ...doc.data(), id: doc.id });
        });
        message.success("Fetching articles successfully");

        this.fetchStudentsSuccessfully(students);
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async addStudent(payload, rootState) {
      try {
        this.updateBusyState(true);
        const data = {
          email: payload.email,
          address: payload.address,
          dob: payload.dob,
          faculityId: rootState.userProfile.faculityId,
          role: "STUDENT",
          isActive: true,
          fullname: payload.fullname
        };

        const result = await firebase
          .auth()
          .createUserWithEmailAndPassword(payload.email, payload.password);
        const articleRef = firebase.firestore().collection("users");
        const resultRef = await articleRef.doc(result.user.uid).set(data);

        message.success("Add student successfully");
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    }
  })
});

export default student;
