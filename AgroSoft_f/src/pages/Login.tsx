import { useState } from "react";
import { login } from "@/api/Auth";
import { useAuth } from "@/hooks/UseAuth";
import { useNavigate } from "react-router-dom";
import FormComponent from "@/components/Form";
import logo from "../../public/sena.png";
import sideLogo from "../../public/logoAgrosoft.png";
import { CrearUsersModal } from "@/modules/Users/components/CrearUsersModal";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: Record<string, any>) => {
    setErrorMessage("");
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });
      const token = response.token;
      console.log("Respuesta de login:", response);
      if (!token) throw new Error("No se recibió token en la respuesta");

      await authLogin(token);
      navigate("/home");
    } catch (error) {
      console.error("Error completo:", error);
      setErrorMessage(
        error.response?.data?.msg ||
          "Error al iniciar sesión. Verifica tus credenciales."
      );
    }
  };

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-white">
      <div className="absolute bottom-0 left-0 w-full h-auto">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#008550"
            d="M0,1 C400,200 800,8 1440,18 L1440,320 L0,320 Z"
          />
        </svg>
      </div>
      <div className="relative flex bg-white shadow-lg rounded-2xl w-[600px] h-[350px] max-w-full overflow-hidden z-10">
        <div className="w-1/2 p-10">
          <h2 className="text-xl font-semibold mb-6 text-center">
            ¡Bienvenido de vuelta!
          </h2>
          <FormComponent
            fields={[
              {
                name: "email",
                label: "Correo electrónico",
                type: "email",
                placeholder: "Ingresa tu correo",
                required: true,
              },
              {
                name: "password",
                label: "Contraseña",
                type: "password",
                placeholder: "Ingresa tu contraseña",
                required: true,
              },
            ]}
            onSubmit={handleSubmit}
            submitLabel="Iniciar sesión"
          />
          <div className="mt-4 text-center">
            <button
              onClick={openModal}
              className="text-blue-600 hover:underline text-sm font-semibold"
            >
              ¿No tienes cuenta? Regístrate aquí
            </button>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm font-semibold text-center mt-3">
              {errorMessage}
            </p>
          )}
        </div>
        <div className="w-1/2 bg-[#D9D9D9] flex flex-col items-center justify-center text-black p-10">
          <img src={sideLogo} alt="AgroSoft Logo" className="w-[190px] mb-7" />
        </div>
      </div>
      <img
        src={logo}
        alt="Logo"
        className="w-[90px] absolute bottom-6 left-4"
      />
      {/* Renderiza el modal de registro */}
      <CrearUsersModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Login;