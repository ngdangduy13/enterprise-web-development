import app from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyAiabLtMwcG3f_qM8uwD9mmhjXpKJaaUWA",
    authDomain: "testweb-3595a.firebaseapp.com",
    databaseURL: "https://testweb-3595a.firebaseio.com",
    projectId: "testweb-3595a",
    storageBucket: "testweb-3595a.appspot.com",
    messagingSenderId: "331534249876"
};
if (!app.apps.length) {
    app.initializeApp(config);
}
export default app;
