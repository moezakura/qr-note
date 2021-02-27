<template>
  <v-card>
    <v-card-title>サインイン</v-card-title>
    <v-card-text>
      <p>
        アプリケーションの利用にはGoogleアカウントでのサインインが必要です。
      </p>
      <p>
        Googleアカウントのサインインを押した時点で<a>利用規約</a>と<a>プライバシーポリシー</a>に同意したものとみなします。
      </p>
      <v-btn block x-large color="primary" @click="signIn()">
        <v-icon class="mr-3">mdi-google</v-icon>
        SignIn
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';
import firebase from 'firebase';

export default defineComponent({
  setup(_: {}, context: SetupContext) {
    const signIn = async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

      try {
        const result = await firebase.auth().signInWithPopup(provider);
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        console.log(result);

        const router = context.root.$router;
        router.push('/home/');
      } catch (e) {
        console.error(e);
      }
    };

    return {
      signIn,
    };
  },
});
</script>

<style lang="scss" scoped></style>
