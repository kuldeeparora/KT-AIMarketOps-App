import React from 'react';

export default function InventoryPagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  startIndex,
  endIndex}) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className='flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6'>
      <div className='flex flex-1 justify-between sm:hidden'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Next
        </button>
      </div>

      <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm text-gray-700'>
            Showing <span className='font-medium'>{startIndex + 1}</span> to{' '}
            <span className='font-medium'>{endIndex}</span> of{' '}
            <span className='font-medium'>{totalItems}</span> results
          </p>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <span className='text-sm text-gray-700'>Items per page: </span>
            <select
              value={itemsPerPage}
              onChange={e => onItemsPerPageChange(parseInt(e.target.value))}
              className='border border-gray-300 rounded-md px-2 py-1 text-sm'
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div>
            <nav
              className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
              aria-label='Pagination'
            >
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <span className='sr-only'>Previous</span>←
              </button>

              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => (typeof page === 'number' ? onPageChange(page) : null)}
                  disabled={page === '...'}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : page === '...'
                        ? 'bg-white border-gray-300 text-gray-500 cursor-default'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <span className='sr-only'>Next</span>→
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
