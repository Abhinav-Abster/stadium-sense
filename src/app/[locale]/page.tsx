import ChatPanel from '@/components/ChatPanel';
import CrowdStatusPanel from '@/components/CrowdStatusPanel';
import TransportTipPanel from '@/components/TransportTipPanel';

/**
 * Localized home page component.
 * Lays out the three core StadiumSense features in a responsive, semantic grid.
 */
export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Visual background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[800px] w-[800px] -translate-x-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute right-[10%] top-[40%] h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column — Chat and Transport Tip */}
        <div className="lg:col-span-5 space-y-8">
          <ChatPanel />
          <TransportTipPanel />
        </div>

        {/* Right Column — Crowd Status operations widget */}
        <div className="lg:col-span-7 h-full">
          <CrowdStatusPanel />
        </div>
      </div>
    </div>
  );
}
