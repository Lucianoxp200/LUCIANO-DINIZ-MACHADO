import React from 'react';
import { FishIcon, SettingsIcon, LogoutIcon, ArrowLeftIcon } from './Icons';

interface HeaderProps {
  collectionName: string;
  collectionImageUrl?: string;
  isOwner: boolean;
  onManage: () => void;
  onLogout: () => void;
  onBackToCollections: () => void;
}

const Header: React.FC<HeaderProps> = ({ collectionName, collectionImageUrl, isOwner, onManage, onLogout, onBackToCollections }) => {
  return (
    <header className="bg-blue-600 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onBackToCollections} title="Voltar para Seleção de Coleções" className="text-white p-2 rounded-full hover:bg-blue-500 transition">
            <ArrowLeftIcon />
          </button>
          {collectionImageUrl ? (
            <img src={collectionImageUrl} alt="Logo da Coleção" className="h-9 w-9 rounded-full object-cover bg-blue-700 border-2 border-blue-400" />
          ) : (
            <FishIcon className="h-8 w-8 text-yellow-400" />
          )}
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {collectionName}
            </h1>
            <h2 className="text-xs text-blue-200 hidden md:block">
              CIUEMA - Coleção Ictiológica
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isOwner && (
            <button
              onClick={onManage}
              className="flex items-center gap-2 text-white bg-blue-500 hover:bg-blue-400 font-semibold py-2 px-3 rounded-lg transition text-sm"
              title="Gerenciar Coleção"
            >
              <SettingsIcon />
              <span className="hidden md:inline">Gerenciar</span>
            </button>
          )}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-white hover:bg-blue-500 p-2 rounded-lg transition"
            title="Sair"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;