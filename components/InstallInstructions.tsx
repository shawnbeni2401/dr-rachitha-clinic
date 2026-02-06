
import React from 'react';
import { ChromeIcon } from './icons/ChromeIcon';
import { AppleIcon } from './icons/AppleIcon';
import { AndroidIcon } from './icons/AndroidIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ShareIcon } from './icons/ShareIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { MenuIcon } from './icons/MenuIcon';

interface InstallInstructionsProps {
  deferredPrompt: any;
  handleInstall: () => void;
}

const InstructionCard: React.FC<{ icon: React.ReactNode; title: string; steps: string[]; visualGuide?: React.ReactNode }> = ({ icon, title, steps, visualGuide }) => (
    <div className="bg-brand-background p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
            <div className="flex-shrink-0 text-brand-primary">{icon}</div>
            <div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
                <ol className="list-decimal list-inside space-y-2 text-text-secondary">
                    {steps.map((step, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: step }}></li>
                    ))}
                </ol>
            </div>
        </div>
        {visualGuide && <div className="mt-4 p-4 bg-slate-200 rounded-lg">{visualGuide}</div>}
    </div>
);


export const InstallInstructions: React.FC<InstallInstructionsProps> = ({ deferredPrompt, handleInstall }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-brand-surface rounded-xl shadow-lg border border-gray-200 animate-fade-in-up">
      <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-2 text-center">Install Your Clinic Companion</h2>
      <p className="text-lg text-text-secondary mb-8 text-center">
        Access the app instantly from your desktop or phone home screen.
      </p>

      {deferredPrompt && (
        <div className="bg-brand-accent-light border-l-4 border-brand-accent p-6 rounded-lg mb-8 text-center">
          <h3 className="text-2xl font-bold text-text-primary mb-2">Easiest Way to Install!</h3>
          <p className="text-text-secondary mb-4">Your browser supports direct installation. Click the button below.</p>
          <button 
            onClick={handleInstall} 
            className="bg-brand-accent text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-600 transition duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
          >
            <DownloadIcon className="w-6 h-6" />
            Install App Now
          </button>
        </div>
      )}

      <div className="space-y-8">
        <InstructionCard 
            icon={<ChromeIcon className="w-16 h-16" />}
            title="On Your Desktop (Chrome or Edge)"
            steps={[
                "Look for the <strong>Install icon</strong> in your browser's address bar (top right).",
                "Click the icon and then select <strong>'Install'</strong> from the prompt.",
                "The app will be added to your desktop or applications folder."
            ]}
            visualGuide={
                <div>
                    <div className="bg-gray-300 rounded-t-lg p-2 flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-400 rounded-full block"></span>
                        <span className="w-3 h-3 bg-yellow-400 rounded-full block"></span>
                        <span className="w-3 h-3 bg-green-400 rounded-full block"></span>
                    </div>
                    <div className="bg-white p-2 rounded-b-lg flex items-center border border-gray-300 text-sm">
                        <span className="text-gray-400 pr-2">{'< >'}</span>
                        <div className="flex-grow bg-gray-100 rounded-full mx-2 px-4 py-1 text-gray-600">
                            https://dr-rachithas-clinic.app
                        </div>
                        <div className="ml-2 p-1.5 bg-brand-accent-light rounded-full ring-2 ring-brand-accent animate-pulse">
                            <DownloadIcon className="w-5 h-5 text-brand-accent" />
                        </div>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">The install icon looks like this.</p>
                </div>
            }
        />
        <InstructionCard 
            icon={<AppleIcon className="w-16 h-16" />}
            title="On Your iPhone or iPad (Safari)"
            steps={[
                "Tap the <strong>'Share'</strong> button at the bottom of the screen.",
                "Scroll down the list and tap on <strong>'Add to Home Screen'</strong>.",
                "Confirm by tapping <strong>'Add'</strong> in the top right corner."
            ]}
            visualGuide={
                <div className="space-y-4">
                     <div>
                        <div className="w-full max-w-sm mx-auto bg-gray-100/80 p-2 flex justify-around items-center rounded-lg border-2 border-gray-300">
                           <span className="text-gray-400 text-2xl font-light">{'<'}</span>
                           <span className="text-gray-400 text-2xl font-light">{'>'}</span>
                           <div className="p-2 ring-2 ring-brand-accent rounded-md animate-pulse">
                               <ShareIcon className="w-6 h-6 text-brand-accent" />
                           </div>
                           <span className="text-gray-400 text-sm">[+]</span>
                           <span className="text-gray-400 text-sm">Aa</span>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">1. Tap the Share button.</p>
                     </div>
                      <div>
                        <div className="w-full max-w-sm mx-auto bg-white/80 p-3 rounded-lg border-2 border-gray-300 space-y-2">
                           <div className="text-gray-400 text-sm">... other options</div>
                           <div className="flex items-center gap-3 p-2 bg-brand-accent-light rounded-md ring-2 ring-brand-accent animate-pulse">
                               <PlusCircleIcon className="w-7 h-7 text-brand-accent" />
                               <span className="font-semibold text-text-primary">Add to Home Screen</span>
                           </div>
                           <div className="text-gray-400 text-sm">... other options</div>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">2. Then select 'Add to Home Screen'.</p>
                     </div>
                </div>
            }
        />
        <InstructionCard 
            icon={<AndroidIcon className="w-16 h-16" />}
            title="On Your Android Phone (Chrome)"
            steps={[
                "Tap the <strong>three-dot menu icon</strong> in the top right corner.",
                "Select <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong> from the menu.",
                "Follow the on-screen prompts to add the app icon."
            ]}
             visualGuide={
                <div className="space-y-4">
                     <div>
                        <div className="w-full max-w-sm mx-auto bg-white/80 p-2 flex justify-end items-center rounded-lg border-2 border-gray-300">
                           <div className="p-1.5 ring-2 ring-brand-accent rounded-md animate-pulse">
                               <MenuIcon className="w-6 h-6 text-brand-accent" />
                           </div>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">1. Tap the Menu button.</p>
                     </div>
                      <div>
                        <div className="w-full max-w-sm mx-auto bg-white/80 p-3 rounded-lg border-2 border-gray-300 space-y-2">
                           <div className="text-gray-400 text-sm">... other options</div>
                           <div className="flex items-center gap-3 p-2 bg-brand-accent-light rounded-md ring-2 ring-brand-accent animate-pulse">
                               <DownloadIcon className="w-6 h-6 text-brand-accent" />
                               <span className="font-semibold text-text-primary">Install app</span>
                           </div>
                           <div className="text-gray-400 text-sm">... other options</div>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">2. Then select 'Install app'.</p>
                     </div>
                </div>
            }
        />
      </div>
    </div>
  );
};