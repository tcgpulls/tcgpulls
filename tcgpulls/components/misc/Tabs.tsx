"use client";

import { ReactNode, useState } from "react";

export type TabItem = {
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
};

const Tabs = ({ tabs }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex gap-2 border-b border-primary-800">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 focus:outline-none ${
              index === activeIndex
                ? "border-b-2 border-b-primary-300 text-primary-300"
                : "text-primary-500 hover:text-primary-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Active Tab Content */}
      <div className="py-6">{tabs[activeIndex].content}</div>
    </div>
  );
};

export default Tabs;
