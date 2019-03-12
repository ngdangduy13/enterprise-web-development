import { createModel } from "@rematch/core";
import { message } from "antd";
import firebase from "../../firebase";
import Router from "next/router";
import moment from "moment";
import _ from "lodash";

const initialState = {
  all: [],
  isBusy: false
};

const event = createModel({
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
    fetchEventsSuccessfully: (state, payload) => {
      return {
        ...state,
        all: payload
      };
    }
  },
  effects: dispatch => ({
    async fetchEvents(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("events")
          .where("faculityId", "==", rootState.userProfile.faculityId)
          .get();
        const events = [];
        querySnapshot.forEach(doc => {
          events.push({ ...doc.data(), id: doc.id });
        });
        message.success("Fetch events successfully");

        this.fetchEventsSuccessfully(events);
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async addEvent(payload, rootState) {
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

export default event;
