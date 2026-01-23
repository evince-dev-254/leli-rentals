export const configureGoogle = () => {
    // No-op on web
};

export const signInWithGoogle = async () => {
    throw new Error('Google Sign-In is only supported on Android/iOS via this plugin.');
};

export const GoogleSignin = {
    Size: { Wide: 'wide', Icon: 'icon', Standard: 'standard' },
    Color: { Dark: 'dark', Light: 'light' }
};

export const GoogleSigninButton: any = () => null;
