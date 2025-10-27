import React, { useState, useEffect } from 'react';
import { Collection } from '../types';
import { XIcon, TrashIcon } from './Icons';

interface ManageCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
  onSave: (collection: Collection) => void;
}

const ManageCollectionModal: React.FC<ManageCollectionModalProps> = ({ isOpen, onClose, collection, onSave }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [newUserId, setNewUserId] = useState('');

  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setImageUrl(collection.imageUrl);
      setUsers(collection.authorizedUsers);
    }
  }, [collection, isOpen]);

  const handleAddUser = () => {
    if (newUserId && !users.includes(newUserId)) {
      setUsers([...users, newUserId]);
      setNewUserId('');
    }
  };

  const handleRemoveUser = (userIdToRemove: string) => {
    if (userIdToRemove === collection.ownerId) {
        alert("Não é possível remover o dono da coleção.");
        return;
    }
    setUsers(users.filter(u => u !== userIdToRemove));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedCollection = {
      ...collection,
      name,
      imageUrl,
      authorizedUsers: users,
    };
    onSave(updatedCollection);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Gerenciar Coleção</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon />
          </button>
        </div>
        <div className="p-5 space-y-6">
          <div>
            <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700">Nome da Coleção</label>
            <input type="text" id="collectionName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="collectionImage" className="block text-sm font-medium text-gray-700">Imagem da Coleção</label>
             <div className="mt-1 flex items-center gap-4">
                <img src={imageUrl} alt="Capa da coleção" className="h-16 w-16 rounded-md object-cover bg-gray-100" />
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span>Alterar Imagem</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                </label>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Usuários Autorizados</h3>
            <div className="space-y-2">
              {users.map(user => (
                <div key={user} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                  <span className="text-sm text-gray-800">{user} {user === collection.ownerId && '(Dono)'}</span>
                  {user !== collection.ownerId && (
                     <button onClick={() => handleRemoveUser(user)} className="text-red-500 hover:text-red-700">
                        <TrashIcon />
                     </button>
                  )}
                </div>
              ))}
            </div>
             <div className="flex gap-2 mt-3">
                <input type="text" value={newUserId} onChange={e => setNewUserId(e.target.value)} placeholder="ID do novo usuário" className="flex-grow bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                <button onClick={handleAddUser} className="py-2 px-4 bg-blue-100 text-blue-800 font-semibold rounded-md hover:bg-blue-200 transition">Adicionar</button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t sticky bottom-0">
          <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition">Cancelar</button>
          <button type="button" onClick={handleSave} className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition">Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};

export default ManageCollectionModal;
