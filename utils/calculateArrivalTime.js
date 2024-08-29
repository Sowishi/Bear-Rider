export default function calculateArrivalTime(distanceKm, speedKmh) {
  // Convert speed from km/h to km/min
  const speedKmMin = speedKmh / 60;

  // Calculate time in minutes
  const timeMin = distanceKm / speedKmMin;

  // Return the time in minutes
  return Math.round(timeMin);
}
