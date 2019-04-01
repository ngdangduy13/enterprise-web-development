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
    fetchFacultiesSuccessfully: (state, payload) => {
      return {
        ...state,
        all: payload
      };
    }
  },
  effects: dispatch => ({
    async fetchFaculties(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("faculties")
          .get();
        const faculties = [];
        querySnapshot.forEach(doc => {
          faculties.push({ ...doc.data(), id: doc.id });
        });

        this.fetchFacultiesSuccessfully(faculties);
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async addFaculty(payload, rootState) {
      try {
        this.updateBusyState(true);
        const data = {
          name: payload.name,
          address: payload.address,
          createdDate: moment().valueOf()
        };

        const eventRef = firebase.firestore().collection("faculties");
        const result = await eventRef.add(data);
        message.success("Add faculty successfully");
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
