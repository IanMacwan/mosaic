import TopBar from './components/TopBar';
import MapView from './components/MapView';
import InfoPanel from './components/InfoPanel';
import BottomDrawer from './components/BottomDrawer';

export default function App() {
  return (
    <div data-theme="dark" className="min-h-screen bg-base-100 text-base-content overflow-y-auto">
      <TopBar />

      {/* Map and Drawer Side by Side */}
      <section className="w-full px-4 sm:px-6 lg:px-12 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Drawer */}
          <div className="lg:col-span-1">
            <BottomDrawer />
          </div>

          {/* Right Panel: Map */}
          <div className="lg:col-span-2 rounded-3xl bg-base-200/50 backdrop-blur-md shadow-lg overflow-hidden h-[600px]">
            <MapView />
          </div>
        </div>
      </section>

      <InfoPanel />
    </div>
  );
}
