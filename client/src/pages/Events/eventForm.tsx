import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { axiosConfig } from "@/config/axiosConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/customs/textarea";
import { EventInterface } from "@/interfaces/Events";
import { AlertTriangle } from "lucide-react";

const eventSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  location: z.string().min(1, "La localisation est requise"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  category: z.string().min(1, "La catégorie est requise"),
  price: z.coerce.number().min(0, "Le prix doit être positif").optional(),
  capacity: z.coerce.number().min(1, "La capacité doit être d'au moins 1 personne").optional(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "La date de fin doit être après la date de début",
  path: ["endDate"],
});

const deleteEventSchema = z.object({
  confirmDelete: z.string().refine((val) => val.toLowerCase() === "delete", {
    message: "Vous devez taper 'DELETE' pour confirmer",
  }),
});

interface EventFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
  action: string;
  event?: EventInterface;
}

export const EventForm = ({ dialog, refresh, action, event }: EventFormProps) => {
  const [loading, setLoading] = useState(false);

  const createForm = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      category: "",
      price: 0,
      capacity: undefined,
    },
  });

  const updateForm = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event?.name || "",
      description: event?.description || "",
      location: event?.location || "",
      startDate: event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
      endDate: event?.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
      category: event?.category || "",
      price: event?.price ?? 0,
      capacity: event?.capacity ?? undefined,
    },
  });

  const deleteForm = useForm<z.infer<typeof deleteEventSchema>>({
    resolver: zodResolver(deleteEventSchema),
    defaultValues: {
      confirmDelete: "",
    },
  });

  const onCreateSubmit: SubmitHandler<z.infer<typeof eventSchema>> = async (values) => {
    try {
      setLoading(true);
      await axiosConfig.post("/events", {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      });
      toast.success("Événement créé avec succès ! 🎉");
      dialog(false);
      refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur lors de la création");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateSubmit: SubmitHandler<z.infer<typeof eventSchema>> = async (values) => {
    try {
      setLoading(true);
      await axiosConfig.put(`/events/${event?._id}`, {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      });
      toast.success("Événement mis à jour avec succès !");
      dialog(false);
      refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteSubmit: SubmitHandler<z.infer<typeof deleteEventSchema>> = async () => {
    try {
      setLoading(true);
      await axiosConfig.delete(`/events/${event?._id}`);
      toast.success("Événement supprimé");
      dialog(false);
      refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  const renderFields = (form: any) => (
    <div className="space-y-6">
      {/* Nom */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-semibold">Nom de l'événement *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Conférence Tech 2025" 
                {...field} 
                className="h-12 border-gray-300 focus:border-purple-600"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-semibold">Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Décrivez votre événement..." 
                {...field} 
                className="min-h-[100px] border-gray-300 focus:border-purple-600"
              />
            </FormControl>
            <FormDescription className="text-xs">Optionnel</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Localisation */}
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-semibold">Localisation *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Paris, France" 
                {...field} 
                className="h-12 border-gray-300 focus:border-purple-600"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold">Date de début *</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                  className="h-12 border-gray-300 focus:border-purple-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold">Date de fin *</FormLabel>
              <FormControl>
                <Input 
                  type="datetime-local" 
                  {...field} 
                  className="h-12 border-gray-300 focus:border-purple-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Catégorie */}
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-semibold">Catégorie *</FormLabel>
            <FormControl>
              <select 
                {...field} 
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:border-purple-600 focus:ring-purple-600"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="Conférence">Conférence</option>
                <option value="Webinar">Webinar</option>
                <option value="Atelier">Atelier</option>
                <option value="Formation">Formation</option>
                <option value="Networking">Networking</option>
                <option value="Autre">Autre</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Prix et Capacité */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold">Prix (€)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="0.00"
                  {...field} 
                  className="h-12 border-gray-300 focus:border-purple-600"
                />
              </FormControl>
              <FormDescription className="text-xs">Laisser à 0 pour gratuit</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-semibold">Capacité totale</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  placeholder="Illimité"
                  {...field} 
                  className="h-12 border-gray-300 focus:border-purple-600"
                />
              </FormControl>
              <FormDescription className="text-xs">Laisser vide pour illimité</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  if (action === "create") {
    return (
      <Form {...createForm}>
        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-6">
          {renderFields(createForm)}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
          >
            {loading ? "Création..." : "Créer l'Événement"}
          </Button>
        </form>
      </Form>
    );
  }

  if (action === "update") {
    return (
      <Form {...updateForm}>
        <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-6">
          {renderFields(updateForm)}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
          >
            {loading ? "Mise à jour..." : "Mettre à Jour"}
          </Button>
        </form>
      </Form>
    );
  }

  if (action === "delete") {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 mb-1">Attention !</h4>
            <p className="text-sm text-red-700">
              Cette action est irréversible. L'événement et toutes les inscriptions associées seront supprimés.
            </p>
          </div>
        </div>

        <Form {...deleteForm}>
          <form onSubmit={deleteForm.handleSubmit(onDeleteSubmit)} className="space-y-6">
            <FormField
              control={deleteForm.control}
              name="confirmDelete"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Tapez "DELETE" pour confirmer
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="DELETE" 
                      {...field} 
                      className="h-12 border-gray-300 focus:border-red-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={loading}
              variant="destructive"
              className="w-full h-12 font-semibold"
            >
              {loading ? "Suppression..." : "Supprimer Définitivement"}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return <p>Action invalide</p>;
};