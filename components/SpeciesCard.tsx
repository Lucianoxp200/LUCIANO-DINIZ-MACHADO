import React from 'react';
import { Species } from '../types';
import { EditIcon, TrashIcon } from './Icons';

interface SpeciesCardProps {
  species: Species;
  onEdit: () => void;
  onDelete: () => void;
}

const SpeciesCard: React.FC<SpeciesCardProps> = ({ species, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 relative group flex flex-col">
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={onEdit} className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition shadow-md">
          <EditIcon />
        </button>
        <button onClick={onDelete} className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-600 hover:bg-red-100 hover:text-red-800 transition shadow-md">
          <TrashIcon />
        </button>
      </div>
      <img src={species.imageUrl} alt={species.name} className="w-full h-48 object-cover bg-gray-200" />
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{species.name}</h2>
            <p className="text-sm text-gray-500 italic">{species.scientificName}</p>
          </div>
          <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">{species.id}</span>
        </div>
        <p className="text-gray-700 mb-4 text-sm leading-relaxed">{species.description}</p>
        
        <div className="border-t border-gray-200 mt-auto pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                    <h4 className="font-semibold text-gray-500">Família:</h4>
                    <p className="text-gray-800 truncate">{species.family || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-500">Ordem:</h4>
                    <p className="text-gray-800 truncate">{species.order || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-500">Data de Captura:</h4>
                    <p className="text-gray-800">{species.captureDate || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-500">Arte de Pesca:</h4>
                    <p className="text-gray-800 truncate">{species.fishingGear || 'N/A'}</p>
                </div>
            </div>
            <div>
                <h4 className="font-semibold text-gray-500 text-sm">Local:</h4>
                <p className="text-gray-800 text-sm truncate">{species.location || 'N/A'} (Ponto: {species.pointNumber || 'N/A'})</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-500 text-sm">Habitat:</h4>
                <p className="text-gray-800 text-sm truncate">{species.habitat || 'N/A'}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SpeciesCard;