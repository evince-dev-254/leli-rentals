import ImageKit from 'imagekit-javascript';

const publicKey = process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'public_qvHAZC5VBwvFfMvF6CxulrvgOlM=';
const urlEndpoint = process.env.EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/jsmasterypaul';
const authEndpoint = 'https://www.leli.rentals/api/imagekit/auth';

export const imagekit = new ImageKit({
    publicKey,
    urlEndpoint,
});

export const uploadImage = async (uri: string, fileName: string, folder: string = '/listings') => {
    try {
        // 1. Fetch authentication parameters from our server
        const authResponse = await fetch(authEndpoint);
        if (!authResponse.ok) throw new Error('Failed to fetch ImageKit auth parameters');
        const authData = await authResponse.json();
        const { signature, expire, token } = authData;

        // 2. Prepare the file
        const response = await fetch(uri);
        const blob = await response.blob();

        // 3. Perform the upload
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result as string;

                imagekit.upload({
                    file: base64data,
                    fileName: fileName,
                    folder: folder,
                    signature,
                    token,
                    expire,
                }, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            };
        });
    } catch (error) {
        console.error('ImageKit Upload Error:', error);
        throw error;
    }
};
