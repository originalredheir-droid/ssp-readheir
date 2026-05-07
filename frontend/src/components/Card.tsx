type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div className={`rounded-lg border border-outline-variant/20 bg-surface-container-low p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;