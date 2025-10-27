import React, { useState, useMemo } from 'react';
import { Species, Collection, AppData } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SpeciesList from './components/SpeciesList';
import AddSpeciesModal from './components/AddSpeciesModal';
import { PlusIcon, UserIcon, CollectionIcon } from './components/Icons';
import ConfirmationModal from './components/ConfirmationModal';
import ManageCollectionModal from './components/ManageCollectionModal';

// Helper to generate a unique enough ID
const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

const App: React.FC = () => {
  const [appData, setAppData] = useLocalStorage<AppData>('ciuema-app-data', {
    collections: {},
    currentUser: null,
  });

  const [userIdInput, setUserIdInput] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionImage, setNewCollectionImage] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  
  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [speciesToEdit, setSpeciesToEdit] = useState<Species | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [speciesToDelete, setSpeciesToDelete] = useState<Species | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  const activeCollection = useMemo(() => {
    if (!activeCollectionId) return null;
    return appData.collections[activeCollectionId] || null;
  }, [appData.collections, activeCollectionId]);

  const userCollections = useMemo(() => {
    if (!appData.currentUser) return [];
    return Object.values(appData.collections).filter(c => c.authorizedUsers.includes(appData.currentUser!));
  }, [appData.collections, appData.currentUser]);

  const filteredSpecies = useMemo(() => {
    const speciesList = activeCollection?.species || [];
    if (!searchTerm) {
      return speciesList;
    }
    return speciesList.filter(species =>
      species.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeCollection, searchTerm]);

  const handleLogin = () => {
    if (userIdInput.trim()) {
      setAppData(prev => ({ ...prev, currentUser: userIdInput.trim() }));
    }
  };

  const handleLogout = () => {
    setAppData(prev => ({ ...prev, currentUser: null }));
    setActiveCollectionId(null);
    setUserIdInput('');
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim() || !appData.currentUser) return;
    const newId = generateId();
    const newCollection: Collection = {
      id: newId,
      name: newCollectionName,
      ownerId: appData.currentUser,
      imageUrl: newCollectionImage || `https://picsum.photos/seed/${newId}/500/300`,
      species: [],
      authorizedUsers: [appData.currentUser],
    };
    setAppData(prev => ({
      ...prev,
      collections: { ...prev.collections, [newId]: newCollection }
    }));
    setActiveCollectionId(newId);
    setNewCollectionName('');
    setNewCollectionImage(null);
    setIsCreatingCollection(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewCollectionImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSpecies = (speciesData: Species) => {
    if (!activeCollectionId) return;
    setAppData(prev => {
      const collections = { ...prev.collections };
      const collection = { ...collections[activeCollectionId] };
      const existingIndex = collection.species.findIndex(s => s.id === speciesData.id);

      if (existingIndex > -1) {
        // Update
        collection.species[existingIndex] = speciesData;
      } else {
        // Add new
        collection.species.push(speciesData);
      }
      collections[activeCollectionId] = collection;
      return { ...prev, collections };
    });
    setIsAddEditModalOpen(false);
    setSpeciesToEdit(null);
  };

  const handleEditClick = (species: Species) => {
    setSpeciesToEdit(species);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteClick = (species: Species) => {
    setSpeciesToDelete(species);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!activeCollectionId || !speciesToDelete) return;
    setAppData(prev => {
      const collections = { ...prev.collections };
      const collection = { ...collections[activeCollectionId] };
      collection.species = collection.species.filter(s => s.id !== speciesToDelete.id);
      collections[activeCollectionId] = collection;
      return { ...prev, collections };
    });
    setIsDeleteModalOpen(false);
    setSpeciesToDelete(null);
  };

  const handleUpdateCollection = (updatedCollection: Collection) => {
     setAppData(prev => ({
      ...prev,
      collections: { ...prev.collections, [updatedCollection.id]: updatedCollection }
    }));
  }

  // --- RENDER LOGIC ---

  if (!appData.currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-xl shadow-2xl">
          <div className="text-center mb-6">
             <h1 className="text-2xl font-bold text-blue-600">CIUEMA</h1>
             <p className="text-gray-500">Coleção Ictiológica</p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="userId" className="text-sm font-medium text-gray-700">Seu ID de Usuário</label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="userId"
                  type="text"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  placeholder="ex: jsilva"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={!userIdInput.trim()}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeCollectionId) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Bem-vindo, {appData.currentUser}!</h1>
            <button onClick={handleLogout} className="text-sm text-blue-600 hover:underline">Sair</button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Criar Nova Coleção</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                value={newCollectionName} 
                onChange={e => setNewCollectionName(e.target.value)} 
                placeholder="Nome da coleção"
                className="flex-grow bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
               <label htmlFor="collection-image" className="cursor-pointer text-center bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                {newCollectionImage ? 'Imagem Carregada' : 'Foto da Coleção'}
               </label>
               <input id="collection-image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
              <button 
                onClick={handleCreateCollection}
                disabled={!newCollectionName.trim()}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition"
              >
                Criar
              </button>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-gray-600">Ou selecione uma coleção existente</h2>
          {userCollections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCollections.map(col => (
                <div key={col.id} onClick={() => setActiveCollectionId(col.id)} className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl hover:scale-105 transition-transform duration-300">
                  <img src={col.imageUrl} alt={col.name} className="w-full h-32 object-cover"/>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800">{col.name}</h3>
                    <p className="text-sm text-gray-500">Dono: {col.ownerId}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <CollectionIcon className="mx-auto h-12 w-12 text-gray-300"/>
              <p className="mt-4 text-gray-500">Nenhuma coleção encontrada.</p>
              <p className="text-sm text-gray-400">Crie uma nova coleção para começar.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <Header 
        collectionName={activeCollection?.name || ''}
        collectionImageUrl={activeCollection?.imageUrl}
        onManage={() => setIsManageModalOpen(true)}
        onLogout={handleLogout}
        isOwner={activeCollection?.ownerId === appData.currentUser}
        onBackToCollections={() => setActiveCollectionId(null)}
      />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <SearchBar onSearch={setSearchTerm} />
          <button
            onClick={() => { setSpeciesToEdit(null); setIsAddEditModalOpen(true); }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <PlusIcon />
            Adicionar Espécie
          </button>
        </div>

        <SpeciesList 
          species={filteredSpecies} 
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </main>
      
      <AddSpeciesModal
        isOpen={isAddEditModalOpen}
        onClose={() => { setIsAddEditModalOpen(false); setSpeciesToEdit(null); }}
        onSave={handleSaveSpecies}
        existingIds={activeCollection?.species.map(s => s.id) || []}
        speciesToEdit={speciesToEdit}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={`Você tem certeza que deseja apagar a espécie "${speciesToDelete?.name}" (${speciesToDelete?.id})? Esta ação não pode ser desfeita.`}
      />

      {activeCollection && (
        <ManageCollectionModal
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          collection={activeCollection}
          onSave={handleUpdateCollection}
        />
      )}
    </div>
  );
};

export default App;