import React, { useState } from "react";

const JsonViewer = ({ data, level = 0 }) => {
    const [expanded, setExpanded] = useState({});

    // Toggles expansion for nested JSON
    const toggleExpand = (key) => {
        setExpanded((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    if (typeof data !== "object" || data === null) {
        return <span className="text-gray-700">{String(data)}</span>;
    }

    return (
        <div className="ml-4 border-l-2 border-gray-300 pl-2">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="mb-1">
          <span
              className="cursor-pointer font-semibold text-blue-600"
              onClick={() => toggleExpand(key)}
          >
            {Array.isArray(value) || typeof value === "object" ? (
                expanded[key] ? "▼" : "▶"
            ) : (
                "•"
            )}
          </span>{" "}
                    <span className="font-bold text-gray-800">{key}:</span>{" "}
                    {Array.isArray(value) || typeof value === "object" ? (
                        expanded[key] ? (
                            <JsonViewer data={value} level={level + 1} />
                        ) : (
                            <span className="text-gray-500">[...]</span>
                        )
                    ) : (
                        <span className="text-gray-700">{String(value)}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

const JsonParserUI = ({ jsonData }) => {
    return (
              <JsonViewer data={jsonData} />

    );
};

export default JsonParserUI;
