import { useState, useEffect } from "react";
import { axiosConfig } from "@/config/axiosConfig";
import { EventInterface } from "@/interfaces/Events";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "./eventForm";
import { useAuthContext } from "@/contexts/authContext";
import { Calendar, MapPin, Users, Euro, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

export const Events = () => {
  const { authUser } = useAuthContext();
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventInterface>();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const response = await axiosConfig.get(`/events`);
      setEvents(response.data.events || response.data);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des événements");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleCreateEvent() {
    if (!authUser) {
      toast.info("Connectez-vous pour créer un événement");
      return;
    }
    if (authUser.role !== "organizer" && authUser.role !== "admin") {
      toast.error("Seuls les organisateurs peuvent créer des événements");
      return;
    }
    setAction("create");
    setSelectedEvent(undefined);
    setOpenDialog(true);
  }

  function handleEditEvent(event: EventInterface) {
    setAction("update");
    setSelectedEvent(event);
    setOpenDialog(true);
  }

  function handleDeleteEvent(event: EventInterface) {
    setAction("delete");
    setSelectedEvent(event);
    setOpenDialog(true);
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(events.map(e => e.category)))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Événements
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Découvrez et participez aux événements disponibles
              </p>
            </div>
            
            {authUser && (authUser.role === "organizer" || authUser.role === "admin") && (
              <Button
                onClick={handleCreateEvent}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un Événement
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <Input
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-purple-600 dark:focus:border-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 dark:text-gray-500 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-600 dark:focus:border-purple-500 focus:ring-purple-600 dark:focus:ring-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              >
                <option value="all">Toutes les catégories</option>
                {categories.filter(c => c !== "all").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Chargement des événements...</p>
          </div>
        )}

        {/* No Events */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || categoryFilter !== "all" 
                ? "Essayez de modifier vos filtres" 
                : "Soyez le premier à créer un événement !"}
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                currentUser={authUser}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onRefresh={fetchEvents}
              />
            ))}
          </div>
        )}

        {/* Dialog */}
        {openDialog && (
          <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {action === "create" && "Créer un Événement"}
                  {action === "update" && "Modifier l'Événement"}
                  {action === "delete" && "Supprimer l'Événement"}
                </DialogTitle>
              </DialogHeader>

              {authUser ? (
                <EventForm 
                  dialog={setOpenDialog} 
                  refresh={fetchEvents} 
                  action={action} 
                  event={selectedEvent} 
                />
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">Vous devez être connecté pour effectuer cette action.</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

// Event Card Component
interface EventCardProps {
  event: EventInterface;
  currentUser: any;
  onEdit: (event: EventInterface) => void;
  onDelete: (event: EventInterface) => void;
  onRefresh: () => void;
}

function EventCard({ event, currentUser, onEdit, onDelete, onRefresh }: EventCardProps) {
  const [signingUp, setSigningUp] = useState(false);

  const isOwner = currentUser?._id === event.owner._id;
  const isAdmin = currentUser?.role === "admin";
  const canEdit = isOwner || isAdmin;
  // capacity is optional on EventInterface, so ensure it's a number before comparing
  const isFull = typeof event.capacity === "number" && event.capacityLeft === 0;

  async function handleSignup() {
    if (!currentUser) {
      toast.info("Connectez-vous pour vous inscrire");
      return;
    }

    try {
      setSigningUp(true);
      await axiosConfig.post(`/signups`, { eventId: event._id });
      toast.success("Inscription réussie !");
      onRefresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur lors de l'inscription");
    } finally {
      setSigningUp(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      {/* Header avec Catégorie */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 p-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {event.category}
          </Badge>
          {isFull && (
            <Badge variant="destructive" className="bg-red-500 dark:bg-red-600">Complet</Badge>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
          {event.name}
        </h3>

        {event.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {event.description}
          </p>
        )}

        {/* Infos */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>
              {format(new Date(event.startDate), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{event.location}</span>
            </div>
          )}

          {typeof event.capacity === "number" && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>
                {event.capacityLeft ?? 0} / {event.capacity} places disponibles
              </span>
            </div>
          )}

          {typeof event.price === "number" && event.price > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Euro className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span>{event.price} €</span>
            </div>
          )}
        </div>

        {/* Organisateur */}
        <div className="flex items-center gap-3 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 flex items-center justify-center text-white font-semibold">
            {event.owner.name[0]}{event.owner.forename[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {event.owner.name} {event.owner.forename}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">@{event.owner.username}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-4">
          {canEdit ? (
            <>
              <Button
                onClick={() => onEdit(event)}
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Modifier
              </Button>
              <Button
                onClick={() => onDelete(event)}
                variant="destructive"
                className="flex-1 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800"
              >
                Supprimer
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSignup}
              disabled={isFull || signingUp}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700"
            >
              {signingUp ? "Inscription..." : isFull ? "Complet" : "S'inscrire"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}