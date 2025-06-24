import React from "react";

export default function DailyTotal({ total, isLoading, error }) {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading daily total</div>;

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Today's Total</h2>
        <p className="text-4xl font-bold text-blue-600">
          {total || 0} calories
        </p>
      </div>
    </div>
  );
}
