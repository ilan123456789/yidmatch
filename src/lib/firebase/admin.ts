import * as admin from "firebase-admin";

const isFirebaseAdminConfigured = (): boolean => {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
};

export function getFirebaseAdmin() {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  if (admin.apps.length === 0) {
    try {
      const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (error) {
      console.warn("Failed to initialize Firebase Admin SDK:", error);
      return null;
    }
  }

  return {
    adminAuth: admin.auth(),
    adminDb: admin.firestore(),
    adminStorage: admin.storage(),
  };
}
