import { getRegisterSchema } from "@/lib/zod/schemas/auth/zod";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/authContext";
import { axiosConfig } from "@/config/axiosConfig";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Sparkles, ArrowLeft } from "lucide-react";
import { OAuth } from "@/components/customs/oauth";

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext();
  const { t } = useTranslation();

  const registerSchema = getRegisterSchema(t);
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      forename: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function register(values: z.infer<typeof registerSchema>) {
    try {
      setLoading(true);
      const response = await axiosConfig.post("/auth/register", values);
      
      if (response?.data) {
        toast.success(t(response.data.message) || "Inscription réussie ! Bienvenue sur Evently 🎉");
        setAuthUser(response.data.user);
        localStorage.setItem("accessToken", response.data.accessToken);
        navigate("/");
      } else {
        toast.error("Réponse invalide du serveur");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.error || error.response.data?.message || "Erreur lors de l'inscription";
        toast.error(t(errorMessage));
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Impossible de contacter le serveur. Vérifiez que le backend est démarré.");
      } else {
        console.error("Request setup error:", error.message);
        toast.error("Erreur lors de la préparation de la requête");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Bouton Retour */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </button>

        {/* Card d'Inscription */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Créer un Compte
            </h1>
            <p className="text-gray-600">
              Rejoignez la communauté Evently et commencez à organiser vos événements
            </p>
          </div>

          {/* Formulaire */}
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(register)} className="space-y-6">
              {/* Ligne 1: Nom et Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Nom</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Dalor"
                          className="h-12 border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="forename"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Prénom</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Homer"
                          className="h-12 border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Username */}
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="homer.dalor"
                        className="h-12 border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Choisissez un nom d'utilisateur unique
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        placeholder="homer.dalor@example.com"
                        className="h-12 border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ligne 2: Mots de passe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Mot de passe</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password"
                          placeholder="••••••••"
                          className="h-12 border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Min. 8 caractères, 1 majuscule, 1 chiffre
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Confirmer</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password"
                          placeholder="••••••••"
                          className="h-12 border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bouton Submit */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Création du compte...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Créer mon Compte
                  </span>
                )}
              </Button>

              {/* OAuth Section */}
              {import.meta.env.VITE_FIREBASE_API_KEY && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">
                        Ou s'inscrire avec
                      </span>
                    </div>
                  </div>
                  <OAuth message="S'inscrire" />
                </>
              )}
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link 
                to="/login" 
                className="font-semibold text-purple-600 hover:text-purple-700 underline underline-offset-4"
              >
                Se Connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};