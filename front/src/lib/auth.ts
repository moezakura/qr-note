import firebase from 'firebase';

export default class Auth {
  static getUser(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      try {
        firebase.auth().onAuthStateChanged(user => {
          if (!user) {
            reject();
            return;
          }
          resolve(user);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
