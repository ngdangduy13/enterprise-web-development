import app from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';


const config = {
    apiKey: "AIzaSyA-4zvmziXMfjyXUKNI7hN6nl4aoezt2wE",
    authDomain: "test-5b256.firebaseapp.com",
    databaseURL: "https://test-5b256.firebaseio.com",
    projectId: "test-5b256",
    storageBucket: "test-5b256.appspot.com",
    messagingSenderId: "833147250747"
};
if (!app.apps.length) {
    app.initializeApp(config);
}
export default app;