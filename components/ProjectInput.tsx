import React from 'react';

interface ProjectInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const EXAMPLES = [
  'A simple markdown note-taking app with a preview panel.',
  'A weather dashboard that shows the forecast for my current location.',
  'A real-time chat application using a mock API.',
  'A Pomodoro timer with customizable work and break intervals.'
];

const ProjectInput: React.FC<ProjectInputProps> = ({ prompt, setPrompt, onGenerate, isGenerating }) => {
  return (
    <div>
      <label htmlFor="project-prompt" className="block text-lg font-medium text-gray-300 mb-2">
        Describe your application idea
      </label>
      <textarea
        id="project-prompt"
        rows={4}
        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-500"
        placeholder="e.g., A simple pomodoro timer with start, stop, and reset buttons."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isGenerating}
        aria-label="Application Idea Prompt"
      />
      <div className="mt-3 text-sm text-gray-400">
        Or try an example:
        <div className="flex flex-wrap gap-2 mt-2">
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => !isGenerating && setPrompt(ex)}
              disabled={isGenerating}
              className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Start Generation'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProjectInput;