import React, { useEffect, useState } from 'react'; 
import { getDatabase, ref as dbRef, onValue, update } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from "../context/authContext";
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa'; // Icono de lápiz

/**
 * Módulo de usuario:
 * Este módulo maneja los datos de usuario, incluyendo las credenciales,
 * la personalización del perfil y las sugerencias de contenido. 
 * 
 * Funciones del módulo:
 * - Crear nuevos usuarios y gestionar usuarios existentes.
 * - Autenticar usuarios para acceder a la aplicación.
 * - Personalización del perfil: cambio de foto de perfil y nombre de usuario.
 * - Relación con el módulo de suscripciones: cada usuario puede estar vinculado o no a una suscripción.
 * - Relación con el módulo de contenidos: los usuarios pueden hacer reseñas, marcar favoritos y recibir sugerencias de contenidos según sus preferencias.
 */

export const Home = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Estado para el modo de edición
  const [newDisplayName, setNewDisplayName] = useState(""); // Estado para el nuevo nombre de usuario
  const [previousPhotoURL, setPreviousPhotoURL] = useState(""); // Almacena la URL de la foto anterior
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // Estado de la suscripción del usuario
  const [contentSuggestions, setContentSuggestions] = useState([]); // Estado para las sugerencias de contenido

  // Verificar si el usuario está autenticado y cargar los datos de Firebase
  useEffect(() => {
    if (!user) {
      navigate('/login'); // Si no hay usuario, redirigir al login
    } else {
      const db = getDatabase();
      const usersRef = dbRef(db, 'users/' + user.uid);

      onValue(usersRef, (snapshot) => {
        const userData = snapshot.val();
        setCurrentUser({ id: user.uid, ...userData });
        setNewDisplayName(userData.displayName); // Configurar el nombre actual
        setPreviousPhotoURL(userData.photoURL); // Guardar la URL anterior de la foto
        setSubscriptionStatus(userData.subscriptionStatus || "No suscrito"); // Cargar estado de suscripción
        setContentSuggestions(userData.contentSuggestions || []); // Cargar sugerencias de contenido
      });
    }
  }, [user, navigate]);

  // Función para manejar la selección de un nuevo archivo de imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Función para subir una nueva foto de perfil
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const storage = getStorage();
      const fileRef = storageRef(storage, `profilePictures/${user.uid}`);
      await uploadBytes(fileRef, selectedFile);
      const photoURL = await getDownloadURL(fileRef);

      const db = getDatabase();
      const userRef = dbRef(db, 'users/' + user.uid);
      await update(userRef, { photoURL });

      setCurrentUser((prevUser) => ({
        ...prevUser,
        photoURL,
      }));
      setUploading(false);
      setPreview(null);
      setSelectedFile(null); // Reiniciar el archivo seleccionado
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setUploading(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error(error.message);
    }
  };

  // Función para activar el modo de edición del nombre de usuario
  const handleEdit = () => {
    setIsEditing(true); // Activar modo de edición del nombre
  };

  // Función para guardar el nuevo nombre de usuario
  const handleSave = async () => {
    const db = getDatabase();
    const userRef = dbRef(db, 'users/' + user.uid);
    await update(userRef, { displayName: newDisplayName });
    setCurrentUser((prevUser) => ({
      ...prevUser,
      displayName: newDisplayName,
    }));
    setIsEditing(false); // Salir del modo de edición del nombre
  };

  // Función para cancelar la edición del nombre
  const handleCancel = () => {
    setNewDisplayName(currentUser.displayName); // Restablecer el nombre anterior
    setIsEditing(false); // Salir del modo de edición y eliminar los botones de nombre
  };

  // Función para cancelar el cambio de foto de perfil
  const handleCancelPhoto = () => {
    setPreview(null); // Eliminar la previsualización de la foto
    setSelectedFile(null); // Reiniciar el archivo seleccionado
  };

  // Si no hay un usuario autenticado, mostrar un mensaje
  if (!user) {
    return (
      <div className="w-full max-w-xs m-auto text-black">
        <p className="text-xl mb-4">Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl m-auto p-4 text-black">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {currentUser ? (
          <>
            {/* Foto de perfil en la parte superior */}
            <div className="flex justify-center mb-4">
              <div
                className="relative rounded-full w-24 h-24 bg-gray-300 border-2 border-gray-300 cursor-pointer group"
                onClick={() => document.getElementById('fileInput').click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-full w-full h-full object-cover"
                  />
                ) : currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.email}
                    className="rounded-full w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-600">Sin foto</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaPen className="text-white" />
                </div>
              </div>

              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Mostrar botones solo si hay una imagen previsualizada */}
            {preview && (
              <div className="flex justify-center space-x-2 mb-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? 'Subiendo...' : 'Guardar Foto de Perfil'}
                </button>
                <button
                  onClick={handleCancelPhoto}
                  className="bg-red-500 text-white rounded py-1 px-2"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Nombre de usuario centrado */}
            <h1 className="text-2xl font-bold mb-4 flex flex-col items-center">
              
              {isEditing ? (
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="border border-gray-300 rounded p-1 mt-1 mx-2"
                />
              ) : (
                <span className="mx-2 text-center">{currentUser.displayName || currentUser.email}</span>
              )}
              {!isEditing && (
                <span className="cursor-pointer" onClick={handleEdit}>
                  <FaPen className="text-blue-500 text-sm" />
                </span>
              )}
            </h1>

            {/* Botones para editar el nombre */}
            {isEditing && (
              <div className="flex justify-center space-x-2 mb-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white rounded px-2 py-1"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white rounded px-2 py-1"
                >
                  Cancelar
                </button>
              </div>
            )}

            <p className="text-lg mt-4 text-center">Email: {currentUser.email}</p>

            {/* Relación con módulo de suscripciones */}
            <div className="bg-gray-100 p-4 mt-4 rounded">
              <h2 className="text-xl font-bold mb-2">Estado de suscripción</h2>
              <p className="text-center">{subscriptionStatus}</p>
            </div>

            {/* Relación con módulo de contenidos */}
            <div className="bg-gray-100 p-4 mt-4 rounded">
              <h2 className="text-xl font-bold mb-2">Sugerencias de contenido</h2>
              {contentSuggestions.length > 0 ? (
                <ul>
                  {contentSuggestions.map((suggestion, index) => (
                    <li key={index} className="text-center">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center">No hay sugerencias de contenido por el momento.</p>
              )}
            </div>

            {/* Botón de cerrar sesión centrado */}
            <div className="flex justify-center mt-4">
              <button
                className="bg-slate-200 hover:bg-slate-300 rounded py-1 px-2 text-black"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          </>
        ) : (
          <p>Cargando usuario...</p>
        )}
      </div>
    </div>
  );
};
