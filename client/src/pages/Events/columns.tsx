import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EventInterface } from "@/interfaces/Events";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

export const getEventColumns = (callback: (action: string, data: any) => void): ColumnDef<EventInterface>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const value = row.getValue("start_date");
      return <div>{format(new Date(value as string), "dd/MM/yyyy HH:mm")}</div>;
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      const value = row.getValue("end_date");
      return <div>{format(new Date(value as string), "dd/MM/yyyy HH:mm")}</div>;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.getValue("owner") as EventInterface["owner"];
      return <div>{owner?.name ?? "Unknown"}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div>{row.getValue("category")}</div>,
  },
  {
    accessorKey: "price",
    header: "Price (€)",
    cell: ({ row }) => {
      const price = row.getValue("price");
      return <div>{price ? `${price} €` : "—"}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => callback("update", event._id)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => callback("delete", event._id)}>
            <Trash className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
