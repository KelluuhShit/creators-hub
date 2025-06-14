// src/subscribe/payment/Paystack.js
export const initializePayment = (amount, callback) => {
  if (!window.PaystackPop) {
    console.error('Paystack SDK not loaded');
    alert('Payment service unavailable. Please try again later.');
    return;
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const email = userData.email;

  if (!email || !validateEmail(email)) {
    alert('No valid email found. Please sign in again.');
    window.location.href = '/signin';
    return;
  }

  if (!amount || amount <= 0) {
    alert('Invalid amount');
    return;
  }

  const reference = `CRH_${Math.random().toString(36).substring(7)}`;

  const paystack = window.PaystackPop.setup({
    key: 'pk_test_b0d6ef2b63f05e61e4cec98643aee5972e7f9af5',
    email,
    amount: amount * 100, // Convert to kobo
    currency: 'KES',
    ref: reference,
    metadata: {
      custom_fields: [
        {
          display_name: 'Customer Email',
          variable_name: 'email',
          value: email,
        },
      ],
    },
    callback: (response) => {
      console.log('Paystack callback fired with response:', JSON.stringify(response, null, 2));
      callback({
        status: response.status,
        response,
      });
    },
    onClose: () => {
      console.log('Paystack modal closed');
      callback({
        status: 'cancelled',
        response: null,
      });
    },
  });

  paystack.openIframe();
};