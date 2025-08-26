import React from "react";

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters }) => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold">Filters</h3>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Category</h4>
        <hr className="border-gray-200" />
        <div className="space-y-2">
          {filters.categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filtersState.category === category}
                onChange={(e) =>
                  setFiltersState({
                    ...filtersState,
                    category: e.target.value,
                  })
                }
                className="h-4 w-4"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear */}
      <button
        onClick={clearFilters}
        className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
      >
        <i className="ri-refresh-line" />
        Clear all filters
      </button>
    </div>
  );
};

export default ShopFiltering;
