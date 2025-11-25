import React from 'react';
import { Doctor } from '../types';
import { ChevronRight, Hash } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  onClick: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
  return (
    <div 
      onClick={() => onClick(doctor)}
      className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-4 hover:shadow-md h-full ${!doctor.isActive ? 'opacity-60 grayscale bg-slate-50' : ''}`}
    >
      {/* Avatar with Room Badge */}
      <div className="relative flex-shrink-0 self-center">
        <img 
          src={doctor.avatarUrl} 
          alt={doctor.name} 
          className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-sm bg-slate-200"
        />
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-[10px] px-2 py-0.5 rounded-full font-bold border-2 border-white shadow-sm z-10 whitespace-nowrap ${doctor.isActive ? 'bg-indigo-600' : 'bg-slate-500'}`}>
          Sala {doctor.room}
        </div>
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center py-1 pl-1">
        {/* Name - Very Large */}
        <h3 className="text-xl font-black text-slate-800 truncate leading-tight mb-0.5">
          {doctor.name}
          {!doctor.isActive && <span className="ml-2 text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full align-middle uppercase tracking-wider">Inactivo</span>}
        </h3>
        
        {/* ID - Large and Prominent */}
        <div className="flex items-center gap-1.5 mb-2">
           <Hash className="w-5 h-5 text-slate-300" strokeWidth={3} />
           <span className="text-2xl font-mono font-bold text-slate-700 tracking-tight">{doctor.id}</span>
        </div>

        {/* Specialty & Extra - Secondary */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
           <span className="text-primary-700 font-bold bg-primary-50 px-2 py-0.5 rounded-md">
             {doctor.specialty}
           </span>
           
           {doctor.mutuas.length > 0 && (
            <span className="text-slate-400 font-medium text-xs">
               +{doctor.mutuas.length} mutuas
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="w-6 h-6 text-slate-300 flex-shrink-0" />
    </div>
  );
};