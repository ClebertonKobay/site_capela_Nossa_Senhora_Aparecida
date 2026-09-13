import { EventForm } from "@/components/admin/EventForm";

import { createEvent } from "../actions";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-primary">Novo evento</h1>
      <div className="mt-4">
        <EventForm action={createEvent} />
      </div>
    </div>
  );
}
