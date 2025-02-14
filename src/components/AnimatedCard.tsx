import { ReactNode } from 'react';

const AnimatedCard: React.FC<{
  title: string;
  price: string;
  icon: ReactNode;
}> = ({ title, price, icon }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-[220px] h-[280px] overflow-hidden rounded-2xl bg-background group shadow-lg transition-transform duration-300 transform hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
      <div className="z-10 flex flex-col items-center gap-3 text-center text-white p-4">
        <div className="text-4xl text-gold">{icon}</div>
        <h2 className="text-lg font-semibold ">{title}</h2>
        <div className="w-10 h-1 bg-gold rounded-full" />
        <p className="text-lg font-bold text-gold">
          {price}
        </p>
      </div>
      <div className="absolute w-[120px] h-[150%] bg-gradient-to-b from-gold to-gold group-hover:animate-[spin_6s_linear_infinite] opacity-20" />
      <div
        className="absolute inset-1 bg-background rounded-xl border border-gold/40"
        style={{
          background: `
          radial-gradient(circle at top left, rgba(200,160,75,0.5) 0%, transparent 25%),
          radial-gradient(circle at bottom right, rgba(200,160,75,0.5) 0%, transparent 25%),
          black
        `,
        }}
      />
    </div>
  );
};

export default AnimatedCard;
