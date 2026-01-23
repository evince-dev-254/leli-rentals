import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogle = () => {
    GoogleSignin.configure({
        webClientId: '323268122303-kdeirpoi308p5p90jcau0n1pci5fvrm5.apps.googleusercontent.com',
        offlineAccess: true,
    });
};

export const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    return await GoogleSignin.signIn();
};

export { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
