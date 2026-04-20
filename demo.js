function fetchEarningsStats() {
    const startDate = $('#start_date').val();
    const endDate = $('#end_date').val();

    $.ajax({
      url: basePath + '/digital-services/earning-analytics',
      type: 'GET',
      data: {
        start_date: $('#start_date').val(),
        end_date: $('#end_date').val()
      },
      success: function (response) {
        if (response.success && response.data) {
          // Update specific card values based on response data
          $('[data-card-type="mobile_topup"] .stat-card-value').text('SAR ' + response.data.total_topup_earnings);
          $('[data-card-type="esim"] .stat-card-value').text('SAR ' + response.data.total_esim_earnings);
          $('[data-card-type="gift_card"] .stat-card-value').text('SAR ' + response.data.total_giftcard_earnings);
          $('[data-card-type="evoucher"] .stat-card-value').text('SAR ' + response.data.total_evoucher_earnings);
        }
      },
      error: function (err) {
        console.error('Error fetching stats', err);
      }
    });
  }