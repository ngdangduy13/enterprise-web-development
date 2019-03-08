import app from "firebase/app";
import 'firebase/auth';


const config = {
  apiKey: "AIzaSyA-4zvmziXMfjyXUKNI7hN6nl4aoezt2wE",
  authDomain: "test-5b256.firebaseapp.com",
  databaseURL: "https://test-5b256.firebaseio.com",
  projectId: "test-5b256",
  storageBucket: "test-5b256.appspot.com",
  messagingSenderId: "833147250747"
};
class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
  }

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}

export default Firebase;
