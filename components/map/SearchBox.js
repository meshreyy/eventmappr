import { useEffect } from 'react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';
import 'leaflet-geosearch/dist/geosearch.css';

export default function SearchBox({ onSearch }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      autoClose: true,
      keepResult: true,
    });

    map.addControl(searchControl);

    // Define callback separately to properly remove it
    const onShowLocation = (result) => {
      if (result?.location) {
        const { x: lng, y: lat } = result.location;
        if (onSearch) onSearch({ lat, lng });
      }
    };

    map.on('geosearch/showlocation', onShowLocation);

    return () => {
      map.off('geosearch/showlocation', onShowLocation);
      map.removeControl(searchControl);
    };
  }, [map, onSearch]);

  return null;
}
