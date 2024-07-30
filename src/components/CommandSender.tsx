import React, { useState } from 'react';

interface CommandSenderProps {
  onSendCommand: (command: string) => Promise<string>;
}

const CommandSender: React.FC<CommandSenderProps> = ({ onSendCommand }) => {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleSendCommand = async () => {
    if (command.trim()) {
      const result = await onSendCommand(command);
      setResponse(result);
      setCommand('');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Enter command"
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
      />
      <button
        onClick={handleSendCommand}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Send Command
      </button>
      {response && (
        <div className="mt-4 p-2 bg-gray-800 text-white rounded">
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default CommandSender;
