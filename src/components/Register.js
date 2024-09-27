import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Alert } from "./Alert";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set } from "firebase/database";

export function Register() {
  const { signup } = useAuth();

  const [user, setUser] = useState({
    email: "",
    password: "",
    displayName: "", // Agregar el nombre de usuario aquí
    profilePicture: null,
  });

  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, profilePicture: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = ({ target: { value, name } }) =>
    setUser({ ...user, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signup(user.email, user.password);
      const userId = userCredential.user.uid;

      let photoURL = null;
      if (user.profilePicture) {
        const imageRef = ref(storage, `profilePictures/${userId}`);
        await uploadBytes(imageRef, user.profilePicture);
        photoURL = await getDownloadURL(imageRef);
      }

      const db = getDatabase();
      await set(dbRef(db, `users/${userId}`), {
        email: user.email,
        displayName: user.displayName, // Guardar el nombre de usuario
        photoURL: photoURL,
      });
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full max-w-xs m-auto text-black">
      {error && <Alert message={error} />}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-6 mb-4"
      >
        {/* Vista previa de la imagen de perfil */}
        <div className="mb-4 flex justify-center">
          <label htmlFor="profilePicture" className="cursor-pointer">
            <div className="relative">
              <img
                src={imagePreview || "default-avatar.png"}
                alt="Profile Preview"
                className="rounded-full w-24 h-24 object-cover border-2 border-gray-300"
              />
              <input
                type="file"
                accept="image/*"
                id="profilePicture"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </label>
        </div>

        <div className="mb-4">
          <label
            htmlFor="displayName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Nombre de Usuario
          </label>
          <input
            type="text"
            name="displayName"
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Tu Nombre"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="youremail@company.tld"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="*************"
          />
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Register
        </button>
      </form>
      <p className="my-4 text-sm flex justify-between px-3">
        Already have an Account?
        <Link to="/login" className="text-blue-700 hover:text-blue-900">
          Login
        </Link>
      </p>
    </div>
  );
}
