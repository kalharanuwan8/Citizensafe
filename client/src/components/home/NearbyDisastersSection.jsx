import React from 'react';
import DisasterCard from '../disaster/DisasterCard';
import { useNavigate } from 'react-router-dom';

const NearbyDisastersSection = ({ disasters = [], onCardClick, onConfirm }) => {
  const navigate = useNavigate();
  
  if (!disasters || disasters.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 px-1">Nearby Active</h3>
      <div className="flex flex-col gap-2.5">
        {disasters.map(d => (
          <DisasterCard
            key={d.id}
            type={d.type}
            title={d.title}
            distance={d.distance || '1.2 km'}
            time={d.time}
            status={d.status}
            onClick={() => onCardClick ? onCardClick(d) : navigate(`/disaster/${d.id}`)}
            onConfirm={() => onConfirm && onConfirm(d)}
            showConfirm={d.status === 'Unverified'}
          />
        ))}
      </div>
    </div>
  );
};

export default NearbyDisastersSection;
