// UserDAO.js
import { getAuth, updateProfile } from 'firebase/auth';

class UserDAO {
  constructor() {
    this.auth = getAuth();
  }

  // Obtener el usuario actual
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Actualizar perfil de usuario
  async updateUserProfile(user, profileData) {
    try {
      await updateProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
      });
      return user; // Devuelve el usuario actualizado
    } catch (error) {
      console.error("Error al actualizar el perfil: ", error);
      throw error;
    }
  }

  // Otras operaciones relacionadas con el usuario podrían ir aquí, como eliminar usuario, etc.
}

export default new UserDAO();
