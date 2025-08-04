const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Invoice API endpoints
router.get('/invoices', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customerId, dateFrom, dateTo } = req.query;
    
    // Mock invoice data - replace with actual database query
    const invoices = [
      {
        id: 'INV-001',
        customerId: 'CUST-001',
        customerName: 'John Smith',
        amount: 1250.00,
        currency: 'GBP',
        status: 'paid',
        dueDate: '2025-01-15',
        issueDate: '2025-01-01',
        items: [
          { description: 'Product A', quantity: 2, unitPrice: 500.00, total: 1000.00 },
          { description: 'Shipping', quantity: 1, unitPrice: 250.00, total: 250.00 }
        ]
      },
      {
        id: 'INV-002',
        customerId: 'CUST-002',
        customerName: 'Jane Doe',
        amount: 875.50,
        currency: 'GBP',
        status: 'pending',
        dueDate: '2025-01-20',
        issueDate: '2025-01-05',
        items: [
          { description: 'Product B', quantity: 1, unitPrice: 875.50, total: 875.50 }
        ]
      }
    ];

    // Apply filters
    let filteredInvoices = invoices;
    
    if (status) {
      filteredInvoices = filteredInvoices.filter(inv => inv.status === status);
    }
    
    if (customerId) {
      filteredInvoices = filteredInvoices.filter(inv => inv.customerId === customerId);
    }
    
    if (dateFrom) {
      filteredInvoices = filteredInvoices.filter(inv => inv.issueDate >= dateFrom);
    }
    
    if (dateTo) {
      filteredInvoices = filteredInvoices.filter(inv => inv.issueDate <= dateTo);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

    res.json({
      invoices: paginatedInvoices,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredInvoices.length / limit),
        totalItems: filteredInvoices.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.get('/invoices/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock invoice data - replace with actual database query
    const invoice = {
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
      amount: 1250.00,
      currency: 'GBP',
      status: 'paid',
      dueDate: '2025-01-15',
      issueDate: '2025-01-01',
      paidDate: '2025-01-10',
      items: [
        { 
          id: 1,
          description: 'Product A', 
          quantity: 2, 
          unitPrice: 500.00, 
          total: 1000.00,
          taxRate: 20,
          taxAmount: 200.00
        },
        { 
          id: 2,
          description: 'Shipping', 
          quantity: 1, 
          unitPrice: 250.00, 
          total: 250.00,
          taxRate: 0,
          taxAmount: 0
        }
      ],
      subtotal: 1250.00,
      taxTotal: 200.00,
      total: 1450.00,
      notes: 'Thank you for your business!'
    };

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

router.post('/invoices', authenticateToken, async (req, res) => {
  try {
    const { customerId, items, dueDate, notes } = req.body;
    
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

    // Generate invoice ID
    const invoiceId = `INV-${Date.now()}`;

    // Mock invoice creation - replace with actual database insert
    const newInvoice = {
      id: invoiceId,
      customerId,
      amount: total,
      currency: 'GBP',
      status: 'pending',
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issueDate: new Date().toISOString().split('T')[0],
      items,
      subtotal,
      taxTotal,
      total,
      notes
    };

    res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.put('/invoices/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paidDate, notes } = req.body;
    
    // Mock invoice update - replace with actual database update
    const updatedInvoice = {
      id,
      status: status || 'pending',
      paidDate: status === 'paid' ? new Date().toISOString().split('T')[0] : paidDate,
      notes: notes || ''
    };

    res.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

router.delete('/invoices/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock invoice deletion - replace with actual database delete
    // Only allow deletion of pending invoices
    const invoice = { id, status: 'pending' }; // Mock fetch
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (invoice.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending invoices can be deleted' });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

router.post('/invoices/:id/send', authenticateToken, async (req, res) => {
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
    console.error('Error sending invoice:', error);
    res.status(500).json({ error: 'Failed to send invoice' });
  }
});

router.get('/invoices/:id/pdf', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock PDF generation - replace with actual PDF service
    const pdfBuffer = Buffer.from('Mock PDF content');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

module.exports = router; 