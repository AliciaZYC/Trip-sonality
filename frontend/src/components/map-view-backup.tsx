import React, { useState, useMemo } from "react";
// @ts-ignore - Ignoring type issues with Google Maps components
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

interface ItineraryLocation {
  id: number;
  name: string;
  position: google.maps.LatLngLiteral;
}
interface MapViewProps {
  highlightedPlace?: string;
}

// Los Angeles coordinates
const losAngelesCoordinates = { lat: 34.0522, lng: -118.2437 };

// Expanded itinerary locations with more places
const itineraryLocations = [
  { id: 1, name: "Hollywood Sign", position: { lat: 34.1341, lng: -118.3215 } },
  {
    id: 2,
    name: "Santa Monica Pier",
    position: { lat: 34.0095, lng: -118.4912 },
  },
  {
    id: 3,
    name: "Griffith Observatory",
    position: { lat: 34.1184, lng: -118.3004 },
  },
  { id: 4, name: "Venice Beach", position: { lat: 33.985, lng: -118.4695 } },
  {
    id: 5,
    name: "Grand Central Market",
    position: { lat: 34.0509, lng: -118.2494 },
  },
  {
    id: 6,
    name: "Hollywood Walk of Fame",
    position: { lat: 34.1016, lng: -118.3267 },
  },
  {
    id: 7,
    name: "TCL Chinese Theatre",
    position: { lat: 34.1022, lng: -118.341 },
  },
  {
    id: 8,
    name: "In-N-Out Burger",
    position: { lat: 34.0981, lng: -118.3375 },
  },
  {
    id: 9,
    name: "Hollywood Bowl",
    position: { lat: 34.1127, lng: -118.3392 },
  },
  {
    id: 10,
    name: "Universal Studios",
    position: { lat: 34.1381, lng: -118.3534 },
  },
  {
    id: 11,
    name: "Grandma's Café",
    position: { lat: 34.0771, lng: -118.2528 },
  },
  {
    id: 12,
    name: "CityWalk",
    position: { lat: 34.1373, lng: -118.3526 },
  },
  {
    id: 13,
    name: "Shake Shack",
    position: { lat: 34.0977, lng: -118.3264 },
  },
  {
    id: 14,
    name: "Getty Center",
    position: { lat: 34.0776, lng: -118.4741 },
  },
  {
    id: 15,
    name: "Sunset Boulevard",
    position: { lat: 34.0967, lng: -118.3425 },
  },
  {
    id: 16,
    name: "Venice Beach Snack Stand",
    position: { lat: 33.9858, lng: -118.4725 },
  },
  {
    id: 17,
    name: "Warner Bros. Studio",
    position: { lat: 34.1538, lng: -118.3371 },
  },
  {
    id: 18,
    name: "Downtown Art District",
    position: { lat: 34.0403, lng: -118.2351 },
  },
  {
    id: 19,
    name: "The Grove Food Court",
    position: { lat: 34.0725, lng: -118.3576 },
  },
];

// Create a separate file called react-app-env.d.ts in the src directory with this content:
// /// <reference types="react-scripts" />
// declare module '@react-google-maps/api';

export const MapView: React.FC<MapViewProps> = ({ highlightedPlace }) => {
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [selectedLoc, setSelectedLoc] = useState<ItineraryLocation | null>(
    null
  );
  const [placeDetails, setPlaceDetails] =
    useState<google.maps.places.PlaceResult | null>(null);

  // Load Google Maps + Places library
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCO7OMyTxvd0--cyNO4muoy7_jpcOEPsEU",
    libraries: ["places"],
  });

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  // Map style options
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      styles: [
        { stylers: [{ saturation: -100 }, { lightness: 0 }] },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [{ color: "#d3edf9" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6f9ba5" }],
        },
        {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: [{ color: "#fffffa" }],
        },
      ],
    }),
    []
  );

  // Map load handler
  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
  };

  // Handle marker click: fetch Google Places details
  const handleMarkerClick = (loc: ItineraryLocation) => {
    setSelectedLoc(loc);
    setPlaceDetails(null);
    if (!mapRef) return;
    const service = new window.google.maps.places.PlacesService(mapRef);
    // First find place by query
    service.findPlaceFromQuery(
      {
        query: loc.name,
        fields: ["place_id"],
        locationBias: loc.position,
      },
      (results, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results.length
        ) {
          const placeId = results[0].place_id!;
          // Then get full details
          service.getDetails(
            {
              placeId,
              fields: [
                "name",
                "formatted_address",
                "rating",
                "opening_hours",
                "formatted_phone_number",
              ],
            },
            (detail, stat) => {
              if (
                stat === window.google.maps.places.PlacesServiceStatus.OK &&
                detail
              ) {
                setPlaceDetails(detail);
              }
            }
          );
        }
      }
    );
  };

  // Determine center & zoom
  const center =
    itineraryLocations.find((loc) => loc.name === highlightedPlace)?.position ||
    losAngelesCoordinates;
  const zoom = highlightedPlace || selectedLoc ? 15 : 12;

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg">
      {/* @ts-ignore */}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {itineraryLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={loc.position}
            title={loc.name}
            onClick={() => handleMarkerClick(loc)}
            // @ts-ignore
            icon={
              loc.name === (highlightedPlace || selectedLoc?.name)
                ? {
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                    fillColor: "#ef4444",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                    scale: 2,
                    anchor: { x: 12, y: 22 },
                  }
                : undefined
            }
          />
        ))}
        {/* Google InfoWindow with real Google details */}
        {selectedLoc && placeDetails && (
          <InfoWindow
            position={selectedLoc.position}
            onCloseClick={() => setSelectedLoc(null)}
          >
            <div className="max-w-xs">
              <h3 className="font-georgia font-semibold mb-1">
                {placeDetails.name}
              </h3>
              <p className="text-sm">{placeDetails.formatted_address}</p>
              {placeDetails.rating && <p>Rating: {placeDetails.rating}</p>}
              {placeDetails.formatted_phone_number && (
                <p>Phone: {placeDetails.formatted_phone_number}</p>
              )}
              {placeDetails.opening_hours?.weekday_text && (
                <ul className="text-xs mt-2 space-y-1">
                  {placeDetails.opening_hours.weekday_text.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};
