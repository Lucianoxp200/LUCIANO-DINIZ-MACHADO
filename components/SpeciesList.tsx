import React from 'react';
import { Species } from '../types';
import SpeciesCard from './SpeciesCard';

interface SpeciesListProps {
  species: Species[];
  onEdit: (species: Species) => void;
  onDelete: (species: Species) => void;
}

const SpeciesList: React.FC<SpeciesListProps> = ({ species, onEdit, onDelete }) => {
  if (species.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">Nenhuma espécie encontrada.</p>
        <p className="text-gray-500">Tente ajustar sua busca ou adicione a primeira espécie a esta coleção.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {species.map((s) => (
        <SpeciesCard 
          key={s.id} 
          species={s} 
          onEdit={() => onEdit(s)}
          onDelete={() => onDelete(s)}
        />
      ))}
    </div>
  );
};

export default SpeciesList;
