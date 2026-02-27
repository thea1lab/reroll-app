import { createContext, useContext, useEffect, useState } from 'react';
import auth, { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface AuthContextValue {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();

    if (!response.data?.idToken) {
      throw new Error('Google Sign-In failed: no ID token');
    }

    const credential = auth.GoogleAuthProvider.credential(response.data.idToken);
    await auth().signInWithCredential(credential);
  };

  const signOut = async () => {
    await auth().signOut();
    await GoogleSignin.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
