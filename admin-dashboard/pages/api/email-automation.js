import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, recipients, data } = req.body;

    // Email configuration (using Gmail SMTP for demo)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
  }
    });

    let emailContent = '';
    let subject = '';

    switch (type) {
      case 'order_confirmation':
        subject = `Order Confirmation #${data.orderNumber}`;
        emailContent = `
          <h2>Order Confirmation</h2>
          <p>Dear ${data.customerName},</p>
          <p>Thank you for your order! Here are your order details:</p>
          <ul>
            <li><strong>Order Number:</strong> #${data.orderNumber}</li>
            <li><strong>Total Amount:</strong> £${data.totalPrice}</li>
            <li><strong>Order Date:</strong> ${new Date(data.createdAt).toLocaleDateString()}</li>
          </ul>
          <p>We'll notify you when your order ships.</p>
          <p>Best regards,<br>Kent Traders Team</p>
        `;
        break;

      case 'low_stock_alert':
        subject = 'Low Stock Alert';
        emailContent = `
          <h2>Low Stock Alert</h2>
          <p>The following products are running low on stock:</p>
          <ul>
            ${data.products
              .map(
                product => `
              <li><strong>${product.name}</strong> - ${product.quantity} units remaining</li>
            `
              )
              .join('')}
          </ul>
          <p>Please reorder these items soon to avoid stockouts.</p>
        `;
        break;

      case 'daily_report':
        subject = 'Daily Business Report';
        emailContent = `
          <h2>Daily Business Report</h2>
          <p>Here's your daily business summary:</p>
          <ul>
            <li><strong>Total Orders:</strong> ${data.totalOrders}</li>
            <li><strong>Total Revenue:</strong> £${data.totalRevenue}</li>
            <li><strong>New Customers:</strong> ${data.newCustomers}</li>
            <li><strong>Low Stock Items:</strong> ${data.lowStockItems}</li>
          </ul>
          <p>View detailed reports in your admin dashboard.</p>
        `;
        break;

      case 'customer_welcome':
        subject = 'Welcome to Kent Traders!';
        emailContent = `
          <h2>Welcome to Kent Traders!</h2>
          <p>Dear ${data.customerName},</p>
          <p>Welcome to Kent Traders! We're excited to have you as a customer.</p>
          <p>As a new customer, you'll receive:</p>
          <ul>
            <li>Exclusive offers and discounts</li>
            <li>Early access to new products</li>
            <li>Personalized recommendations</li>
          </ul>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>Kent Traders Team</p>
        `;
        break;

      default: return res.status(400).json({ error: 'Invalid email type' });
  }

    // Send email to each recipient
    const emailPromises = recipients.map(async recipient => {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@kenttraders.co.uk',
        to: recipient,
        subject: subject,
        html: emailContent};

      try {
        await transporter.sendMail(mailOptions);
        return { recipient, status: 'sent' };
  } catch (error) {
        console.error(`Failed to send email to ${recipient}:`, error);
        return { recipient, status: 'failed', error: error.message };
  }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;

    res.status(200).json({
      success: true,
      message: `Emails sent: ${successful} successful, ${failed} failed`,
      results});
  } catch (error) {
    console.error('Email automation error:', error);
    res.status(500).json({
      success: false,
      error: error.message});
  }
}
