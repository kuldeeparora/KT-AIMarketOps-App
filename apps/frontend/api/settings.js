const express = require('express');
const router = express.Router();

// Settings endpoints
router.get('/', async (req, res) => {
  try {
    const settings = {
      general: {
        storeName: 'Kent Traders',
        storeEmail: 'info@kenttraders.co.uk',
        storePhone: '+44 123 456 7890',
        storeAddress: '123 High Street, London, UK',
        timezone: 'Europe/London',
        currency: 'GBP',
        language: 'en'
      },
      shipping: {
        freeShippingThreshold: 50.00,
        defaultShippingRate: 5.99,
        shippingZones: [
          {
            name: 'UK',
            countries: ['GB'],
            rate: 3.99
          },
          {
            name: 'Europe',
            countries: ['DE', 'FR', 'IT', 'ES'],
            rate: 8.99
          }
        ]
      },
      payment: {
        stripeEnabled: true,
        paypalEnabled: true,
        bankTransferEnabled: false,
        cashOnDelivery: true
      },
      notifications: {
        orderConfirmation: true,
        shippingUpdates: true,
        lowStockAlerts: true,
        newCustomerWelcome: true
      },
      integrations: {
        googleAnalytics: 'GA-123456789',
        facebookPixel: '123456789',
        mailchimp: 'list-123456789'
      }
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.put('/', async (req, res) => {
  try {
    const { settings } = req.body;
    
    // Validate settings
    if (!settings) {
      return res.status(400).json({
        success: false,
        error: 'Settings data is required'
      });
    }

    // Mock save operation
    console.log('Saving settings:', settings);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 