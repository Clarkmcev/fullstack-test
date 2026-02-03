import { useLocation } from "react-router-dom";
import NavigationButton from "./NavigationButton";
import BackendStatus from "./BackendStatus";

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 max-w-5xl">
      <div className="mx-auto px-4">
        <div className="flex flex-col pb-2">
          <div className="flex items-center">
            <h1 className="text-5xl font-bold text-gray-800 py-4">
              Event Log Dashboard
            </h1>
          </div>
          <div className="flex justify-between items-center w-full">
            <BackendStatus />
            <div className="flex space-x-4">
              <NavigationButton to="/" active={isActive("/")}>
                Create Event
              </NavigationButton>
              <NavigationButton to="/events" active={isActive("/events")}>
                Event List
              </NavigationButton>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
