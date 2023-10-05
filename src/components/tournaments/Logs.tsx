interface LogsProps {
  logMessages: string[];
}
const Logs: React.FC<LogsProps> = ({ logMessages }) => {
  return (
    <div className="no-scrollbar flex h-full w-full flex-col overflow-y-scroll ">
      {logMessages.map((message, index) => (
        <div key={index} className="mb-2">
          {message}
        </div>
      ))}
    </div>
  );
};

export default Logs;
