import Layout from "../components/Layout";
import EventForm from "../components/EventForm";

export default function EventFormPage() {
  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create Event
          </h1>
          <p className="text-gray-600">
            Fill out the form below to create a new event
          </p>
        </div>

        <EventForm />
      </div>
    </Layout>
  );
}
