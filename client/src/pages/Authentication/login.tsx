import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getLoginSchema } from "@/lib/zod/schemas/auth/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuthContext } from "@/contexts/authContext";
import { axiosConfig } from "@/config/axiosConfig";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { OAuth } from "@/components/customs/oauth";
import { LogIn, UserCheck, ArrowLeft } from "lucide-react";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setAuthUser } = useAuthContext();

  const loginSchema = getLoginSchema(t);
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginName: "",
      password: "",
    },
  });

  async function login(values: z.infer<typeof loginSchema>) {
    try {
      setLoading(true);

      const isEmail = /\S+@\S+\.\S+/.test(values.loginName);
      const payload = {
        password: values.password,
        ...(isEmail ? { email: values.loginName } : { username: values.loginName }),
      };
      const response = await axiosConfig.post("/auth/login", payload);

      toast.success(t(response.data.message) || "Connexion réussie");
      setAuthUser(response.data.user);
      localStorage.setItem("accessToken", response.data.accessToken);
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        toast.error(t(error.response.data?.error || "Erreur lors de la connexion"));
      } else {
        toast.error("Impossible de contacter le serveur");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Bouton Retour */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </button>

        {/* Card de Connexion */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Bon Retour !
            </h1>
            <p className="text-gray-600">
              {t("pages.login.welcome_back") || "Connectez-vous à votre compte"}
            </p>
          </div>

          {/* Formulaire */}
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(login)} className="space-y-6">
              <FormField
                control={loginForm.control}
                name="loginName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">
                      {t("pages.login.field") || "Email ou Nom d'utilisateur"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="exemple@email.com"
                        className="h-12 border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      {t("pages.login.field_description") || "Entrez votre email ou nom d'utilisateur"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">
                      {t("pages.login.password") || "Mot de passe"}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        placeholder="••••••••"
                        className="h-12 border-gray-300 focus:border-purple-600 focus:ring-purple-600"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      {t("pages.login.password_description") || "Entrez votre mot de passe"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-200" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    {t("pages.login.login_button") || "Se Connecter"}
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
                        {t("pages.login.or_continue_with") || "Ou continuer avec"}
                      </span>
                    </div>
                  </div>
                  <OAuth message="pages.login.login_button" />
                </>
              )}
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {t("pages.login.no_account") || "Pas encore de compte ?"}{" "}
              <Link 
                to="/register" 
                className="font-semibold text-purple-600 hover:text-purple-700 underline underline-offset-4"
              >
                {t("pages.login.sign_up") || "Créer un compte"}
              </Link>
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-700">
            🎉 Rejoignez <span className="font-bold text-purple-600">5+</span> utilisateurs actifs sur Evently !
          </p>
        </div>
      </div>
    </div>
  );
};