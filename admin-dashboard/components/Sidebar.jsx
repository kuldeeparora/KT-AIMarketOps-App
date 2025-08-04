import Link from 'next/link';

export default function Sidebar() {
  return (
    <nav className='mt-6 px-4'>
      <div className='space-y-2'>
        <div>
          <Link
            href='/'
            className='flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-blue-100 text-blue-700'
          >
            <span className='mr-3'>📊</span>Dashboard
          </Link>
        </div>
        <div>
          <button className='flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'>
            <span className='mr-3'>🔔</span>Notifications
            <span className='ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
              3
            </span>
          </button>
        </div>
        <div>
          <Link
            href='/features-overview'
            className='flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          >
            <span className='mr-3'>🌟</span>Features Overview
          </Link>
        </div>
        <div>
          <button className='w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'>
            <div className='flex items-center'>
              <span className='mr-3'>📦</span>Inventory
            </div>
            <svg
              className='w-4 h-4 transition-transform duration-200'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </button>
        </div>
        <div>
          <button className='w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'>
            <div className='flex items-center'>
              <span className='mr-3'>🛒</span>Orders
            </div>
            <svg
              className='w-4 h-4 transition-transform duration-200'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </button>
        </div>
        <div>
          <button className='w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'>
            <div className='flex items-center'>
              <span className='mr-3'>📈</span>Analytics
            </div>
            <svg
              className='w-4 h-4 transition-transform duration-200'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </button>
        </div>
        <div>
          <button className='w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'>
            <div className='flex items-center'>
              <span className='mr-3'>🏪</span>Marketplace
            </div>
            <svg
              className='w-4 h-4 transition-transform duration-200'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </button>
        </div>
        <div>
          <button className='w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'>
            <div className='flex items-center'>
              <span className='mr-3'>💰</span>Finance
            </div>
            <svg
              className='w-4 h-4 transition-transform duration-200'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </button>
        </div>
        <div>
          <button className='w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'>
            <div className='flex items-center'>
              <span className='mr-3'>🤖</span>AI Features
            </div>
            <svg
              className='w-4 h-4 transition-transform duration-200'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </button>
        </div>
        <div>
          <Link
            href='/customers'
            className='flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          >
            <span className='mr-3'>👥</span>Customers
          </Link>
        </div>
        <div>
          <Link
            href='/reports'
            className='flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          >
            <span className='mr-3'>📋</span>Reports
          </Link>
        </div>
        <div>
          <Link
            href='/monitoring-dashboard'
            className='flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          >
            <span className='mr-3'>📊</span>Monitoring
          </Link>
        </div>
        <div>
          <button className='w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'>
            <div className='flex items-center'>
              <span className='mr-3'>👥</span>Management
            </div>
            <svg
              className='w-4 h-4 transition-transform duration-200'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </button>
        </div>
        <div>
          <button className='w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'>
            <div className='flex items-center'>
              <span className='mr-3'>⚡</span>Advanced Features
            </div>
            <svg
              className='w-4 h-4 transition-transform duration-200'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
