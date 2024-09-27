import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile, // Importar la función para actualizar el perfil del usuario
} from "firebase/auth";
import { auth } from "../firebase";

const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Registrar un usuario con email y contraseña
  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Iniciar sesión con email y contraseña
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Iniciar sesión con Google
  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  // Cerrar sesión
  const logout = () => signOut(auth);

  // Restablecer la contraseña
  const resetPassword = async (email) => sendPasswordResetEmail(auth, email);

  // Actualizar el perfil del usuario (nombre, foto de perfil, etc.)
  const updateUserProfile = async (user, profileData) => {
    try {
      await updateProfile(user, profileData); // Actualizar el perfil en Firebase
      setUser({ ...user, ...profileData });   // Actualizar el estado local del usuario
      console.log("Perfil actualizado:", profileData);
    } catch (error) {
      console.log("Error al actualizar el perfil:", error.message);
    }
  };

  // Mantener la sesión del usuario y detectar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        logout,
        loading,
        loginWithGoogle,
        resetPassword,
        updateUserProfile, // Exponer la función para actualizar el perfil
      }}
    >
      {children}
    </authContext.Provider>
  );
}
