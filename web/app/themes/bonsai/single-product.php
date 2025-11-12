<?php
/**
 * Template name: Page - Full Width
 *
 * @package          Flatsome\Templates
 * @flatsome-version 3.18.0
 */

get_header(); ?>

<?php do_action( 'flatsome_before_page' ); ?>

<div id="content" role="main" class="content-area">

		<?php while ( have_posts() ) : the_post(); ?>
        [section bg="11" padding="0px" height="600px" visibility="hide-for-small"]

        [/section]
        [section padding="0px" class="neg-mgt"]
            [row col_bg="rgb(255,255,255)" col_bg_radius="50" h_align="center" padding="70px 70px 70px 70px" padding__sm="70px 25px 70px 25px"]
                [col span__sm="12" align="center"]
                    <h2 class="big-title">Getting the data right</h2>
                    <p class="sub-heading">Find the footprint for the products</p>
                    [ux_html]
                    [adt_searchform]
                    [/ux_html]
                [/col]
            [/row]
        [/section]
        [section padding="145px" padding__sm="60px"]
            [row style="collapse" v_align="middle"]
                [col span="6" span__sm="12" padding="0px 0px 0px 0px" padding__sm="0px 40px 0px 40px" padding__md="0px 0px 0px 15px"]
                    [ux_image id="23" image_size="original" height="75%" class="border-radius__50"]
                [/col]
                [col span="6" span__sm="12" padding="0px 0px 0px 50px" padding__sm="0px 40px 0px 40px" padding__md="0px 15px 0px 50px" margin="0px 0px 0px 0px" margin__sm="15px 0px 0px 0px" margin__md="0px 0px 0px 0px" align="left"]
                    <h3>Getting the data right</h3>
                    
                    [button text="Read more" letter_case="lowercase" padding="0px 30px 0px 30px" radius="99" class="mobile-right"]
                [/col]
            [/row]
        [/section]
        [section padding="0px"]

            [row style="collapse" v_align="middle"]

            [col span="6" span__sm="12" padding="0px 50px 0px 0px" padding__sm="0px 40px 0px 40px" padding__md="0px 50px 0px 15px" margin="0px 0px 0px 0px" margin__sm="15px 0px 0px 0px" margin__md="0px 0px 0px 0px"]
            <h3>Getting the data right</h3>
            Sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitar sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercita

            [button text="Read more" letter_case="lowercase" padding="0px 30px 0px 30px" radius="99" class="mobile-right"]

            [/col]
            [col span="6" span__sm="12" force_first="small" padding="0px 0px 0px 0px" padding__sm="0px 40px 0px 40px"]

            [ux_image id="24" image_size="original" height="75%" class="border-radius__50"]

            [/col]

            [/row]
            [gap height="160px" height__sm="60px"]

        [/section]

			<?php the_content(); ?>

			<?php
			if ( comments_open() || get_comments_number() ) {
				comments_template();
			}
			?>

		<?php endwhile; // end of the loop. ?>

</div>

<?php do_action( 'flatsome_after_page' ); ?>

<?php get_footer(); ?>
