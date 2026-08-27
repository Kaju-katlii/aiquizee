import React, { useState } from 'react';
import { Key, X, Check, ExternalLink } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [key, setKey] = useState(getStoredApiKey());
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(key);
    onKeySaved(key);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#16161D] border border-[#2E2E38] rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9090A8] hover:text-white hover:bg-[#2E2E38] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#7C6AF7]/15 border border-[#7C6AF7]/40 flex items-center justify-center text-[#7C6AF7]">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-[#F0F0F5]">Gemini API Key</h3>
            <p className="text-xs text-[#9090A8]">Required for client-side quiz generation</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9090A8] mb-2">
              Your API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 bg-[#0F0F11] border border-[#2E2E38] rounded-xl text-[#F0F0F5] placeholder-[#5A5A70] text-sm outline-none focus:border-[#7C6AF7] focus:ring-2 focus:ring-[#7C6AF7]/20"
              autoFocus
            />
          </div>

          <div className="text-xs text-[#9090A8] leading-relaxed bg-[#0F0F11] p-3 rounded-xl border border-[#2E2E38]">
            <span>Need a free Gemini API key? </span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[#7C6AF7] hover:underline inline-flex items-center gap-1 font-medium"
            >
              Get one in Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#7C6AF7] hover:bg-[#6B59E8] text-white py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(124,106,247,0.3)]"
            >
              {showSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-[#0F0F11] hover:bg-[#1E1E28] border border-[#2E2E38] text-[#9090A8] hover:text-[#F0F0F5] rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
