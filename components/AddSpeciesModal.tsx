import React, { useState, FormEvent, useEffect } from 'react';
import { Species } from '../types';
import { generateDescription } from '../services/geminiService';
import { SparklesIcon, XIcon, UploadIcon } from './Icons';

interface AddSpeciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (species: Species) => void;
  existingIds: string[];
  speciesToEdit?: Species | null;
}

const AddSpeciesModal: React.FC<AddSpeciesModalProps> = ({ isOpen, onClose, onSave, existingIds, speciesToEdit }) => {
  const initialFormState: Species = {
    id: '',
    name: '',
    scientificName: '',
    family: '',
    order: '',
    description: '',
    habitat: '',
    location: '',
    pointNumber: '',
    captureDate: '',
    fishingGear: '',
    imageUrl: '',
  };
  
  const [formData, setFormData] = useState<Species>(initialFormState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [idError, setIdError] = useState('');
  const isEditing = !!speciesToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setFormData(speciesToEdit);
        setImagePreview(speciesToEdit.imageUrl);
        setIdError('');
      } else {
        setFormData(initialFormState);
        setImagePreview(null);
        setIdError('');
      }
    }
  }, [isOpen, speciesToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'id' && !isEditing) { // Only check ID for new species
      const formattedValue = value.toUpperCase().replace(/\s/g, '');
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      if (existingIds.includes(formattedValue)) {
        setIdError('Este código já está em uso.');
      } else {
        setIdError('');
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, imageUrl: result }));
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.scientificName) {
      alert("Por favor, preencha o Nome e o Nome Científico primeiro.");
      return;
    }
    setIsGenerating(true);
    const description = await generateDescription(formData.name, formData.scientificName);
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (idError || !formData.id || !formData.name || !formData.scientificName) {
      alert("Por favor, preencha todos os campos obrigatórios e corrija os erros.");
      return;
    }
    const finalSpecies: Species = {
      ...formData,
      imageUrl: formData.imageUrl || `https://via.placeholder.com/400x300.png?text=${formData.name.replace(/\s/g, '+')}`,
    };
    onSave(finalSpecies);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Editar Espécie' : 'Adicionar Nova Espécie'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">Código Único *</label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} required disabled={isEditing} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed" />
            {idError && <p className="text-red-500 text-xs mt-1">{idError}</p>}
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Comum *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700">Nome Científico *</label>
            <input type="text" name="scientificName" value={formData.scientificName} onChange={handleChange} required className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="family" className="block text-sm font-medium text-gray-700">Família</label>
              <input type="text" name="family" value={formData.family} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700">Ordem</label>
              <input type="text" name="order" value={formData.order} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="captureDate" className="block text-sm font-medium text-gray-700">Data de Captura</label>
                <input type="date" name="captureDate" value={formData.captureDate} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="fishingGear" className="block text-sm font-medium text-gray-700">Arte de Pesca</label>
                <input type="text" name="fishingGear" value={formData.fishingGear} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Local da Captura</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="pointNumber" className="block text-sm font-medium text-gray-700">Número do Ponto</label>
                <input type="text" name="pointNumber" value={formData.pointNumber} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
           <div>
            <div className="flex justify-between items-center">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    <SparklesIcon />
                    {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                </button>
            </div>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="habitat" className="block text-sm font-medium text-gray-700">Habitat</label>
            <input type="text" name="habitat" value={formData.habitat} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Imagem da Espécie</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Pré-visualização da espécie" className="mx-auto h-24 w-auto rounded-md object-contain" />
                ) : (
                  <UploadIcon />
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Carregar um arquivo</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white py-4 px-5 -m-5 border-t">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition">Cancelar</button>
            <button type="submit" disabled={!!idError} className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition disabled:bg-blue-300 disabled:cursor-not-allowed">{isEditing ? 'Salvar Alterações' : 'Adicionar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpeciesModal;