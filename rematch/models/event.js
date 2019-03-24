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
          .orderBy("timestamp", "desc")
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
          closureDate: payload.closureDate,
          finalClosureDate: payload.finalClosureDate,
          name: payload.name,
          facultyId: rootState.userProfile.facultyId,
          description:
            payload.description !== undefined ? payload.description : "",
          timestamp: moment().format("LL")
        };

        const eventRef = firebase.firestore().collection("events");
        const result = await eventRef.add(data);

        const counterData = {
          contributions: 0,
          contributors: 0,
          contributionsWithoutComment: 0,
          contributionsByFaculty: {}
        };
        const counterRef = firebase.firestore().collection("counter");
        await counterRef.doc(result.id).set(counterData);

        message.success("Add event successfully");
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async updateEvent(payload, rootState) {
      try {
        this.updateBusyState(true);
        const data = {
          closureDate: payload.closureDate,
          finalClosureDate: payload.finalClosureDate,
          name: payload.name,
          description:
            payload.description !== undefined ? payload.description : "",
          timestamp: moment().format("LL")
        };

        const eventRef = firebase.firestore().collection("events");
        await eventRef.doc(payload.id).set(data, { merge: true });

        message.success("Update event successfully");
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
