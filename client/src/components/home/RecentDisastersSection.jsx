import React from 'react';
import DisasterCard from '../disaster/DisasterCard';
import { useNavigate } from 'react-router-dom';

const RecentDisastersSection = ({ disasters = [], onCardClick }) => {
  const navigate = useNavigate();

  if (!disasters || disasters.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 px-1">Recent (24h)</h3>
      <div className="flex flex-col gap-2.5">
        {disasters.map(d => (
          <DisasterCard
            key={d.id}
            type={d.type}
            title={d.title}
            distance={d.distance || '2.5 km'}
            time={d.time}
            status={d.status}
            onClick={() => onCardClick ? onCardClick(d) : navigate(`/disaster/${d.id}`)}
            showConfirm={false}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentDisastersSection;
