import React, { useState } from "react";

export default function Filters({ onApply, initial = {} }) {
  const [type, setType] = useState(initial.type || "");
  const [city, setCity] = useState(initial.city || "");
  const [minPrice, setMinPrice] = useState(initial.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice || "");
  const [bedrooms, setBedrooms] = useState(initial.bedrooms || "");
  const [amenities, setAmenities] = useState(initial.amenities ? initial.amenities.split(",") : []);
  const [sortBy, setSortBy] = useState(initial.sortBy || "");
  const [sortOrder, setSortOrder] = useState(initial.sortOrder || "asc");

  const ALL_AMENITIES = ["pool", "garden", "garage", "gym", "parking"];

  const toggleAmenity = (val) => {
    setAmenities(prev => {
      if (prev.includes(val)) return prev.filter(a => a !== val);
      return [...prev, val];
    });
  };

  const apply = () => {
    const filters = {
      ...(type && { type }),
      ...(city && { city }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(bedrooms && { bedrooms }),
      ...(amenities.length && { amenities: amenities.join(",") }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    };
    onApply && onApply(filters);
  };

  const reset = () => {
    setType("");
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setAmenities([]);
    setSortBy("");
    setSortOrder("asc");
    onApply && onApply({});
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Filters</h3>

      <div className="mb-2">
        <label className="block text-sm">Property type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Any</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="office">Office</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-sm">City</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full p-2 border rounded" />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-sm">Min price</label>
          <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type="number" className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Max price</label>
          <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="number" className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-sm">Bedrooms (min)</label>
        <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full p-2 border rounded">
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-sm mb-1">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {ALL_AMENITIES.map(a => (
            <label key={a} className="flex items-center gap-2">
              <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} />
              <span className="capitalize text-sm">{a}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm">Sort by</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Default</option>
            <option value="price">Price</option>
            <option value="createdAt">Newest</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Order</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full p-2 border rounded">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={apply} className="bg-blue-600 text-white px-3 py-2 rounded">Apply</button>
        <button onClick={reset} className="bg-gray-200 px-3 py-2 rounded">Reset</button>
      </div>
    </div>
  );
}
