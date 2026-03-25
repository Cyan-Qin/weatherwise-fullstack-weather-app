import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { WeatherResponse } from "../types/weather";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type Props = {
  data: WeatherResponse;
};

delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


export default function WeatherMap({ data }: Props) {
  const { lat, lon, name, country } = data.location;

  return (
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="mt-2 text-sm text-slate-500">
          Map visualization based on the queried location coordinates.
        </p>

        <div className="mt-4 overflow-hidden rounded-xl">
          <MapContainer
              key={`${lat}-${lon}`}
              center={[lat, lon]}
              zoom={10}
              scrollWheelZoom={false}
              style={{height: "360px", width: "100%"}}
          >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://cdn.lima-labs.com/{z}/{x}/{y}.png?api=demo"
            />
            <Marker position={[lat, lon]}>
              <Popup>
                {name}
                {country ? `, ${country}` : ""}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>
  );
}