import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
    const [status, setStatus] = useState<string>("checking...");

    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => setStatus(data.status))
            .catch(() => setStatus("error - is the backend running?"));
    }, []);

    return (
        <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
            <h1>Event Log Dashboard</h1>
            <p>
                Backend status: <strong>{status}</strong>
            </p>
            <hr style={{ margin: "2rem 0" }} />
            {/* TODO: Implement your UI here */}
            <p style={{ color: "#666" }}>
                Replace this with your event submission form and event list.
            </p>
        </div>
    );
}

export default App;