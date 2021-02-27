import firebase from 'firebase';
import { auth } from '~/lib/firebase';

export default class Auth {
  static getUser(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      try {
        auth.onAuthStateChanged(user => {
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
