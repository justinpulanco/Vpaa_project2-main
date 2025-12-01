import React from "react";

export default function User({ events }) {
  return (
    <div>
      <h2>User Dashboard</h2>

      <h3>Available Events</h3>
      <ul>
        {events.length > 0 ? (
          events.map((e) => <li key={e.id}>{e.title}</li>)
        ) : (
          <p>No events available</p>
        )}
      </ul>
    </div>
  );
}