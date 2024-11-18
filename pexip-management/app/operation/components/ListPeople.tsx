"use client";

import { useState } from "react";
import '@/app/operation/styles/layout.css';

interface Person {
  id: string;
  name: string;
}

export default function ListPeople() {
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Alice Johnson" },
    { id: "4", name: "Bob Brown" },
  ]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Khi bắt đầu kéo
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // Khi thả vào vị trí mới
  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;

    const updatedPeople = [...people];
    const [movedPerson] = updatedPeople.splice(draggedIndex, 1);
    updatedPeople.splice(index, 0, movedPerson);

    setPeople(updatedPeople);
    setDraggedIndex(null);
  };

  // Cho phép thả
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full h-full">
      <h3 className="text-lg font-semibold mb-4">List People</h3>
      <div>
        {people.map((person, index) => (
          <div
            key={person.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className="p-4 bg-gray-100 rounded-lg shadow-md mb-2 hover:bg-gray-200 cursor-grab"
          >
            {person.name}
          </div>
        ))}
      </div>
    </div>
  );
}
