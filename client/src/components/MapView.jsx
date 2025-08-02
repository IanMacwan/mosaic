import Map, { Marker, Popup } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import facilities from '../data/mockFacilities';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl'; 

export default function MapView() {
  const [popup, setPopup] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mapboxgl-popup') && !e.target.closest('.marker-btn')) {
        setPopup(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: -79.3832, latitude: 43.6532, zoom: 12 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://tiles.openfreemap.org/styles/dark"
      mapLib={maplibregl} 
    >
      {facilities.map((f) => (
        <Marker key={f.id} longitude={f.lon} latitude={f.lat}>
          <button
            className="marker-btn w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow-md hover:scale-125 transition"
            onClick={(e) => {
              e.stopPropagation();
              setPopup(f);
            }}
            title={f.name}
          />
        </Marker>
      ))}

      {popup && (
        <Popup
          longitude={popup.lon}
          latitude={popup.lat}
          anchor="top"
          onClose={() => setPopup(null)}
          closeOnClick={false}
        >
          <div className="card bg-base-100 p-4 text-sm shadow-md w-64 rounded-xl">
            <h3 className="card-title text-accent-content text-lg">{popup.name}</h3>
            <p className="text-sm text-base-content">
              {popup.type} •{' '}
              <span className={popup.open ? 'text-success' : 'text-error'}>
                {popup.open ? 'Open' : 'Closed'}
              </span>
            </p>
            <div className="mt-3 flex gap-2">
              <button className="btn btn-sm btn-outline btn-success">Ask Gemini</button>
              <button className="btn btn-sm btn-outline btn-info">Get Directions</button>
            </div>
          </div>
        </Popup>

      )}
    </Map>
  );
}
