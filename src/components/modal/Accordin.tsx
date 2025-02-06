import React, { useState } from "react";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="mt-6 space-y-3">
      {items.map(({ title, content }) => (
        <div key={title} className="border border-gray-700 rounded-md">
          <button
            className="w-full text-left px-4 py-2 bg-gray-800 hover:bg-gray-700 transition flex justify-between items-center"
            onClick={() => toggleSection(title)}
          >
            <span className="text-gray-200">{title}</span>
            <span>{openSection === title ? "▲" : "▼"}</span>
          </button>
          {openSection === title && (
            <div className="px-4 py-2 text-gray-400">{content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;