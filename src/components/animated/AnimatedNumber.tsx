interface AnimatedNumberProps {
  number: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ number }) => {
  return (
    <div className="text-4xl font-bold">
      <span className="inline-block w-24 overflow-hidden">
        <span className="animate-number">{number}</span>
      </span>
    </div>
  );
};

export default AnimatedNumber;
