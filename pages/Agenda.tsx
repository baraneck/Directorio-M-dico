import React, { useState } from 'react';
import { Doctor, Appointment } from '../types';
import { Calendar, Clock, User, FileText, CheckCircle } from 'lucide-react';

interface AgendaProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onAddAppointment: (apt: Appointment) => void;
  selectedDoctorId?: string;
}

export const Agenda: React.FC<AgendaProps> = ({ doctors, appointments, onAddAppointment, selectedDoctorId }) => {
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterDocId, setFilterDocId] = useState(selectedDoctorId || '');

  const filteredAppointments = appointments
    .filter(a => a.date === filterDate)
    .filter(a => filterDocId ? a.doctorId === filterDocId : true)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="h-full flex flex-col bg-slate-50">
      
      {/* Filters */}
      <div className="p-4 bg-white shadow-sm border-b space-y-3 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-800">Agenda Diaria</h1>
        <div className="flex gap-3">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 p-2 bg-slate-100 rounded-lg border-none text-sm font-medium outline-none"
          />
          <select
            value={filterDocId}
            onChange={(e) => setFilterDocId(e.target.value)}
            className="flex-1 p-2 bg-slate-100 rounded-lg border-none text-sm font-medium outline-none"
          >
            <option value="">Todos los médicos</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Calendar className="w-16 h-16 mb-2 opacity-50" />
            <p>No hay citas programadas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map(apt => {
              const doc = doctors.find(d => d.id === apt.doctorId);
              return (
                <div key={apt.id} className="flex gap-4 group">
                  <div className="w-16 flex flex-col items-center pt-2">
                    <span className="text-lg font-bold text-slate-700">{apt.time}</span>
                    <div className="h-full w-0.5 bg-slate-200 mt-2 group-last:bg-transparent"></div>
                  </div>
                  
                  <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow mb-2">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <User className="w-4 h-4 text-primary-500" />
                        {apt.patientName}
                      </h4>
                      {apt.mutua && (
                        <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                          {apt.mutua}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                      <FileText className="w-3 h-3 text-slate-400" />
                      {apt.reason}
                    </p>

                    {doc && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                        <img src={doc.avatarUrl} className="w-6 h-6 rounded-full bg-slate-200" alt="" />
                        <span className="text-xs text-slate-500 font-medium">{doc.name}</span>
                        <span className="text-xs text-slate-300 mx-1">•</span>
                        <span className="text-xs text-slate-500">Sala {doc.room}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};