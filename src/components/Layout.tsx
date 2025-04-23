import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Share2, LogOut, HelpCircle, Link } from 'lucide-react';
import { CustomDomainModal } from './CustomDomainModal';

export const Layout: React.FC = () => {
  const { user, signOut, customDomain } = useAuthStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
  const shareUrl = customDomain 
    ? `${window.location.origin}/share/${customDomain}`
    : `${window.location.origin}/share/${user?.id}`;

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  };

  return (
    <div>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold">Ark Dino Tracker</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0">
              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md w-full sm:w-auto justify-center sm:justify-start"
              >
                <HelpCircle size={16} />
                Help
              </button>
              <button
                onClick={() => setShowDomainModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md w-full sm:w-auto justify-center sm:justify-start"
              >
                <Link size={16} />
                Custom Domain
              </button>
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md w-full sm:w-auto justify-center sm:justify-start"
                >
                  <Share2 size={16} />
                  Share Collection
                </button>
                {showCopyNotification && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap">
                    Link copied to clipboard!
                  </div>
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md w-full sm:w-auto justify-center sm:justify-start"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Help & FAQ</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">How to Setup</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Add a dinosaur from the "All Dinos" list</li>
                  <li>Create categories for your dino (e.g., "Stats", "Colors")</li>
                  <li>Upload images to each category with their color IDs</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">Image Requirements</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Supported formats: PNG, JPG</li>
                  <li>Maximum file size: 1MB per image</li>
                  <li>Recommended dimensions: 600x300 pixels</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Need More Help?</h4>
                <p className="text-gray-600">
                  Contact twilizzle on Discord for additional support.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDomainModal && (
        <CustomDomainModal onClose={() => setShowDomainModal(false)} />
      )}
    </div>
  );
};