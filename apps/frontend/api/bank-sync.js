const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Bank Sync API endpoints
router.get('/bank-accounts', authenticateToken, async (req, res) => {
  try {
    const { includeTransactions = false } = req.query;
    
    // Mock bank accounts data - replace with actual database query
    const bankAccounts = [
      {
        id: 'BANK-001',
        accountName: 'Main Business Account',
        accountNumber: '****1234',
        sortCode: '12-34-56',
        bankName: 'Barclays Bank',
        balance: 25450.75,
        currency: 'GBP',
        status: 'active',
        lastSync: '2025-01-15T10:30:00Z',
        transactions: includeTransactions ? [
          {
            id: 'TXN-001',
            date: '2025-01-15',
            description: 'Payment from Customer A',
            amount: 1250.00,
            type: 'credit',
            reference: 'INV-001'
          },
          {
            id: 'TXN-002',
            date: '2025-01-14',
            description: 'Office Supplies',
            amount: -85.50,
            type: 'debit',
            reference: 'EXP-001'
          }
        ] : []
      },
      {
        id: 'BANK-002',
        accountName: 'Savings Account',
        accountNumber: '****5678',
        sortCode: '12-34-56',
        bankName: 'Barclays Bank',
        balance: 15000.00,
        currency: 'GBP',
        status: 'active',
        lastSync: '2025-01-14T15:45:00Z',
        transactions: includeTransactions ? [
          {
            id: 'TXN-003',
            date: '2025-01-14',
            description: 'Interest Payment',
            amount: 45.25,
            type: 'credit',
            reference: 'INT-001'
          }
        ] : []
      }
    ];

    res.json({ bankAccounts });
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    res.status(500).json({ error: 'Failed to fetch bank accounts' });
  }
});

router.get('/bank-accounts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { dateFrom, dateTo, type } = req.query;
    
    // Mock bank account details - replace with actual database query
    const bankAccount = {
      id: id,
      accountName: 'Main Business Account',
      accountNumber: '****1234',
      sortCode: '12-34-56',
      bankName: 'Barclays Bank',
      balance: 25450.75,
      currency: 'GBP',
      status: 'active',
      lastSync: '2025-01-15T10:30:00Z',
      iban: 'GB29NWBK60161331926819',
      swift: 'BARCGB22',
      transactions: [
        {
          id: 'TXN-001',
          date: '2025-01-15',
          description: 'Payment from Customer A',
          amount: 1250.00,
          type: 'credit',
          reference: 'INV-001',
          category: 'income',
          reconciled: true
        },
        {
          id: 'TXN-002',
          date: '2025-01-14',
          description: 'Office Supplies',
          amount: -85.50,
          type: 'debit',
          reference: 'EXP-001',
          category: 'expenses',
          reconciled: false
        },
        {
          id: 'TXN-003',
          date: '2025-01-13',
          description: 'Bank Transfer to Supplier',
          amount: -500.00,
          type: 'debit',
          reference: 'TRF-001',
          category: 'expenses',
          reconciled: true
        }
      ]
    };

    // Apply filters
    let filteredTransactions = bankAccount.transactions;
    
    if (dateFrom) {
      filteredTransactions = filteredTransactions.filter(txn => txn.date >= dateFrom);
    }
    
    if (dateTo) {
      filteredTransactions = filteredTransactions.filter(txn => txn.date <= dateTo);
    }
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(txn => txn.type === type);
    }

    bankAccount.transactions = filteredTransactions;

    if (!bankAccount) {
      return res.status(404).json({ error: 'Bank account not found' });
    }

    res.json(bankAccount);
  } catch (error) {
    console.error('Error fetching bank account:', error);
    res.status(500).json({ error: 'Failed to fetch bank account' });
  }
});

router.post('/bank-accounts', authenticateToken, async (req, res) => {
  try {
    const { accountName, accountNumber, sortCode, bankName, iban, swift } = req.body;
    
    // Validate required fields
    if (!accountName || !accountNumber || !sortCode || !bankName) {
      return res.status(400).json({ error: 'Account name, number, sort code, and bank name are required' });
    }

    // Generate bank account ID
    const accountId = `BANK-${Date.now()}`;

    // Mock bank account creation - replace with actual database insert
    const newBankAccount = {
      id: accountId,
      accountName,
      accountNumber: `****${accountNumber.slice(-4)}`,
      sortCode,
      bankName,
      iban: iban || '',
      swift: swift || '',
      balance: 0.00,
      currency: 'GBP',
      status: 'active',
      lastSync: null,
      transactions: []
    };

    res.status(201).json(newBankAccount);
  } catch (error) {
    console.error('Error creating bank account:', error);
    res.status(500).json({ error: 'Failed to create bank account' });
  }
});

router.put('/bank-accounts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { accountName, status, iban, swift } = req.body;
    
    // Mock bank account update - replace with actual database update
    const updatedBankAccount = {
      id,
      accountName: accountName || 'Main Business Account',
      status: status || 'active',
      iban: iban || '',
      swift: swift || '',
      lastUpdated: new Date().toISOString()
    };

    res.json(updatedBankAccount);
  } catch (error) {
    console.error('Error updating bank account:', error);
    res.status(500).json({ error: 'Failed to update bank account' });
  }
});

router.post('/bank-accounts/:id/sync', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { forceSync = false } = req.body;
    
    // Mock bank synchronization - replace with actual bank API integration
    const syncResult = {
      accountId: id,
      syncDate: new Date().toISOString(),
      status: 'completed',
      transactionsSynced: 15,
      balanceUpdated: true,
      newBalance: 25450.75,
      errors: []
    };

    res.json(syncResult);
  } catch (error) {
    console.error('Error syncing bank account:', error);
    res.status(500).json({ error: 'Failed to sync bank account' });
  }
});

router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, accountId, dateFrom, dateTo, type, category, reconciled } = req.query;
    
    // Mock transactions data - replace with actual database query
    const transactions = [
      {
        id: 'TXN-001',
        accountId: 'BANK-001',
        date: '2025-01-15',
        description: 'Payment from Customer A',
        amount: 1250.00,
        type: 'credit',
        reference: 'INV-001',
        category: 'income',
        reconciled: true
      },
      {
        id: 'TXN-002',
        accountId: 'BANK-001',
        date: '2025-01-14',
        description: 'Office Supplies',
        amount: -85.50,
        type: 'debit',
        reference: 'EXP-001',
        category: 'expenses',
        reconciled: false
      },
      {
        id: 'TXN-003',
        accountId: 'BANK-001',
        date: '2025-01-13',
        description: 'Bank Transfer to Supplier',
        amount: -500.00,
        type: 'debit',
        reference: 'TRF-001',
        category: 'expenses',
        reconciled: true
      }
    ];

    // Apply filters
    let filteredTransactions = transactions;
    
    if (accountId) {
      filteredTransactions = filteredTransactions.filter(txn => txn.accountId === accountId);
    }
    
    if (dateFrom) {
      filteredTransactions = filteredTransactions.filter(txn => txn.date >= dateFrom);
    }
    
    if (dateTo) {
      filteredTransactions = filteredTransactions.filter(txn => txn.date <= dateTo);
    }
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(txn => txn.type === type);
    }
    
    if (category) {
      filteredTransactions = filteredTransactions.filter(txn => txn.category === category);
    }
    
    if (reconciled !== undefined) {
      const isReconciled = reconciled === 'true';
      filteredTransactions = filteredTransactions.filter(txn => txn.reconciled === isReconciled);
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    res.json({
      transactions: paginatedTransactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredTransactions.length / limit),
        totalItems: filteredTransactions.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.put('/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, reconciled, notes } = req.body;
    
    // Mock transaction update - replace with actual database update
    const updatedTransaction = {
      id,
      category: category || 'uncategorized',
      reconciled: reconciled !== undefined ? reconciled : false,
      notes: notes || '',
      lastUpdated: new Date().toISOString()
    };

    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

router.post('/transactions/reconcile', authenticateToken, async (req, res) => {
  try {
    const { transactionIds, reconciled } = req.body;
    
    if (!transactionIds || !Array.isArray(transactionIds)) {
      return res.status(400).json({ error: 'Transaction IDs array is required' });
    }

    // Mock bulk reconciliation - replace with actual database update
    const reconcileResult = {
      updatedCount: transactionIds.length,
      reconciled: reconciled !== undefined ? reconciled : true,
      timestamp: new Date().toISOString()
    };

    res.json(reconcileResult);
  } catch (error) {
    console.error('Error reconciling transactions:', error);
    res.status(500).json({ error: 'Failed to reconcile transactions' });
  }
});

router.get('/bank-sync/status', authenticateToken, async (req, res) => {
  try {
    // Mock sync status - replace with actual sync status check
    const syncStatus = {
      lastSync: '2025-01-15T10:30:00Z',
      nextSync: '2025-01-16T10:30:00Z',
      status: 'active',
      accountsCount: 2,
      totalTransactions: 45,
      pendingReconciliation: 8,
      errors: []
    };

    res.json(syncStatus);
  } catch (error) {
    console.error('Error fetching sync status:', error);
    res.status(500).json({ error: 'Failed to fetch sync status' });
  }
});

router.post('/bank-sync/configure', authenticateToken, async (req, res) => {
  try {
    const { syncFrequency, autoReconciliation, notificationSettings } = req.body;
    
    // Mock sync configuration - replace with actual configuration update
    const syncConfig = {
      syncFrequency: syncFrequency || 'daily',
      autoReconciliation: autoReconciliation !== undefined ? autoReconciliation : true,
      notificationSettings: notificationSettings || {
        syncErrors: true,
        reconciliationAlerts: true,
        balanceUpdates: false
      },
      lastUpdated: new Date().toISOString()
    };

    res.json(syncConfig);
  } catch (error) {
    console.error('Error configuring bank sync:', error);
    res.status(500).json({ error: 'Failed to configure bank sync' });
  }
});

module.exports = router; 