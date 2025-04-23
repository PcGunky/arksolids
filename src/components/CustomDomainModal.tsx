import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';

export const CustomDomainModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, setCustomDomain, customDomain: currentDomain } = useAuthStore();
  const [domain, setDomain] = useState(currentDomain || '');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    
    const cleanDomain = domain.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
    if (!cleanDomain) {
      setError('Please enter a valid domain name');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      // Check if domain is already taken
      const { data: existingDomain } = await supabase
        .from('user_domains')
        .select('domain')
        .eq('domain', cleanDomain)
        .not('user_id', 'eq', user.id)
        .single();

      if (existingDomain) {
        setError('This domain is already taken');
        return;
      }

      // Update or insert the domain
      const { error: upsertError } = await supabase
        .from('user_domains')
        .upsert({
          user_id: user.id,
          domain: cleanDomain
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      setCustomDomain(cleanDomain);
      onClose();
    } catch (err) {
      console.error('Error setting custom domain:', err);
      setError('Failed to set custom domain');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Set Custom Domain</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Domain
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">/share/</span>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="your-domain"
              className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Only letters, numbers, and hyphens are allowed
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isChecking}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isChecking ? 'Checking...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};