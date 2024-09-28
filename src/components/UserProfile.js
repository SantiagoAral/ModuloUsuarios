import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase'; // Cambia la importación aquí

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = auth.currentUser?.uid; // Usa auth para obtener el UID

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!userId) {
                setLoading(false);
                return; // Salir si no hay usuario autenticado
            }
            try {
                const userDoc = await db.collection('users').doc(userId).get(); // Usa db para acceder a Firestore
                
                if (userDoc.exists) {
                    setUserData(userDoc.data());
                } else {
                    console.log("No such document!");
                    setUserData(null);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    // Manejo del estado de carga
    if (loading) {
        return <div>Loading...</div>; // Muestra un indicador de carga
    }

    // Verificación de datos de usuario
    if (userData) {
        return (
            <div>
                <h1>Welcome, {userData.displayName || "User"}</h1>
                {/* Muestra más información del usuario aquí */}
            </div>
        );
    } else {
        return <div>No user profile found.</div>; // Mensaje si no se encontró el perfil
    }
};

export default UserProfile;

