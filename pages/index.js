import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const LuxuryHorizonDroneEstimate = dynamic(
  () => import('../components/LuxuryHorizonDroneEstimate'),
  { ssr: false, loading: () => <LoadingScreen /> }
);

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
    <div className="text-white text-4xl font-playfair animate-pulse">
      Horizon
    </div>
  </div>
);

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {!isLoaded && <LoadingScreen />}
      <LuxuryHorizonDroneEstimate />
    </>
  );
};

export default Home;