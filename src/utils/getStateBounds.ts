import stateBounds from "@/data/state-bounds.json";

// Example of fetching bounds using Geocoding API (this would be more complex to integrate)
// You'd need to manage loading states and API calls.
// export const getBoundsForState = async (stateName) => {
//   const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${stateName}, USA&key=${import.meta.env.VITE_GOOGLE_API_KEY}`);
//   const data = await response.json();
//   if (data.results && data.results.length > 0) {
//     const viewport = data.results[0].geometry.viewport;
//     return {
//       north: viewport.northeast.lat,
//       south: viewport.southwest.lat,
//       east: viewport.northeast.lng,
//       west: viewport.southwest.lng,
//     };
//   }
//   return null;
// };

export const getBoundsForState = (stateName?: string) => {
  return stateName ? stateBounds[stateName] || null : null;
};
