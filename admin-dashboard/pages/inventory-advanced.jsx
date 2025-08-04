import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function InventoryAdvanced() {
  console.log('🎯 InventoryAdvanced component rendered');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMatchedOnly, setShowMatchedOnly] = useState(false);
  const [costPriceRange, setCostPriceRange] = useState({ from: '', to: '' });
  const [sellingPriceRange, setSellingPriceRange] = useState({ from: '', to: '' });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    console.log('🔄 useEffect called in InventoryAdvanced');
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterCategory, filterBrand, filterSource, filterStatus, showMatchedOnly, costPriceRange, sellingPriceRange]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for products,
  const mockProducts = [
    {
      id: 1,
      name: '0.6kg Powder Fire Extinguishers for Cars, Caravans and Travel - Firechief',
      sku: 'HSFMP600',
      brand: 'Unknown Brand',
      source: 'Shopify',
      stock: 20,
      costPrice: null,
      sellingPrice: 14.15,
      status: 'In Stock',
      category: 'General'
    },
    {
      id: 2,
      name: '0.8kg Powder Fire Extinguishers for Cars, Caravans and Travel - Firechief',
      sku: 'HSFMP800',
      brand: 'Unknown Brand',
      source: 'Shopify',
      stock: 20,
      costPrice: null,
      sellingPrice: 19.67,
      status: 'In Stock',
      category: 'General'
    },
    {
      id: 3,
      name: '1 KG Small Automatic Powder Fire Extinguishers',
      sku: 'FIFBA-P1',
      brand: 'Unknown Brand',
      source: 'Shopify',
      stock: 15,
      costPrice: null,
      sellingPrice: 33.23,
      status: 'In Stock',
      category: 'General'
    },
    {
      id: 4,
      name: '1ltr+ Water Mist Fire Extinguisher - UltraFire',
      sku: 'UFSWM1',
      brand: 'Unknown Brand',
      source: 'Shopify',
      stock: 0,
      costPrice: null,
      sellingPrice: 54.90,
      status: 'Out of Stock',
      category: 'General'
    },
    {
      id: 5,
      name: '2 KG Small Automatic Powder Fire Extinguishers',
      sku: 'FIFBA-P2',
      brand: 'Unknown Brand',
      source: 'Shopify',
      stock: 5,
      costPrice: null,
      sellingPrice: 42.59,
      status: 'Low Stock',
      category: 'General'
    }
  ];

      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);

    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Brand filter
    if (filterBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === filterBrand);
    }

    // Source filter
    if (filterSource !== 'all') {
      filtered = filtered.filter(product => product.source === filterSource);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(product => product.status === filterStatus);
    }

    // Matched only filter
    if (showMatchedOnly) {
      filtered = filtered.filter(product => product.costPrice !== null);
    }

    // Cost price range filter
    if (costPriceRange.from || costPriceRange.to) {
      filtered = filtered.filter(product => {
        if (!product.costPrice) return false;
        const price = parseFloat(product.costPrice);
        const from = costPriceRange.from ? parseFloat(costPriceRange.from) : 0;
        const to = costPriceRange.to ? parseFloat(costPriceRange.to) : Infinity;
        return price >= from && price <= to;
      });
    }

    // Selling price range filter
    if (sellingPriceRange.from || sellingPriceRange.to) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.sellingPrice);
        const from = sellingPriceRange.from ? parseFloat(sellingPriceRange.from) : 0;
        const to = sellingPriceRange.to ? parseFloat(sellingPriceRange.to) : Infinity;
        return price >= from && price <= to;
      });
    }

    setFilteredProducts(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'green';
      case 'Low Stock': return 'yellow';
      case 'Out of Stock': return 'red';
    default: return 'gray';
  }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'sellingPrice' || sortBy === 'costPrice') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const paginatedProducts = sortedProducts.slice(
    (page - 1) * itemsPerPage,
  page * itemsPerPage
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading inventory data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Advanced Inventory Management - Kent Traders Admin</title>
        <meta name="description" content="Advanced inventory management with comprehensive filter,ing and analytics" />
      </Head>

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Inventory Management</h1>
          <p className="text-gray-600 mt-2">Manage your inventory across multiple platforms with advanced analytics</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Show Health Dashboard
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Show Analytics
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Save Search
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search products...</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name or SKU..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">All Categories</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Categories</option>
                <option value="General">General</option>
                <option value="Electronics">Electronics</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">All Brands</label>
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Brands</option>
                <option value="Unknown Brand">Unknown Brand</option>
                <option value="Firechief">Firechief</option>
                <option value="UltraFire">UltraFire</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">All Sources</label>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Sources</option>
                <option value="Shopify">Shopify</option>
                <option value="SellerDynamics">SellerDynamics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">All Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="matchedOnly"
                checked={showMatchedOnly}
                onChange={(e) => setShowMatchedOnly(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="matchedOnly" className="text-sm font-medium text-gray-700">
                Matched Only
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price: </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="From"
                  value={costPriceRange.from}
                  onChange={(e) => setCostPriceRange(prev => ({ ...prev, from: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500 self-center">to</span>
                <input
                  type="number"
                  placeholder="To"
                  value={costPriceRange.to}
                  onChange={(e) => setCostPriceRange(prev => ({ ...prev, to: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price: </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="From"
                  value={sellingPriceRange.from}
                  onChange={(e) => setSellingPriceRange(prev => ({ ...prev, from: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500 self-center">to</span>
                <input
                  type="number"
                  placeholder="To"
                  value={sellingPriceRange.to}
                  onChange={(e) => setSellingPriceRange(prev => ({ ...prev, to: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {((page - 1) * itemsPerPage) + 1}-{Math.min(page * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Sort by: </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="name-asc">Name ↑</option>
              <option value="name-desc">Name ↓</option>
              <option value="sku-asc">SKU ↑</option>
              <option value="sku-desc">SKU ↓</option>
              <option value="sellingPrice-asc">Price ↑</option>
              <option value="sellingPrice-desc">Price ↓</option>
              <option value="stock-asc">Stock ↑</option>
              <option value="stock-desc">Stock ↓</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Show: </label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.costPrice ? `£${product.costPrice.toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    £{product.sellingPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${getStatusColor(product.status)}-100 text-${getStatusColor(product.status)}-800`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-green-600 hover:text-green-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <span className="mx-4 text-sm text-gray-700">
              Page {page} of {Math.ceil(filteredProducts.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(filteredProducts.length / itemsPerPage)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
