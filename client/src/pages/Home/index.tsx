import { useTranslation } from "react-i18next";
import { Calendar, Users, Search, UserPlus, ShieldCheck, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/authContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  const handleFeatureClick = (route: string, requiresAuth: boolean, title: string, requiresRole?: string) => {
    if (requiresAuth && !authUser) {
      toast.info(`Connectez-vous pour accéder à "${title}"`);
      navigate('/login');
      return;
    }
    
    if (requiresRole && authUser?.role !== requiresRole && authUser?.role !== 'admin') {
      toast.error(`Cette fonctionnalité nécessite le rôle ${requiresRole}`);
      return;
    }
    
    navigate(route);
  };

  const features = [
    {
      icon: Search,
      title: "Découvrir les Événements",
      description: 'Explorez tous les événements disponibles - conférences, ateliers, formations et plus encore',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/40',
      route: '/events',
      requiresAuth: false,
      badge: 'Public',
      badgeVariant: 'secondary' as const
    },
    {
      icon: Calendar,
      title: "Créer un Événement",
      description: 'Créez et publiez vos propres événements avec tous les détails nécessaires',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
      route: '/events',
      requiresAuth: true,
      requiresRole: 'organizer',
      badge: 'Organizer',
      badgeVariant: 'default' as const
    },
    {
      icon: Users,
      title: "S'inscrire aux Événements",
      description: 'Inscrivez-vous facilement aux événements qui vous intéressent en un clic',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/40',
      route: '/events',
      requiresAuth: true,
      badge: 'Connexion requise',
      badgeVariant: 'outline' as const
    },
    {
      icon: UserPlus,
      title: 'Gérer vos Inscriptions',
      description: 'Consultez et gérez toutes vos inscriptions aux événements en un seul endroit',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
      hoverColor: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/40',
      route: '/account',
      requiresAuth: true,
      badge: 'Connexion requise',
      badgeVariant: 'outline' as const
    },
    {
      icon: ShieldCheck,
      title: 'Espace Administration',
      description: 'Gérez les utilisateurs, consultez les logs et configurez la plateforme',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      hoverColor: 'hover:bg-red-100 dark:hover:bg-red-900/40',
      route: '/admin/dashboard',
      requiresAuth: true,
      requiresRole: 'admin',
      badge: 'Admin',
      badgeVariant: 'destructive' as const
    },
    {
      icon: FileText,
      title: 'Votre Compte',
      description: 'Consultez et modifiez vos informations personnelles et préférences',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
      hoverColor: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/40',
      route: '/account',
      requiresAuth: true,
      badge: 'Connexion requise',
      badgeVariant: 'outline' as const
    }
  ];

  const advantages = [
    "Interface intuitive et moderne",
    "Inscription en quelques clics",
    "Gestion automatique des capacités",
    "Notifications en temps réel",
    "Système de permissions avancé",
    "Gratuit et open source"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            {authUser ? (
              <Badge className="mb-4 text-sm px-4 py-2" variant="default">
                Connecté en tant que {authUser.username || 'Utilisateur'} ({authUser.role || 'user'})
              </Badge>
            ) : (
              <Badge className="mb-4 text-sm px-4 py-2" variant="outline">
                Mode visiteur - Connectez-vous pour plus de fonctionnalités
              </Badge>
            )}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Bienvenue sur{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Evently
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            La plateforme tout-en-un pour créer, gérer et participer à des événements exceptionnels. 
            Une expérience fluide pour organisateurs et participants.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/events')}
              className="px-8 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              Découvrir les Événements
              <ArrowRight className="w-5 h-5" />
            </button>
            {!authUser && (
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-500 rounded-lg text-lg font-semibold hover:bg-purple-50 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
              >
                Commencer Maintenant
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Que Pouvez-vous Faire sur Evently ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explorez toutes les fonctionnalités disponibles. Certaines nécessitent une connexion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-700 ${feature.bgColor} ${feature.hoverColor}`}
                onClick={() => handleFeatureClick(feature.route, feature.requiresAuth, feature.title, feature.requiresRole)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${feature.color}`}>
                    <feature.icon className="w-full h-full" />
                  </div>
                  <Badge variant={feature.badgeVariant} className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 font-semibold">
                  {feature.requiresAuth && !authUser ? (
                    <>Connexion requise <ArrowRight className="w-4 h-4 ml-1" /></>
                  ) : (
                    <>Accéder <ArrowRight className="w-4 h-4 ml-1" /></>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi Choisir Evently ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Une plateforme moderne et complète pour tous vos besoins d'événements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">{advantage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-900 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90">Événements Créés</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-lg opacity-90">Participants Actifs</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Organisateurs</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {authUser ? "Explorez Maintenant !" : "Prêt à Commencer ?"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {authUser 
              ? "Découvrez tous les événements disponibles et gérez vos inscriptions"
              : "Rejoignez la communauté Evently et créez des expériences inoubliables"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/events')}
              className="px-8 py-3 bg-purple-600 dark:bg-purple-500 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              Explorer les Événements
              <ArrowRight className="w-5 h-5" />
            </button>
            {!authUser && (
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                S'inscrire Gratuitement
              </button>
            )}
            {authUser && (
              <button
                onClick={() => navigate('/account')}
                className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Mon Compte
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Info Section for Visitors */}
      {!authUser && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              💡 Vous êtes en Mode Visiteur
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Vous pouvez consulter tous les événements disponibles sans créer de compte. 
              Pour vous inscrire à un événement ou créer vos propres événements, 
              vous devrez vous connecter ou créer un compte gratuit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
              >
                Se Connecter
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-500 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
              >
                Créer un Compte
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};