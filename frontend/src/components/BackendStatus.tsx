import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

export default function BackendStatus() {
  const [status, setStatus] = useState<string>("checking...");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error - is the backend running?"));
  }, []);

  return (
    <div className="py-2 rounded-lg">
      <div className="flex space-x-2">
        <p className="text-gray-600">Backend status :</p>
        <p className={status === "ok" ? "text-green-600" : "text-red-600"}>
          {status}
        </p>
      </div>
    </div>
  );
}
