import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Share2, LogOut, Link, Search, Leaf, Menu, X } from 'lucide-react';
import { CustomDomainModal } from './CustomDomainModal';
import { MasterList } from './MasterList';

export const Layout: React.FC = () => {
  const { user, signOut, customDomain } = useAuthStore();
  const [showDomainModal, setShowDomainModal] = React.useState(false);
  const [showCopyNotification, setShowCopyNotification] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const shareUrl = customDomain 
    ? `${window.location.origin}/share/${customDomain}`
    : `${window.location.origin}/share/${user?.id}`;

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 h-16 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Leaf className="text-emerald-500" size={24} />
          <span className="text-lg font-semibold text-white">Ark Tracker</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'block' : 'hidden'
      } md:block w-full md:w-80 bg-[#0A0A0A] border-r border-gray-800 flex-shrink-0 md:sticky md:top-0 md:h-screen`}>
        <div className="hidden md:flex h-16 items-center px-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Leaf className="text-emerald-500" size={24} />
            <span className="text-lg font-semibold text-white">Ark Tracker</span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Dinosaurs
          </h3>
          <MasterList />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Navigation */}
        <div className="h-16 bg-[#0A0A0A] border-b border-gray-800 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Share2 size={20} />
              <span className="text-sm">Share Collection</span>
            </button>
            <button 
              onClick={() => setShowDomainModal(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Link size={20} />
              <span className="text-sm">Custom Domain</span>
            </button>
          </div>
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-[#0A0A0A]">
          <div className="p-4">
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              My Collection
            </h3>
            <Outlet />
          </div>
        </div>
      </div>

      {showCopyNotification && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Link copied to clipboard!
        </div>
      )}

      {showDomainModal && (
        <CustomDomainModal onClose={() => setShowDomainModal(false)} />
      )}
    </div>
  );
};