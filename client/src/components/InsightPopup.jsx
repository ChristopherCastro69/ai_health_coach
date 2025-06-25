import React from "react";
import ReactMarkdown from "react-markdown";

function InsightPopup({ isOpen, setOpen, content, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-primary rounded-2xl p-6 w-[90vw] max-w-2xl max-h-[80vh] flex flex-col text-text shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Health Insight</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-text hover:text-gray-400 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto pr-2 flex-grow">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white/50 mb-4"></div>
              <p className="text-lg">
                Your personal AI Health Coach is analyzing your day...
              </p>
            </div>
          ) : (
            <ReactMarkdown
              className="max-w-none"
              components={{
                h3: ({ ...props }) => (
                  <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />
                ),
                p: ({ ...props }) => (
                  <p className="mb-4 leading-relaxed" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc list-inside mb-4" {...props} />
                ),
                li: ({ ...props }) => <li className="mb-2" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsightPopup;
