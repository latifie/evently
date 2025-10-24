import { useState } from "react";
import { axiosConfig } from "@/config/axiosConfig";
import { getEventColumns } from "./columns";
import { EventInterface } from "@/interfaces/Events";
import { DataTable } from "@/components/customs/dataTable";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EventForm } from "./eventForm";
import { useAuthContext } from "@/contexts/authContext";

export const Events = () => {
  const { authUser } = useAuthContext();
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventInterface>();
  const [eventCount, setEventCount] = useState(0);

  async function fetchEvents(page: number = 0, size: number = 10) {
    setLoading(true);
    try {
      const response = await axiosConfig.get(`/events?page=${page}&size=${size}`);
      setEvents(response.data.events);
      setEventCount(response.data.count);
    } catch (error: any) {
      // error handling
    } finally {
      setLoading(false);
    }
  }

  async function callback(action: string, id: any) {
    setSelectedEvent(undefined);
    if (action === "create") {
      setAction("create");
      setOpenDialog(true);
    } else if (action === "update") {
      setSelectedEvent(events.find((e) => e._id === id));
      setAction("update");
      setOpenDialog(true);
    } else if (action === "delete") {
      setSelectedEvent(events.find((e) => e._id === id));
      setAction("delete");
      setOpenDialog(true);
    }
  }

  return (
    <>
      <DataTable
        columns={getEventColumns(callback, authUser!)}
        data={events}
        dataCount={eventCount}
        fetchData={fetchEvents}
        isLoading={loading}
        callback={callback}
        searchElement="name"
        actions={["create"]}
      />
      {openDialog && (
        <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{action} an event</DialogTitle>
            </DialogHeader>

            {authUser ? (
              <EventForm dialog={setOpenDialog} refresh={fetchEvents} action={action} event={selectedEvent} />
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">You must be logged in to perform this action.</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
