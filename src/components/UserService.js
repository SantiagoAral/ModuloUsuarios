// UserService.js
import UserDAO from './UserDAO';

class UserService {
  // Método para obtener el usuario actual
  getCurrentUser() {
    return UserDAO.getCurrentUser();
  }

  // Método para actualizar perfil de usuario
  async updateUserProfile(profileData) {
    const user = this.getCurrentUser();
    if (!user) throw new Error("No hay usuario autenticado");

    return await UserDAO.updateUserProfile(user, profileData);
  }
}

export default new UserService();
