const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Estimate API endpoints
router.get('/estimates', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customerId, dateFrom, dateTo } = req.query;
    
    // Mock estimate data - replace with actual database query
    const estimates = [
      {
        id: 'EST-001',
        customerId: 'CUST-001',
        customerName: 'John Smith',
        amount: 1500.00,
        currency: 'GBP',
        status: 'accepted',
        validUntil: '2025-02-15',
        issueDate: '2025-01-01',
        items: [
          { description: 'Product A', quantity: 3, unitPrice: 400.00, total: 1200.00 },
          { description: 'Installation', quantity: 1, unitPrice: 300.00, total: 300.00 }
        ]
      },
      {
        id: 'EST-002',
        customerId: 'CUST-002',
        customerName: 'Jane Doe',
        amount: 750.00,
        currency: 'GBP',
        status: 'pending',
        validUntil: '2025-02-01',
        issueDate: '2025-01-05',
        items: [
          { description: 'Product B', quantity: 1, unitPrice: 750.00, total: 750.00 }
        ]
      },
      {
        id: 'EST-003',
        customerId: 'CUST-003',
        customerName: 'Bob Wilson',
        amount: 2200.00,
        currency: 'GBP',
        status: 'expired',
        validUntil: '2025-01-10',
        issueDate: '2024-12-15',
        items: [
          { description: 'Product C', quantity: 2, unitPrice: 1100.00, total: 2200.00 }
        ]
      }
    ];

    // Apply filters
    let filteredEstimates = estimates;
    
    if (status) {
      filteredEstimates = filteredEstimates.filter(est => est.status === status);
    }
    
    if (customerId) {
      filteredEstimates = filteredEstimates.filter(est => est.customerId === customerId);
    }
    
    if (dateFrom) {
      filteredEstimates = filteredEstimates.filter(est => est.issueDate >= dateFrom);
    }
    
    if (dateTo) {
      filteredEstimates = filteredEstimates.filter(est => est.issueDate <= dateTo);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedEstimates = filteredEstimates.slice(startIndex, endIndex);

    res.json({
      estimates: paginatedEstimates,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredEstimates.length / limit),
        totalItems: filteredEstimates.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching estimates:', error);
    res.status(500).json({ error: 'Failed to fetch estimates' });
  }
});

router.get('/estimates/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock estimate data - replace with actual database query
    const estimate = {
      id: id,
      customerId: 'CUST-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@example.com',
      customerAddress: {
        street: '123 Main St',
        city: 'London',
        postcode: 'SW1A 1AA',
        country: 'UK'
      },
      amount: 1500.00,
      currency: 'GBP',
      status: 'accepted',
      validUntil: '2025-02-15',
      issueDate: '2025-01-01',
      acceptedDate: '2025-01-10',
      items: [
        { 
          id: 1,
          description: 'Product A', 
          quantity: 3, 
          unitPrice: 400.00, 
          total: 1200.00,
          taxRate: 20,
          taxAmount: 240.00
        },
        { 
          id: 2,
          description: 'Installation', 
          quantity: 1, 
          unitPrice: 300.00, 
          total: 300.00,
          taxRate: 0,
          taxAmount: 0
        }
      ],
      subtotal: 1500.00,
      taxTotal: 240.00,
      total: 1740.00,
      notes: 'This estimate is valid for 30 days from the issue date.',
      terms: 'Payment terms: 50% upfront, 50% upon completion'
    };

    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }

    res.json(estimate);
  } catch (error) {
    console.error('Error fetching estimate:', error);
    res.status(500).json({ error: 'Failed to fetch estimate' });
  }
});

router.post('/estimates', authenticateToken, async (req, res) => {
  try {
    const { customerId, items, validUntil, notes, terms } = req.body;
    
    // Validate required fields
    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer ID and items are required' });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxTotal = items.reduce((sum, item) => {
      const taxRate = item.taxRate || 0;
      return sum + ((item.quantity * item.unitPrice) * (taxRate / 100));
    }, 0);
    const total = subtotal + taxTotal;

    // Generate estimate ID
    const estimateId = `EST-${Date.now()}`;

    // Set default validity period if not provided
    const defaultValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Mock estimate creation - replace with actual database insert
    const newEstimate = {
      id: estimateId,
      customerId,
      amount: total,
      currency: 'GBP',
      status: 'pending',
      validUntil: validUntil || defaultValidUntil,
      issueDate: new Date().toISOString().split('T')[0],
      items,
      subtotal,
      taxTotal,
      total,
      notes: notes || '',
      terms: terms || 'Payment terms: 50% upfront, 50% upon completion'
    };

    res.status(201).json(newEstimate);
  } catch (error) {
    console.error('Error creating estimate:', error);
    res.status(500).json({ error: 'Failed to create estimate' });
  }
});

router.put('/estimates/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, acceptedDate, notes, items } = req.body;
    
    // Mock estimate update - replace with actual database update
    const updatedEstimate = {
      id,
      status: status || 'pending',
      acceptedDate: status === 'accepted' ? new Date().toISOString().split('T')[0] : acceptedDate,
      notes: notes || '',
      items: items || []
    };

    res.json(updatedEstimate);
  } catch (error) {
    console.error('Error updating estimate:', error);
    res.status(500).json({ error: 'Failed to update estimate' });
  }
});

router.delete('/estimates/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock estimate deletion - replace with actual database delete
    // Only allow deletion of pending estimates
    const estimate = { id, status: 'pending' }; // Mock fetch
    
    if (!estimate) {
      return res.status(404).json({ error: 'Estimate not found' });
    }
    
    if (estimate.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending estimates can be deleted' });
    }

    res.json({ message: 'Estimate deleted successfully' });
  } catch (error) {
    console.error('Error deleting estimate:', error);
    res.status(500).json({ error: 'Failed to delete estimate' });
  }
});

router.post('/estimates/:id/accept', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { acceptedBy, acceptedDate } = req.body;
    
    // Mock estimate acceptance - replace with actual database update
    const acceptedEstimate = {
      id,
      status: 'accepted',
      acceptedBy: acceptedBy || 'customer',
      acceptedDate: acceptedDate || new Date().toISOString().split('T')[0]
    };

    res.json(acceptedEstimate);
  } catch (error) {
    console.error('Error accepting estimate:', error);
    res.status(500).json({ error: 'Failed to accept estimate' });
  }
});

router.post('/estimates/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    // Mock estimate rejection - replace with actual database update
    const rejectedEstimate = {
      id,
      status: 'rejected',
      rejectedDate: new Date().toISOString().split('T')[0],
      rejectionReason: reason || 'Customer declined'
    };

    res.json(rejectedEstimate);
  } catch (error) {
    console.error('Error rejecting estimate:', error);
    res.status(500).json({ error: 'Failed to reject estimate' });
  }
});

router.post('/estimates/:id/convert', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceData } = req.body;
    
    // Mock estimate to invoice conversion - replace with actual conversion logic
    const invoice = {
      id: `INV-${Date.now()}`,
      estimateId: id,
      customerId: 'CUST-001',
      amount: 1500.00,
      currency: 'GBP',
      status: 'pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issueDate: new Date().toISOString().split('T')[0],
      items: invoiceData?.items || []
    };

    res.json(invoice);
  } catch (error) {
    console.error('Error converting estimate to invoice:', error);
    res.status(500).json({ error: 'Failed to convert estimate to invoice' });
  }
});

router.post('/estimates/:id/send', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    // Mock email sending - replace with actual email service
    const emailResult = {
      success: true,
      messageId: `email-${Date.now()}`,
      sentTo: email
    };

    res.json(emailResult);
  } catch (error) {
    console.error('Error sending estimate:', error);
    res.status(500).json({ error: 'Failed to send estimate' });
  }
});

router.get('/estimates/:id/pdf', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock PDF generation - replace with actual PDF service
    const pdfBuffer = Buffer.from('Mock PDF content');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="estimate-${id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

module.exports = router; 