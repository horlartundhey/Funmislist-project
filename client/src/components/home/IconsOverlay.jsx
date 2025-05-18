import { FaStore, FaHotel, FaGuitar, FaDumbbell, FaBriefcase, FaHome, FaShoppingBag, FaCar, FaUtensils, FaBuilding, FaPlane, FaLaptop } from 'react-icons/fa';

const IconsOverlay = () => {
  const icons = [
    { Icon: FaStore, top: '10%', left: '5%', size: 24, opacity: 0.06 },
    { Icon: FaHotel, top: '30%', right: '8%', size: 32, opacity: 0.04 },
    { Icon: FaGuitar, bottom: '20%', left: '15%', size: 28, opacity: 0.05 },
    { Icon: FaDumbbell, top: '15%', right: '25%', size: 24, opacity: 0.06 },
    { Icon: FaBriefcase, bottom: '35%', right: '10%', size: 20, opacity: 0.04 },
    { Icon: FaHome, top: '45%', left: '10%', size: 36, opacity: 0.05 },
    { Icon: FaShoppingBag, bottom: '15%', right: '20%', size: 28, opacity: 0.06 },
    { Icon: FaCar, top: '60%', right: '15%', size: 32, opacity: 0.04 },
    { Icon: FaUtensils, bottom: '40%', left: '20%', size: 24, opacity: 0.05 },
    { Icon: FaBuilding, top: '25%', left: '35%', size: 36, opacity: 0.04 },
    { Icon: FaPlane, bottom: '30%', right: '35%', size: 28, opacity: 0.05 },
    { Icon: FaLaptop, top: '70%', left: '25%', size: 24, opacity: 0.06 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map(({ Icon, top, left, right, bottom, size, opacity }, index) => {
        const IconComponent = Icon; // Resolve the eslint warning
        return (
          <div
            key={index}
            className="absolute"
            style={{
              top,
              left,
              right,
              bottom,
              opacity,
              animation: `
                float${index % 3 + 1} ${8 + index % 4}s ease-in-out infinite ${index * 0.5}s,
                spin${index % 2 + 1} ${20 + index % 10}s linear infinite
              `
            }}
          >
            <IconComponent 
              className="text-red-500" 
              style={{ width: size, height: size }}
            />
          </div>
        );
      })}

      <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(5deg); }
          50% { transform: translate(20px, 0) rotate(0deg); }
          75% { transform: translate(10px, 15px) rotate(-5deg); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-15px, -10px) rotate(-3deg); }
          66% { transform: translate(15px, 10px) rotate(3deg); }
        }

        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-10px, -20px) rotate(5deg); }
        }

        @keyframes spin1 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin2 {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default IconsOverlay;