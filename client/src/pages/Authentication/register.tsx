import { getRegisterSchema } from "@/lib/zod/schemas/auth/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/authContext";
import { axiosConfig } from "@/config/axiosConfig";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RegisterForm } from "@/components/customs/registerForm";
import { Link } from "react-router-dom";

export const Register = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const { t } = useTranslation();

  const registerSchema = getRegisterSchema(t);

  async function register(values: z.infer<typeof registerSchema>) {
    try {
      setLoading(true);
      const response = await axiosConfig.post("/authentication/register", values);
      
      // Vérifier que la réponse contient les données attendues
      if (response?.data) {
        toast.success(t(response.data.message) || "Inscription réussie");
        setAuthUser(response.data.user);
        localStorage.setItem("accessToken", response.data.accessToken);
        navigate("/");
      } else {
        toast.error("Réponse invalide du serveur");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Gestion d'erreur améliorée
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        const errorMessage = error.response.data?.error || error.response.data?.message || "Erreur lors de l'inscription";
        toast.error(t(errorMessage));
      } else if (error.request) {
        // La requête a été faite mais pas de réponse reçue
        console.error("No response received:", error.request);
        toast.error("Impossible de contacter le serveur. Vérifiez que le backend est démarré.");
      } else {
        // Erreur lors de la configuration de la requête
        console.error("Request setup error:", error.message);
        toast.error("Erreur lors de la préparation de la requête");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <RegisterForm onSubmit={register} disabledFields={[]} loading={loading} oauth={true} />
    </>
  );
};