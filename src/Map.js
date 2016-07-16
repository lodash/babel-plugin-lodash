export default function MapCtor(entries) {
  return Object.setPrototypeOf(new Map(entries), Object.getPrototypeOf(this));
}

MapCtor.prototype = Map.prototype;
