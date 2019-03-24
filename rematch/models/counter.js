import { createModel } from "@rematch/core";
import { message } from "antd";
import firebase from "../../firebase";
import _ from "lodash";
import moment from "moment";


const initialState = {
  all: [],
  isBusy: false
};

const counter = createModel({
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
    fetchCounterSuccessfully: (state, payload) => {
      return {
        ...state,
        all: payload
      };
    }
  },
  effects: dispatch => ({
    async fetchCounter(payload, rootState) {
      try {
        this.updateBusyState(true);
        const querySnapshot = await firebase
          .firestore()
          .collection("counter")
          .get();
        const counter = [];
        querySnapshot.forEach(doc => {
          counter.push({ ...doc.data(), id: doc.id });
        });

        this.fetchCounterSuccessfully(counter);
      } catch (er) {
        console.log(er);
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
  })
});

export default counter;
