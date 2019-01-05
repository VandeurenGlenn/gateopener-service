import firebase from 'firebase';
import { Gpio } from 'onoff';

const config = {
  apiKey: "AIzaSyBLEGKN_1eCfD_G1P-VRX2l18Dui8psBwY",
  authDomain: "gateopener-service.firebaseapp.com",
  databaseURL: "https://gateopener-service.firebaseio.com",
  projectId: "gateopener-service"
};

firebase.initializeApp(config);

const app = firebase.app()

const gate = new Gpio(21, 'out');

export default (user => {
  if (!user) user = {};
  if (!user.name) {
    user.name = process.argv.indexOf('name')
    user.name = process.argv[user.name + 1];
  }
  if (!user.password) {
    user.password = process.argv.indexOf('password')
    user.password = process.argv[user.password + 1];
  }
  firebase.auth().onAuthStateChanged(user => {
    if (user) firebase.database().ref(`${user.uid}`).on('child_changed', snap => {
      gate.writeSync(1);
      setTimeout(() => {
        gate.writeSync(0)
      }, 200);
    });
  });
  firebase.auth().signInWithEmailAndPassword(user.name, user.password);

})()
