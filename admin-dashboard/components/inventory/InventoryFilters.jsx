import React from 'react';

export default function InventoryFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  selectedSource,
  onSourceChange,
  selectedStatus,
  onStatusChange,
  showMatchedOnly,
  onShowMatchedOnlyChange,
  costPriceFrom,
  onCostPriceFromChange,
  costPriceTo,
  onCostPriceToChange,
  sellingPriceFrom,
  onSellingPriceFromChange,
  sellingPriceTo,
  onSellingPriceToChange,
  categories,
  brands,
  sources,
  statuses}) {
  return (
    <div className='bg-white rounded-lg shadow mb-6'>
      <div className='p-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />

          <select
            value={selectedCategory}
            onChange={e => onCategoryChange(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={e => onBrandChange(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            value={selectedSource}
            onChange={e => onSourceChange(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => onStatusChange(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='all'>All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div className='flex items-center space-x-2'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={showMatchedOnly}
                onChange={e => onShowMatchedOnlyChange(e.target.checked)}
                className='mr-2'
              />
              <span className='text-sm'>Matched Only</span>
            </label>
          </div>
        </div>

        {/* Price Range Filters */}
        <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium text-gray-700'>Cost Price: </span>
            <input
              type='number'
              placeholder='From'
              value={costPriceFrom}
              onChange={e => onCostPriceFromChange(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20'
            />
            <span className='text-sm text-gray-500'>to</span>
            <input
              type='number'
              placeholder='To'
              value={costPriceTo}
              onChange={e => onCostPriceToChange(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20'
            />
          </div>

          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium text-gray-700'>Selling Price: </span>
            <input
              type='number'
              placeholder='From'
              value={sellingPriceFrom}
              onChange={e => onSellingPriceFromChange(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20'
            />
            <span className='text-sm text-gray-500'>to</span>
            <input
              type='number'
              placeholder='To'
              value={sellingPriceTo}
              onChange={e => onSellingPriceToChange(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-20'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
