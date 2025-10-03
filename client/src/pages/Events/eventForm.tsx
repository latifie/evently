import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { axiosConfig } from "@/config/axiosConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/customs/textarea";
import { EventInterface } from "@/interfaces/Events";

const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be at least 0").optional(),
  capacity: z.coerce.number().min(0, "Capacity must be ≥ 0").optional(),
});

const deleteEventSchema = z.object({
  confirmDelete: z.string(),
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
      start_date: "",
      end_date: "",
      category: event?.category || "",
      price: event?.price ?? 0,
      capacity: event?.capacity ?? undefined,
    },
  });

  const updateForm = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event?.name || "",
      description: event?.description || "",
      location: event?.location || "",
      start_date: event?.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : "",
      end_date: event?.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
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
        start_date: new Date(values.start_date).toISOString(),
        end_date: new Date(values.end_date).toISOString(),
      });
      toast.success("Event created successfully");
      dialog(false);
      refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const onUpdateSubmit: SubmitHandler<z.infer<typeof eventSchema>> = async (values) => {
    try {
      setLoading(true);
      await axiosConfig.put(`/events/${event?._id}`, {
        ...values,
        start_date: new Date(values.start_date).toISOString(),
        end_date: new Date(values.end_date).toISOString(),
      });
      toast.success("Event updated successfully");
      dialog(false);
      refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteSubmit: SubmitHandler<z.infer<typeof deleteEventSchema>> = async (values) => {
    if (values.confirmDelete.toLowerCase() === "delete") {
      try {
        setLoading(true);
        await axiosConfig.delete(`/events/${event?._id}`);
        toast.success("Event deleted successfully");
        dialog(false);
        refresh();
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to delete event");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Confirmation text is incorrect");
    }
  };

  const renderFields = (form: any) => (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Event name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Event location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Optional description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <select {...field} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">Select a category</option>
                <option value="Conférence">Conférence</option>
                <option value="Webinar">Webinar</option>
                <option value="Atelier">Atelier</option>
                <option value="Formation">Formation</option>
                <option value="Autre">Autre</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price (optional, in €)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" min="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Capacity (optional)</FormLabel>
            <FormControl>
              <Input type="number" min={0} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  if (action === "create") {
    return (
      <Form {...createForm}>
        <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-6">
          {renderFields(createForm)}
          <Button type="submit" disabled={loading}>
            Create
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
          <Button type="submit" disabled={loading}>
            Update
          </Button>
        </form>
      </Form>
    );
  }

  if (action === "delete") {
    return (
      <Form {...deleteForm}>
        <form onSubmit={deleteForm.handleSubmit(onDeleteSubmit)} className="space-y-6">
          <FormField
            control={deleteForm.control}
            name="confirmDelete"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type "DELETE" to confirm</FormLabel>
                <FormControl>
                  <Input placeholder="DELETE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            Delete
          </Button>
        </form>
      </Form>
    );
  }

  return <p>Invalid action</p>;
};
