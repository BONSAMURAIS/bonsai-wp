<?php

add_shortcode('download_form', 'custom_download_form_shortcode');

function custom_download_form_shortcode() {
    ob_start();
    ?>
    <div style="max-width:400px; margin-bottom:20px; font-family: Arial, sans-serif;">
      <form id="contact_info_form" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="POST">
        <input type="hidden" name="action" value="" />

        <div style="margin-bottom:15px;">
          <label for="lastname" style="display:block; margin-bottom:5px; font-weight:bold; color:#333;">Lastname:</label>
          <input id="lastname" name="lastname" type="text" required style="width:100%; padding:10px 12px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;" />
        </div>

        <div style="margin-bottom:15px;">
          <label for="firstname" style="display:block; margin-bottom:5px; font-weight:bold; color:#333;">First name:</label>
          <input id="firstname" name="firstname" type="text" required style="width:100%; padding:10px 12px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;" />
        </div>

        <div style="margin-bottom:15px;">
            <label for="email" style="display:block; margin-bottom:5px; font-weight:bold; color:#333;">Email:</label>
            <input id="email" name="email" type="email" required style="width:100%; padding:10px 12px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;" />
        </div>
        
        
        <div style="margin-bottom:15px;">
            <p>
                <b>Footprint table</b><br/><i>Find the footprint for more than 1,000 products in over 40 countries based on CPA classification.</i>
            </p>
            <button type="button" class="download-btn" data-action="download_footprint_csv" style="border-radius:99px; padding:10px 20px; margin-right:10px;">Download F CSV</button>
        </div>
        
        <div style="margin-bottom:15px;">
            <p>
                <b>Contribution table</b><br/><i>Find the tier 1 contributions of all the product footprints</i>.
            </p>
            <button type="button" class="download-btn" data-action="download_contribution_csv" style="border-radius:99px; padding:10px 20px;">Download C CSV</button>
        </div>
      </form>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
      document.querySelectorAll('.download-btn').forEach(function(button) {
        button.addEventListener('click', function() {
          var form = document.getElementById('contact_info_form');
          if (form.checkValidity()) {
            form.querySelector('input[name="action"]').value = this.getAttribute('data-action');
            form.submit();
          } else {
            form.reportValidity();
          }
        });
      });
    });
    </script>
    <?php
    return ob_get_clean();
}

?>