import * as dotenv from 'dotenv';
dotenv.config();


export default {
    firebaseConfig: {
        type: process.env.FIREBASE_TYPE,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    }
}