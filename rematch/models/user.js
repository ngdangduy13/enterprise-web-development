import { createModel } from "@rematch/core";
import { message } from "antd";
import firebase from "../../firebase";
import _ from "lodash";
import moment from "moment";

const initialState = {
  all: [],
  isBusy: false
};

const student = createModel({
  state: {
    all: [],
    isBusy: false
  },
  reducers: {
    updateBusyState: (state, payload) => {
      return {
        ...state,
        isBusy: payload
      };
    },
    fetchUsersSuccessfully: (state, payload) => {
      return {
        ...state,
        all: payload
      };
    }
  },
  effects: dispatch => ({
    async fetchUsers(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("users")
          .get();
        const users = [];
        querySnapshot.forEach(doc => {
          users.push({ ...doc.data(), id: doc.id });
        });
        message.success("Fetch users successfully");

        this.fetchUsersSuccessfully(users);
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async addUser(payload, rootState) {
      try {
        this.updateBusyState(true);
        const data = {
          email: payload.email,
          address: payload.address,
          dob: payload.dob,
          facultyId: payload.facultyId === undefined ? "" : payload.facultyId,
          role: payload.role,
          isActive: true,
          fullname: payload.fullname,
          timestamp: moment().valueOf()
        };

        const result = await firebase
          .auth()
          .createUserWithEmailAndPassword(payload.email, payload.password);
        const articleRef = firebase.firestore().collection("users");
        const resultRef = await articleRef.doc(result.user.uid).set(data);

        message.success("Add user successfully");
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async toggleActiveUser(payload, rootState) {
      try {
        this.updateBusyState(true);
        let isActive;
        const newList = rootState.user.all.map(user => {
          if (user.id === payload.id) {
            isActive = !user.isActive;
            return { ...user, isActive };
          }
          return { ...user };
        });
        const userRef = firebase.firestore().collection("users");
        const resultRef = userRef.doc(payload.id).set(
          {
            isActive
          },
          { merge: true }
        );
        this.fetchUsersSuccessfully(newList);
        message.success("Change status of user successfully");
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
