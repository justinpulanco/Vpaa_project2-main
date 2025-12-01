import React, { useState } from "react";

export default function Admin({ events, setEvents }) {
  const [title, setTitle] = useState("");

  const addEvent = () => {
    if (!title.trim()) return;
    const newEvent = { id: Date.now(), title };
    setEvents([...events, newEvent]);
    setTitle("");
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="New event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addEvent}>Add Event</button>
      </div>

      <h3>Event List</h3>
      <ul>
        {events.map((e) => (
          <li key={e.id}>{e.title}</li>
        ))}
      </ul>
    </div>
  );
}
