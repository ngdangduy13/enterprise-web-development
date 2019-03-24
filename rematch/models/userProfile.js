import { createModel } from "@rematch/core";
import { message } from "antd";
import firebase from "../../firebase";
import Router from "next/router";
import "isomorphic-unfetch";
import * as qs from "qs";
import * as jsCookie from "js-cookie";

const initialState = {
  email: "",
  uid: "",
  fullname: "",
  role: "",
  facultyId: "",

  isBusy: false
};

const profileModel = createModel({
  state: {
    email: "",
    uid: "",
    fullname: "",
    role: "",
    facultyId: "",

    isBusy: false
  },
  reducers: {
    loginSuccessfully: (state, payload) => {
      return {
        ...state,
        ...payload
      };
    },
    logoutSuccessfully: (state, payload) => {
      return {
        ...initialState
      };
    },
    updateBusyState: (state, payload) => {
      return {
        ...state,
        isBusy: payload
      };
    }
  },
  effects: dispatch => ({
    // handle state changes with impure functions.
    // use async/await for async actions

    async findUser(payload, rootState) {
      try {
        this.updateBusyState(true);
        const userRef = await firebase
          .firestore()
          .collection("users")
          .doc(payload)
          .get();
        const user = {
          email: userRef.data().email,
          fullname: userRef.data().fullname,
          role: userRef.data().role,
          facultyId: userRef.data().facultyId
        };
        this.loginSuccessfully(user);
      } catch (er) {
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async loginFirebase(payload, rootState) {
      try {
        this.updateBusyState(true);
        const resultLogin = await firebase
          .auth()
          .signInWithEmailAndPassword(payload.email, payload.password);
        const userRef = await firebase
          .firestore()
          .collection("users")
          .doc(resultLogin.user.uid)
          .get();

        if (!userRef.data().isActive) {
          message.error(
            "Your account is locked. Please contact admin for more information"
          );
          return;
        }

        const user = {
          email: userRef.data().email,
          uid: resultLogin.user.uid,
          fullname: userRef.data().fullname,
          role: userRef.data().role,
          facultyId: userRef.data().facultyId
        };

        const idToken = await firebase.auth().currentUser.getIdToken();
        await fetch("/api/users/login", {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ idToken })
        });

        this.loginSuccessfully(user);
        const role = userRef.data().role;
        const callbackUrl = qs.parse(window.location.search, {
          ignoreQueryPrefix: true
        }).callbackUrl;
        if (callbackUrl) {
          Router.push(callbackUrl);
        } else {
          if (role === "STUDENT") {
            Router.push("/student/view-article");
          } else if (role === "ADMIN") {
            Router.push("/admin/dashboard");
          } else if (role === "COORD") {
            Router.push("/coordinator/view-student");
          } else {
            Router.push("/error?statusCode=401");
          }
        }
        message.success("Login successfully");
      } catch (er) {
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    },
    async logoutFirebase(payload, rootState) {
      try {
        this.updateBusyState(true);
        firebase.auth().signOut();

        jsCookie.remove("token", { domain: "localhost" });

        Router.push("/login");

        this.logoutSuccessfully();
      } catch (er) {
        message.error(er.message);
      } finally {
        this.updateBusyState(false);
      }
    }
  })
});

export default profileModel;
