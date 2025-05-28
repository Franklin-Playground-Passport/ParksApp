import { useAuthRequest } from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { useEffect } from "react";
import { firebaseApp } from "../config/firebase";

WebBrowser.maybeCompleteAuthSession();

let googlePromptAsync: (() => Promise<any>) | null = null;

export function useGoogleAuth() {
  const [request, response, promptAsync] = useAuthRequest({
    webClientId:
      "364945832514-k85v32qdmarbre3nscoltqi5notcj8be.apps.googleusercontent.com",
    iosClientId:
      "364945832514-k85v32qdmarbre3nscoltqi5notcj8be.apps.googleusercontent.com",
  });

  useEffect(() => {
    googlePromptAsync = promptAsync;
  }, [promptAsync]);

  useEffect(() => {
    if (response?.type === "success") {
      const { idToken, accessToken } = (response.authentication || {}) as {
        idToken: string;
        accessToken: string;
      };
      if (idToken) {
        const auth = getAuth(firebaseApp);
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        signInWithCredential(auth, credential).catch(() => {});
      }
    }
  }, [response]);

  return { promptAsync, request, response };
}

export async function signInWithGoogle() {
  if (!googlePromptAsync) {
    throw new Error("Google auth not initialized");
  }
  const result = await googlePromptAsync();
  if (result.type !== "success" || !result.authentication) {
    throw new Error("Google Sign-In failed");
  }
  const { idToken, accessToken } = result.authentication;
  const auth = getAuth(firebaseApp);
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
}

export async function signInWithGoogleWeb() {
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
