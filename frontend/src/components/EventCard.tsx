interface Props {
  event: {
    id: string;
    type: string;
    description: string;
    budget: number;
    numberOfPersons: number;
    date: string;
    payload: object;
    createdAt: string;
  };
}

function EventCard({ event }: Props) {
  return (
    <div
      key={event.id}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{event.type}</h3>
          <p className="text-gray-600 mt-1">{event.description}</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
          {event.type.split(".")[0]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Budget</p>
          <p className="text-lg font-semibold text-gray-800">
            ${event.budget.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Persons</p>
          <p className="text-lg font-semibold text-gray-800">
            {event.numberOfPersons}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="text-lg font-semibold text-gray-800">
            {new Date(event.date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {event.createdAt && (
        <div className="mt-4 text-xs text-gray-400">
          Created: {new Date(event.createdAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}

export default EventCard;
