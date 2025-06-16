<?php

defined('ABSPATH') || exit;

$data = adt_get_shared_search(get_the_ID());

wp_enqueue_style('adt-searchform-style', content_url('/themes/bonsai/dist/css/adt-searchform.css'));
wp_enqueue_script('adt-searchform-script', content_url('/themes/bonsai/dist/js/adt-searchform.js'), ['jquery']);
wp_localize_script('adt-searchform-script', 'localize', [
    '_ajax_url'   => admin_url('admin-ajax.php'),
    '_ajax_nonce' => wp_create_nonce('_ajax_nonce'),
]);

$productsArray = adt_get_all_products_by_footprint();
$locationsArray = adt_get_locations();
$popularSearches = adt_get_popular_searches();

wp_localize_script('adt-searchform-script', 'searchform', [
    'products' => $productsArray,
]);

// echo '<pre>';
// var_dump(get_the_ID());
// var_dump($data);
// echo '</pre>';

get_header();

// the_content();
ob_start();
?>
<div id="content" role="main" class="content-area">
	<section class="section hide-for-small" id="section_150543126">
		<div class="section-bg fill">
			<img fetchpriority="high" decoding="async" width="1438" height="639" src="https://aau.test/app/uploads/2025/01/background.webp" class="bg attachment- size-" alt="">						
		</div>
		<div class="section-content relative">
		</div>
		<style>
			#section_150543126 {
			padding-top: 0px;
			padding-bottom: 0px;
			min-height: 600px;
			}
		</style>
	</section>
	<section class="section neg-mgt" id="section_1111236685">
		<div class="section-bg fill">
		</div>
		<div class="section-content relative">
			<div class="row align-center" id="row-1608667878">
				<div id="col-1838913432" class="col small-12 large-12">
					<div class="col-inner text-center">
						<h2 class="big-title">TEST - Getting the data right</h2>
						<p class="sub-heading">Find the footprint for the products</p>
						<div class="co2-form-wrapper">
							<form class="co2-form">
								<div class="row align-bottom">
									<div class="col medium-6 small-12 large-6 pb-0 text-left">
										<div class="tooltip tooltipstered">
											<a href="#info-footprint">
											Footprint
											</a>
											<div id="info-footprint" class="lightbox-by-id lightbox-content mfp-hide lightbox-white " style="max-width:600px ;padding:20px">
												<p class="has-block"><u><strong>Footprint type:</strong></u>&nbsp;refers to the type of calculation. All results are presented as climate footprints and they are based on standard LCA calculations. Results are calculated to represent a change in demand for the product under study, i.e. a so-called consequential footprint. By-products are modelled using substitution, and market supply mixes are marginal, i.e. constrained suppliers are not part of the supply mix.</p>
												<p><span style="text-decoration: underline;"><strong>Cradle to gate (production)</strong></span>&nbsp;refers to the footprint of the production of a product in a country. The inputs to a production process are raw materials, energy etc.</p>
												<p><span style="text-decoration: underline;"><strong>Cradle to consumer (market)</strong></span>&nbsp;refers to the footprint of the purchase of a product at a market in a country. The inputs to a product market is products from different producers. E.g. the market for televisions in Denmark has inputs of televisions from different countries.</p>
											</div>
										</div>
										<div class="switch-field-wrapper">
											<div class="switch-field-container">
												<input type="radio" id="radio-one" name="switch-one" value="product" checked="">
												<label for="radio-one">Product</label>
												<input type="radio" id="radio-two" name="switch-one" value="person">
												<label for="radio-two">Person</label>
											</div>
										</div>
									</div>
									<div class="col medium-6 small-12 large-6 pb-0 text-right">
										<div class="tooltip tooltipstered">
											<a href="#info-footprint-type">
											Footprint type
											</a>
											<div id="info-footprint-type" class="lightbox-by-id lightbox-content mfp-hide lightbox-white " style="max-width:600px ;padding:20px">
												<p class="has-block"><u><strong>Footprint type:</strong></u>&nbsp;refers to the type of calculation. All results are presented as climate footprints and they are based on standard LCA calculations. Results are calculated to represent a change in demand for the product under study, i.e. a so-called consequential footprint. By-products are modelled using substitution, and market supply mixes are marginal, i.e. constrained suppliers are not part of the supply mix.</p>
												<p><span style="text-decoration: underline;"><strong>Cradle to gate (production)</strong></span>&nbsp;refers to the footprint of the production of a product in a country. The inputs to a production process are raw materials, energy etc.</p>
												<p><span style="text-decoration: underline;"><strong>Cradle to consumer (market)</strong></span>&nbsp;refers to the footprint of the purchase of a product at a market in a country. The inputs to a product market is products from different producers. E.g. the market for televisions in Denmark has inputs of televisions from different countries.</p>
											</div>
										</div>
										<div id="footprint-type" class="select">
											<div class="radio-choice">
												<input type="radio" id="production" name="footprint_type" value="product" checked="">
												<label for="production">Cradle to gate</label>
											</div>
											<div class="radio-choice">
												<input type="radio" id="market" name="footprint_type" value="market">
												<label for="market">Cradle to consumer</label>
											</div>
											<!-- <select id="footprint-type">
												<option value="product">Cradle to gate (i.e. production)</option>
												<option value="market">Cradle to consumer (i.e., markets)</option>
												</select>
												<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
												</svg> -->
										</div>
									</div>
								</div>
								<div class="search-input-wrapper">
									<input class="search" type="text" id="autocomplete-input" placeholder="Find footprint by product" style="border-radius: 50px; border-bottom: 1px solid rgb(221, 221, 221);" data-code="M_Cauli" data-uuid="79175dd4-25b2-462e-977d-e85dcf4aaf9c">
									<div id="initial-error-message" style="display: none;"></div>
									<div id="suggestions-wrapper" style="display: none;">
										<div class="search-history">
											<!-- Users current search history -->
											<p><strong>Search history</strong></p>
											<ul>
												<li class="button primary is-outline lowercase" style="border-radius:99px;">Chicken <span class="remove"></span></li>
												<li class="button primary is-outline lowercase" style="border-radius:99px;">Almonds <span class="remove"></span></li>
												<li class="button primary is-outline lowercase" style="border-radius:99px;">Aluminium <span class="remove"></span></li>
												<li class="button primary is-outline lowercase" style="border-radius:99px;">Beef <span class="remove"></span></li>
											</ul>
										</div>
										<div id="suggestions">
											<div class="suggestion-item highlight" data-code="M_Cauli" data-uuid="79175dd4-25b2-462e-977d-e85dcf4aaf9c">cauliflowers and broccoli</div>
										</div>
									</div>
									<datalist id="words">
										<option value="treatment of mix metals non-ferrous">
										</option>
										<option value="treatment of paper">
										</option>
										<option value="treatment of plastic">
										</option>
										<option value="treatment of precious metals">
										</option>
										<option value="treatment of sewage">
										</option>
										<option value="treatment of steel">
										</option>
										<option value="treatment of textiles">
										</option>
										<option value="Unregistered waste, (market for)">
										</option>
										<option value="treatment of unsorted waste">
										</option>
										<option value="Treatment of waste nec, (market for)">
										</option>
										<option value="treatment of wood">
										</option>
										<option value="incineration of sewage">
										</option>
										<option value="landfill of sewage">
										</option>
										<option value="other disposal of sewage">
										</option>
										<option value="recycling of sewage">
										</option>
										<option value="biogasification and land application">
										</option>
										<option value="provision of waste water services for sewage">
										</option>
										<option value="basic iron and steel and of ferro-alloys and first products thereof">
										</option>
										<option value="recycling of steel">
										</option>
										<option value="stone">
										</option>
										<option value="incineration with energy recovery of steel">
										</option>
										<option value="incineration without energy recovery of steel">
										</option>
										<option value="landfill of steel">
										</option>
										<option value="other disposal of steel">
										</option>
										<option value="sub-bituminous coal">
										</option>
										<option value="safflower seed">
										</option>
										<option value="sesame seed">
										</option>
										<option value="meat from sheep (live)">
										</option>
										<option value="milk raw from sheep">
										</option>
										<option value="cocoons, reelable">
										</option>
										<option value="silk, raw">
										</option>
										<option value="sisal">
										</option>
										<option value="goatskins, fresh">
										</option>
										<option value="sheepskins, fresh">
										</option>
										<option value="snails and sea snails">
										</option>
										<option value="sorghum">
										</option>
										<option value="soya sauce">
										</option>
										<option value="soya curd">
										</option>
										<option value="soya paste">
										</option>
										<option value="soybeans">
										</option>
										<option value="spices nes">
										</option>
										<option value="spinach">
										</option>
										<option value="starch of cassava">
										</option>
										<option value="starch of maize">
										</option>
										<option value="starch of potatoes">
										</option>
										<option value="starch of rice">
										</option>
										<option value="starch of wheat">
										</option>
										<option value="strawberries">
										</option>
										<option value="string beans">
										</option>
										<option value="sugar crops nes">
										</option>
										<option value="sugar cane">
										</option>
										<option value="sugar, non-centrifugal">
										</option>
										<option value="sugar, raw centrifugal">
										</option>
										<option value="sugar and syrups nes">
										</option>
										<option value="sugar beet">
										</option>
										<option value="sunflower seed">
										</option>
										<option value="sweet corn, prepared or preserved">
										</option>
										<option value="sweet corn, frozen">
										</option>
										<option value="sweet potatoes">
										</option>
										<option value="air transport services">
										</option>
										<option value="supporting and auxiliary transport services; travel agency services">
										</option>
										<option value="retail trade services of motor fuel">
										</option>
										<option value="sale, maintenance and repair of motor vehicles">
										</option>
										<option value="retail trade services, except of motor vehicles and motorcycles; repair services of personal and household goods">
										</option>
										<option value="wholesale trade and commission trade services, except of motor vehicles and motorcycles">
										</option>
										<option value="textiles">
										</option>
										<option value="incineration with energy recovery of textiles">
										</option>
										<option value="incineration without energy recovery of textiles">
										</option>
										<option value="landfill of textiles">
										</option>
										<option value="recycling of textiles">
										</option>
										<option value="other land transportation services">
										</option>
										<option value="tobacco products">
										</option>
										<option value="transportation services via pipelines">
										</option>
										<option value="railway transportation services">
										</option>
										<option value="inland water transportation services">
										</option>
										<option value="sea and coastal water transportation services">
										</option>
										<option value="tallowtree seeds">
										</option>
										<option value="tallow">
										</option>
										<option value="tapioca of cassava">
										</option>
										<option value="tapioca of potatoes">
										</option>
										<option value="taro (cocoyam)">
										</option>
										<option value="tea">
										</option>
										<option value="tangerines, mandarins, clementines, satsumas">
										</option>
										<option value="tobacco leaves">
										</option>
										<option value="tomatoes, peeled (o/t vinegar)">
										</option>
										<option value="paste of tomatoes">
										</option>
										<option value="tomatoes, fresh">
										</option>
										<option value="triticale">
										</option>
										<option value="tung nuts">
										</option>
										<option value="incineration with energy recovery of unsorted waste">
										</option>
										<option value="incineration without energy recovery of unsorted waste">
										</option>
										<option value="landfill of unsorted waste">
										</option>
										<option value="other disposal of unsorted waste">
										</option>
										<option value="recycling of unsorted waste">
										</option>
										<option value="vanilla">
										</option>
										<option value="homogenized vegetable preparations">
										</option>
										<option value="">
										</option>
										<option value="broad beans, green">
										</option>
										<option value="vetches">
										</option>
										<option value="collected and purified water, distribution services of water">
										</option>
										<option value="white spirit &amp; sbp">
										</option>
										<option value="wood and products of wood and cork (except furniture); articles of straw and planting materials">
										</option>
										<option value="">
										</option>
										<option value="recycling of wood">
										</option>
										<option value="other disposal of wood">
										</option>
										<option value="wafers">
										</option>
										<option value="walnuts, without shell">
										</option>
										<option value="walnuts, in shell">
										</option>
										<option value="watermelons">
										</option>
										<option value="wheat">
										</option>
										<option value="whey, condensed">
										</option>
										<option value="dry whey">
										</option>
										<option value="whey cheese">
										</option>
										<option value="whey, fresh">
										</option>
										<option value="wine">
										</option>
										<option value="yams">
										</option>
										<option value="yoghurt">
										</option>
										<option value="cars">
										</option>
										<option value="">
										</option>
										<option value="">
										</option>
										<option value="oil of castor beans">
										</option>
										<option value="Electricity (market for)">
										</option>
										<option value="animal feed energy">
										</option>
										<option value="animal feed protein">
										</option>
										<option value="fruit, tropical (fresh) nes">
										</option>
										<option value="Heat for fishing, (market for)">
										</option>
										<option value="fuel mix and combustion for households">
										</option>
										<option value="fuel mix and combustion for commercial and public services">
										</option>
										<option value="fibre crops nes">
										</option>
										<option value="citrus fruit nes">
										</option>
										<option value="fruit, fresh nes">
										</option>
										<option value="pome fruit nes">
										</option>
										<option value="stone fruit, fresh nes">
										</option>
										<option value="vegetables, fresh n.e.s.">
										</option>
										<option value="oil palm fruit">
										</option>
										<option value="trucks">
										</option>
										<option value="oil of vegetable origin nes">
										</option>
										<option value="treatment of aluminium">
										</option>
										<option value="treatment of ash">
										</option>
										<option value="Treatment of ashes, (market for)">
										</option>
										<option value="treatment of batteries and accumulators">
										</option>
										<option value="treatment of construction">
										</option>
										<option value="treatment of copper">
										</option>
										<option value="treatment of discarded equipment">
										</option>
										<option value="treatment of discarded vehicles">
										</option>
										<option value="treatment of food">
										</option>
										<option value="treatment of glass">
										</option>
										<option value="treatment of hazardous">
										</option>
										<option value="treatment of lead">
										</option>
										<option value="treatment of manure">
										</option>
										<option value="treatment of mix metals">
										</option>
										<option value="uranium and thorium ores">
										</option>
										<option value="membership organisation services n.e.c.">
										</option>
										<option value="other services (e.g. spiritualists, dating services, shoe shiners, porters)">
										</option>
										<option value="other bituminous coal">
										</option>
										<option value="other transport equipment">
										</option>
										<option value="oats, rolled">
										</option>
										<option value="oats">
										</option>
										<option value="offals and liver of chickens">
										</option>
										<option value="offals and liver of ducks">
										</option>
										<option value="offals and liver of geese">
										</option>
										<option value="offals and liver of turkey">
										</option>
										<option value="offals of cattle, edible">
										</option>
										<option value="offals of pigs, edible">
										</option>
										<option value="offals of sheep, edible">
										</option>
										<option value="offals of buffalo, edible">
										</option>
										<option value="offals of camels, edibles">
										</option>
										<option value="offals of goats, edible">
										</option>
										<option value="offals of horses">
										</option>
										<option value="oil of coconuts">
										</option>
										<option value="oil of cottonseed">
										</option>
										<option value="oil of groundnuts">
										</option>
										<option value="oil of hempseed">
										</option>
										<option value="hydrogenated oils and fats">
										</option>
										<option value="oil of kapok">
										</option>
										<option value="oil of linseed">
										</option>
										<option value="oil of maize">
										</option>
										<option value="oil of mustard seed">
										</option>
										<option value="oil of olives, virgin">
										</option>
										<option value="oil of olive residues">
										</option>
										<option value="oil of palm kernel">
										</option>
										<option value="oil of palm">
										</option>
										<option value="oil of poppy seed">
										</option>
										<option value="oil of rapeseed or canola oil">
										</option>
										<option value="oil of rice bran">
										</option>
										<option value="oil of safflower seed">
										</option>
										<option value="oil of sesame seed">
										</option>
										<option value="oil of soybeans">
										</option>
										<option value="oil of sunflower seed">
										</option>
										<option value="animal oils and fats nes">
										</option>
										<option value="oilseeds nes">
										</option>
										<option value="okra">
										</option>
										<option value="olives">
										</option>
										<option value="onions, shallots (green)">
										</option>
										<option value="onions, dry">
										</option>
										<option value="oranges">
										</option>
										<option value="other animal products">
										</option>
										<option value="public administration and defence services; compulsory social security services">
										</option>
										<option value="paper and paper products">
										</option>
										<option value="recycling of paper">
										</option>
										<option value="paraffin waxes">
										</option>
										<option value="patent fuel">
										</option>
										<option value="other disposal of paper">
										</option>
										<option value="peat">
										</option>
										<option value="petroleum coke">
										</option>
										<option value="PK_fertilizers, (market for)">
										</option>
										<option value="plastics, basic">
										</option>
										<option value="recycling of plastic and rubber">
										</option>
										<option value="other disposal of plastic and rubber">
										</option>
										<option value="distribution and trade services of electricity (excl the electricity)">
										</option>
										<option value="">
										</option>
										<option value="electricity by nuclear, global mix">
										</option>
										<option value="electricity by tide, wave, ocean, global mix">
										</option>
										<option value="transmission services of electricity (excl the electricity)">
										</option>
										<option value="precious metals">
										</option>
										<option value="precious metal ores and concentrates">
										</option>
										<option value="recycling of precious metals">
										</option>
										<option value="private households with employed persons (maids, cooks, waiters, gardeners, gatekeepers, chauffeurs etc)">
										</option>
										<option value="post and telecommunication services">
										</option>
										<option value="pulp">
										</option>
										<option value="papayas">
										</option>
										<option value="pastry">
										</option>
										<option value="peaches and nectarines">
										</option>
										<option value="peanut butter">
										</option>
										<option value="pears">
										</option>
										<option value="peas, green">
										</option>
										<option value="peas, dry">
										</option>
										<option value="pepper">
										</option>
										<option value="peppermint, spearmint">
										</option>
										<option value="persimmons">
										</option>
										<option value="phosphatic fertilizer">
										</option>
										<option value="">
										</option>
										<option value="">
										</option>
										<option value="">
										</option>
										<option value="">
										</option>
										<option value="">
										</option>
										<option value="">
										</option>
										<option value="pigeon peas">
										</option>
										<option value="meat from pig (live)">
										</option>
										<option value="pineapples, canned">
										</option>
										<option value="pineapples">
										</option>
										<option value="pistachios">
										</option>
										<option value="plantains">
										</option>
										<option value="plums, dried">
										</option>
										<option value="plums">
										</option>
										<option value="poultry meat">
										</option>
										<option value="poppy seed">
										</option>
										<option value="">
										</option>
										<option value="pork meat processed, sausage">
										</option>
										<option value="pork meat processed, bacon and ham">
										</option>
										<option value="">
										</option>
										<option value="pork meat processed, meat preparations">
										</option>
										<option value="">
										</option>
										<option value="">
										</option>
										<option value="frozen potatoes">
										</option>
										<option value="potatoes">
										</option>
										<option value="pulses nes">
										</option>
										<option value="pumpkins, squash and gourds">
										</option>
										<option value="pyrethrum, dried flowers">
										</option>
										<option value="quinoa">
										</option>
										<option value="quinces">
										</option>
										<option value="radio, television and communication equipment and apparatus">
										</option>
										<option value="real estate services">
										</option>
										<option value="recreational, cultural and sporting services">
										</option>
										<option value="refinery feedstocks">
										</option>
										<option value="research and development services">
										</option>
										<option value="refinery gas">
										</option>
										<option value="rubber and plastic products">
										</option>
										<option value="services relating to the collection and sorting of scrap/secondary materials (excl the material)">
										</option>
										<option value="raisins">
										</option>
										<option value="ramie">
										</option>
										<option value="rapeseed or colza seed">
										</option>
										<option value="raspberries">
										</option>
										<option value="rice, broken">
										</option>
										<option value="rice, husked">
										</option>
										<option value="rice, milled (husked)">
										</option>
										<option value="rice, milled">
										</option>
										<option value="rice, paddy">
										</option>
										<option value="roots and tubers nes">
										</option>
										<option value="natural rubber">
										</option>
										<option value="rye">
										</option>
										<option value="sand and clay">
										</option>
										<option value="incineration with energy recovery of sewage">
										</option>
										<option value="juice of grapefruit">
										</option>
										<option value="juice of lemon">
										</option>
										<option value="lemon juice, concentrated">
										</option>
										<option value="juice of mango">
										</option>
										<option value="juice of orange">
										</option>
										<option value="orange juice, concentrated">
										</option>
										<option value="juice of pineapples">
										</option>
										<option value="juice of pineapples, concentrated">
										</option>
										<option value="juice of tangerine, mandarin and clementin">
										</option>
										<option value="juice of tomatoes">
										</option>
										<option value="juice of vegetables nes">
										</option>
										<option value="jute">
										</option>
										<option value="kerosene">
										</option>
										<option value="kerosene type jet fuel">
										</option>
										<option value="kapokseed, without shell">
										</option>
										<option value="kapokseed, in shell">
										</option>
										<option value="kapok fruit">
										</option>
										<option value="karite nuts (sheanuts)">
										</option>
										<option value="K fertilizer">
										</option>
										<option value="kiwi fruit">
										</option>
										<option value="kolanuts">
										</option>
										<option value="landfill of food">
										</option>
										<option value="landfill of plastic and rubber">
										</option>
										<option value="landfill of paper">
										</option>
										<option value="landfill of wood">
										</option>
										<option value="leather and leather products">
										</option>
										<option value="lignite/brown coal">
										</option>
										<option value="liquefied petroleum gases (lpg)">
										</option>
										<option value="lubricants">
										</option>
										<option value="lead, zinc and tin ores and concentrates">
										</option>
										<option value="lead, zinc and tin and products thereof">
										</option>
										<option value="recycling of lead, zinc and tin">
										</option>
										<option value="incineration with energy recovery of lead, zinc and tin">
										</option>
										<option value="landfill of lead, zinc and tin">
										</option>
										<option value="lactose">
										</option>
										<option value="lard">
										</option>
										<option value="lard stearine and lard oil">
										</option>
										<option value="leeks and other alliaceous vegetables">
										</option>
										<option value="lemons and limes">
										</option>
										<option value="lentils, dry">
										</option>
										<option value="lettuce and chicory">
										</option>
										<option value="linseed">
										</option>
										<option value="">
										</option>
										<option value="lupins">
										</option>
										<option value="machinery and equipment n.e.c.">
										</option>
										<option value="renting services of machinery and equipment without operator and of personal and household goods">
										</option>
										<option value="incineration with energy recovery of manure">
										</option>
										<option value="incineration without energy recovery of manure">
										</option>
										<option value="landfill of manure">
										</option>
										<option value="other disposal of manure">
										</option>
										<option value="recycling of manure">
										</option>
										<option value="blast furnace gas">
										</option>
										<option value="biogas">
										</option>
										<option value="printed matter and recorded media">
										</option>
										<option value="medical, precision and optical instruments, watches and clocks">
										</option>
										<option value="foundry work services">
										</option>
										<option value="motor gasoline">
										</option>
										<option value="gas works gas (incl the gas)">
										</option>
										<option value="incineration with energy recovery of mix of non-ferrous metals">
										</option>
										<option value="incineration without energy recovery of mix of non-ferrous metals">
										</option>
										<option value="landfill of mix of non-ferrous metals">
										</option>
										<option value="other disposal of mix of non-ferrous metals">
										</option>
										<option value="recycling of mix of non-ferrous metals">
										</option>
										<option value="oxygen steel furnace gas">
										</option>
										<option value="other vehicles">
										</option>
										<option value="macaroni">
										</option>
										<option value="maize">
										</option>
										<option value="green corn (maize)">
										</option>
										<option value="malt extract">
										</option>
										<option value="malt">
										</option>
										<option value="mango pulp">
										</option>
										<option value="mangoes">
										</option>
										<option value="abaca manila hemp">
										</option>
										<option value="liquid margarine">
										</option>
										<option value="margarine and shortening">
										</option>
										<option value="mate">
										</option>
										<option value="meat of asses">
										</option>
										<option value="beef meat as carcass">
										</option>
										<option value="buffalo meat as carcass, global mix">
										</option>
										<option value="chicken meat">
										</option>
										<option value="meat, dried nes">
										</option>
										<option value="duck meat">
										</option>
										<option value="meat extracts">
										</option>
										<option value="game meat">
										</option>
										<option value="goat meat as carcass">
										</option>
										<option value="goose meat">
										</option>
										<option value="homogenized meat preparations">
										</option>
										<option value="horse meat">
										</option>
										<option value="meat of mules">
										</option>
										<option value="meat, prepared nes">
										</option>
										<option value="meat of other domestic camelids">
										</option>
										<option value="meat of other domestic rodents">
										</option>
										<option value="pig meat as carcass">
										</option>
										<option value="meat nes">
										</option>
										<option value="rabbit meat">
										</option>
										<option value="meat of sheep">
										</option>
										<option value="turkey meat">
										</option>
										<option value="melons, cantaloupes">
										</option>
										<option value="melonseed">
										</option>
										<option value="milk, dry buttermilk">
										</option>
										<option value="products of natural milk constitue, nes">
										</option>
										<option value="skim milk of buffalo">
										</option>
										<option value="skim milk of cows">
										</option>
										<option value="dry skim cow milk">
										</option>
										<option value="skim sheep milk">
										</option>
										<option value="millet">
										</option>
										<option value="mixes and doughs">
										</option>
										<option value="molasses">
										</option>
										<option value="canned mushrooms">
										</option>
										<option value="dried mushrooms">
										</option>
										<option value="mushrooms">
										</option>
										<option value="mustard seed">
										</option>
										<option value="naphtha">
										</option>
										<option value="nickel ores and concentrates">
										</option>
										<option value="other nk compounds">
										</option>
										<option value="NPK fertilizer">
										</option>
										<option value="NP fertilizer">
										</option>
										<option value="non-specified petroleum products">
										</option>
										<option value="nuclear fuel">
										</option>
										<option value="ammonium nitrate (an)">
										</option>
										<option value="ammonium sulphate">
										</option>
										<option value="calcium ammonium nitrate (can) and other mixtures with calcium carbonate">
										</option>
										<option value="nitrogen solutions">
										</option>
										<option value="urea">
										</option>
										<option value="N fertilizer">
										</option>
										<option value="nutmeg, mace, cardamoms">
										</option>
										<option value="prepared nuts">
										</option>
										<option value="nuts nes">
										</option>
										<option value="">
										</option>
										<option value="other business services">
										</option>
										<option value="office machinery and computers">
										</option>
										<option value="hydrocarbons, other">
										</option>
										<option value="other non-ferrous metal products">
										</option>
										<option value="other non-ferrous metal ores and concentrates">
										</option>
										<option value="recycling of other non-ferrous metals">
										</option>
										<option value="incineration with energy recovery of other non-ferrous metals">
										</option>
										<option value="landfill of other non-ferrous metals">
										</option>
										<option value="other non-metallic mineral products">
										</option>
										<option value="recycling of discarded equipment">
										</option>
										<option value="gas/diesel oil">
										</option>
										<option value="incineration with energy recovery of discarded vehicles">
										</option>
										<option value="landfill of discarded vehicles">
										</option>
										<option value="recycling of discarded vehicles">
										</option>
										<option value="dates">
										</option>
										<option value="education services">
										</option>
										<option value="electrical machinery and apparatus n.e.c.">
										</option>
										<option value="ethane">
										</option>
										<option value="">
										</option>
										<option value="eggplants">
										</option>
										<option value="eggs, hen, in shell">
										</option>
										<option value="fabricated metal products, except machinery and equipment">
										</option>
										<option value="services auxiliary to financial intermediation">
										</option>
										<option value="">
										</option>
										<option value="insurance and pension funding services, except compulsory social security services">
										</option>
										<option value="financial intermediation services, except insurance and pension funding services">
										</option>
										<option value="fish and other fishing products; services incidental of fishing">
										</option>
										<option value="heavy fuel oil">
										</option>
										<option value="waste water treatment of food">
										</option>
										<option value="products of forestry, logging and related services">
										</option>
										<option value="other disposal of food">
										</option>
										<option value="recycling of food">
										</option>
										<option value="fish products">
										</option>
										<option value="furniture; other manufactured goods n.e.c.">
										</option>
										<option value="fatty acids">
										</option>
										<option value="fat of buffalo">
										</option>
										<option value="fat of camels">
										</option>
										<option value="fat of cattle">
										</option>
										<option value="fat of goats">
										</option>
										<option value="fatty liver preparations">
										</option>
										<option value="fat preparations nes">
										</option>
										<option value="fat of other camelids">
										</option>
										<option value="fat of pigs">
										</option>
										<option value="fat of poultry">
										</option>
										<option value="fat of poultry, rendered">
										</option>
										<option value="fat of sheep">
										</option>
										<option value="residues of fatty substances">
										</option>
										<option value="">
										</option>
										<option value="figs, dried">
										</option>
										<option value="figs">
										</option>
										<option value="flax fibre and tow">
										</option>
										<option value="barley flour and grits">
										</option>
										<option value="flour of buckwheat">
										</option>
										<option value="flour of cassava">
										</option>
										<option value="flour of fonio">
										</option>
										<option value="flour of fruits">
										</option>
										<option value="flour of maize">
										</option>
										<option value="flour of millet">
										</option>
										<option value="flour of mixed grain">
										</option>
										<option value="flour of mustard seed">
										</option>
										<option value="food preparations nes">
										</option>
										<option value="flour of potatoes">
										</option>
										<option value="flour of pulses">
										</option>
										<option value="flour of rice">
										</option>
										<option value="flour of roots and tubers nes">
										</option>
										<option value="flour of rye">
										</option>
										<option value="flour of sorghum">
										</option>
										<option value="flour of triticale">
										</option>
										<option value="flour of wheat">
										</option>
										<option value="fonio">
										</option>
										<option value="other fructose and syrup">
										</option>
										<option value="fruit, dried nes">
										</option>
										<option value="homogenized cooked fruit, prepared">
										</option>
										<option value="fruit, prepared nes">
										</option>
										<option value="wearing apparel; furs">
										</option>
										<option value="distribution services of gaseous fuels through mains (excl the gas)">
										</option>
										<option value="natural gas extraction">
										</option>
										<option value="natural gas liquids">
										</option>
										<option value="gas coke">
										</option>
										<option value="gasoline type jet fuel">
										</option>
										<option value="glass and glass products">
										</option>
										<option value="collection of glass bottles service">
										</option>
										<option value="recycling of glass">
										</option>
										<option value="incineration with energy recovery of glass">
										</option>
										<option value="incineration without energy recovery of glass">
										</option>
										<option value="landfill of glass">
										</option>
										<option value="garlic">
										</option>
										<option value="germ of maize">
										</option>
										<option value="germ of wheat">
										</option>
										<option value="ghee, from buffalo milk">
										</option>
										<option value="ghee from cow milk">
										</option>
										<option value="ginger">
										</option>
										<option value="glucose and dextrose">
										</option>
										<option value="maize gluten">
										</option>
										<option value="rice, gluten">
										</option>
										<option value="wheat gluten">
										</option>
										<option value="meat from goat (live)">
										</option>
										<option value="gooseberries">
										</option>
										<option value="mixed grain">
										</option>
										<option value="grapefruit and pomelo">
										</option>
										<option value="grapes">
										</option>
										<option value="must of grape">
										</option>
										<option value="prepared groundnuts">
										</option>
										<option value="groundnuts, without shell">
										</option>
										<option value="groundnuts, in shell">
										</option>
										<option value="incineration with energy recovery of hazardous waste">
										</option>
										<option value="incineration without energy recovery of hazardous waste">
										</option>
										<option value="landfill of hazardous waste">
										</option>
										<option value="other disposal of hazardous waste">
										</option>
										<option value="recycling of hazardous waste">
										</option>
										<option value="health and social work services">
										</option>
										<option value="hotel and restaurant services">
										</option>
										<option value="heat (steam and hot water) from heat production">
										</option>
										<option value="hazelnuts, without shell">
										</option>
										<option value="hazelnuts, in shell">
										</option>
										<option value="hemp fibre and tow">
										</option>
										<option value="hempseed">
										</option>
										<option value="buffalo hides, fresh">
										</option>
										<option value="cattle hides, fresh">
										</option>
										<option value="honey">
										</option>
										<option value="hops">
										</option>
										<option value="incineration with energy recovery of food">
										</option>
										<option value="incineration without energy recovery of food">
										</option>
										<option value="incineration with energy recovery of plastic/rubber">
										</option>
										<option value="incineration without energy recovery of plastic and rubber">
										</option>
										<option value="incineration with energy recovery of paper">
										</option>
										<option value="incineration without energy recovery of paper">
										</option>
										<option value="incineration with energy recovery of wood">
										</option>
										<option value="incineration without energy recovery of wood waste">
										</option>
										<option value="iron ores">
										</option>
										<option value="ice cream and edible ice">
										</option>
										<option value="isoglucose">
										</option>
										<option value="jojoba seeds">
										</option>
										<option value="apple juice">
										</option>
										<option value="apple juice, concentrated">
										</option>
										<option value="juice of fruits nes">
										</option>
										<option value="grapefruit juice, concentrated">
										</option>
										<option value="juice of grape">
										</option>
										<option value="rice-fermented beverages">
										</option>
										<option value="blueberries">
										</option>
										<option value="bran of barley">
										</option>
										<option value="bran of buckwheat">
										</option>
										<option value="bran of cereals nes">
										</option>
										<option value="bran of fonio">
										</option>
										<option value="bran of maize">
										</option>
										<option value="bran of millet">
										</option>
										<option value="bran of mixed grain">
										</option>
										<option value="bran of oats">
										</option>
										<option value="bran of pulses">
										</option>
										<option value="bran of rice">
										</option>
										<option value="bran of rye">
										</option>
										<option value="bran of sorghum">
										</option>
										<option value="bran of triticale">
										</option>
										<option value="bran of wheat">
										</option>
										<option value="brazil nuts, without shell">
										</option>
										<option value="brazil nuts, in shell">
										</option>
										<option value="bread">
										</option>
										<option value="broad beans, dry">
										</option>
										<option value="buckwheat">
										</option>
										<option value="meat from buffalo (live)">
										</option>
										<option value="milk raw from buffalo">
										</option>
										<option value="butter of buffalo milk">
										</option>
										<option value="butter of cow milk">
										</option>
										<option value="butter of goat milk">
										</option>
										<option value="butter and ghee of sheep milk">
										</option>
										<option value="buttermilk, curdled milk, acidified milk">
										</option>
										<option value="butter of karite nuts">
										</option>
										<option value="charcoal">
										</option>
										<option value="chemicals nec">
										</option>
										<option value="chemical and fertilizer minerals">
										</option>
										<option value="cement, lime and plaster">
										</option>
										<option value="crude petroleum extraction">
										</option>
										<option value="coking coal">
										</option>
										<option value="coke oven coke">
										</option>
										<option value="computer and related services">
										</option>
										<option value="construction work">
										</option>
										<option value="recycling of construction waste">
										</option>
										<option value="coke oven gas">
										</option>
										<option value="copper ores and concentrates">
										</option>
										<option value="copper products">
										</option>
										<option value="recycling of copper">
										</option>
										<option value="coal tar">
										</option>
										<option value="incineration with energy recovery of construction waste">
										</option>
										<option value="incineration without energy recovery of construction waste">
										</option>
										<option value="landfill of construction waste">
										</option>
										<option value="other disposal of construction waste">
										</option>
										<option value="ceramic goods">
										</option>
										<option value="incineration with energy recovery of copper">
										</option>
										<option value="landfill of copper">
										</option>
										<option value="cabbages">
										</option>
										<option value="milk raw from camel">
										</option>
										<option value="canary seed">
										</option>
										<option value="carobs">
										</option>
										<option value="carrot">
										</option>
										<option value="casein">
										</option>
										<option value="cashew nuts, without shell">
										</option>
										<option value="cashewapple">
										</option>
										<option value="cashew nuts, in shell">
										</option>
										<option value="cassava">
										</option>
										<option value="cassava, dried">
										</option>
										<option value="cassava leaves">
										</option>
										<option value="castor beans">
										</option>
										<option value="meat from cattle (live)">
										</option>
										<option value="milk raw from cow">
										</option>
										<option value="cauliflowers and broccoli">
										</option>
										<option value="breakfast cereals">
										</option>
										<option value="cereal preparations">
										</option>
										<option value="cereals, nes">
										</option>
										<option value="cheese of buffalo milk">
										</option>
										<option value="cheese from skimmed cow milk">
										</option>
										<option value="cheese from whole cow milk">
										</option>
										<option value="cheese of goat milk">
										</option>
										<option value="processed cheese">
										</option>
										<option value="cheese of sheep milk">
										</option>
										<option value="sour cherries">
										</option>
										<option value="cherries">
										</option>
										<option value="chestnuts">
										</option>
										<option value="chick-peas, dry">
										</option>
										<option value="chicory roots">
										</option>
										<option value="chillies and peppers (green)">
										</option>
										<option value="pimento">
										</option>
										<option value="chocolate products nes">
										</option>
										<option value="cider, etc.">
										</option>
										<option value="cinnamon (canella)">
										</option>
										<option value="cake of copra">
										</option>
										<option value="cake of cottonseed">
										</option>
										<option value="cake of groundnuts">
										</option>
										<option value="cake of kapok">
										</option>
										<option value="cake of linseed">
										</option>
										<option value="cake of maize">
										</option>
										<option value="cake of mustard seed">
										</option>
										<option value="cake of palm kernel">
										</option>
										<option value="cake of rapeseed">
										</option>
										<option value="cake of rice bran">
										</option>
										<option value="cake of safflower seed">
										</option>
										<option value="cake of sesame seed">
										</option>
										<option value="cake of soybeans">
										</option>
										<option value="cake of sunflower seed">
										</option>
										<option value="cloves">
										</option>
										<option value="milk raw from goat">
										</option>
										<option value="cocoa butter">
										</option>
										<option value="cocoa husks and shells">
										</option>
										<option value="cocoa paste">
										</option>
										<option value="cocoa powder and cake">
										</option>
										<option value="cocoa beans">
										</option>
										<option value="coconuts, desiccated">
										</option>
										<option value="coconuts">
										</option>
										<option value="coffee extracts">
										</option>
										<option value="coffee substitutes">
										</option>
										<option value="coffee, roasted">
										</option>
										<option value="coffee green">
										</option>
										<option value="coir">
										</option>
										<option value="copra">
										</option>
										<option value="cottonseed">
										</option>
										<option value="cotton lint">
										</option>
										<option value="cow peas, dry">
										</option>
										<option value="cranberries">
										</option>
										<option value="cream, fresh">
										</option>
										<option value="cucumbers and gherkins">
										</option>
										<option value="currants">
										</option>
										<option value="incineration with energy recovery of discarded equipment">
										</option>
										<option value="incineration without energy recovery of discarded equipment">
										</option>
										<option value="landfill of discarded equipment">
										</option>
										<option value="other disposal of discarded equipment">
										</option>
										<option value="Retail trade services of motor fuel">
										</option>
										<option value="Sale, maintenance, repair of motor vehicles, motor vehicles parts, motorcycles, motor cycles parts and accessoiries">
										</option>
										<option value="Retail  trade services, except of motor vehicles and motorcycles; repair services of personal and household goods (52)">
										</option>
										<option value="Wholesale trade and commission trade services, except of motor vehicles and motorcycles (51)">
										</option>
										<option value="Textiles (17)">
										</option>
										<option value="Energy_recovery of textiles">
										</option>
										<option value="Incineration of textiles">
										</option>
										<option value="Landfill of textiles">
										</option>
										<option value="Recycling of textiles">
										</option>
										<option value="Other land transportation services">
										</option>
										<option value="Tobacco products (16)">
										</option>
										<option value="Transportation services via pipelines">
										</option>
										<option value="Railway transportation services">
										</option>
										<option value="Inland water transportation services">
										</option>
										<option value="Sea and coastal water transportation services">
										</option>
										<option value="Tallowtree seed">
										</option>
										<option value="Tallow">
										</option>
										<option value="Tapioca, cassava">
										</option>
										<option value="Tapioca, potatoes">
										</option>
										<option value="Taro (cocoyam)">
										</option>
										<option value="Tea">
										</option>
										<option value="Tangerines, mandarins, clementines, satsumas">
										</option>
										<option value="Tobacco, unmanufactured">
										</option>
										<option value="Tomatoes, peeled">
										</option>
										<option value="Tomatoes, paste">
										</option>
										<option value="Tomatoes">
										</option>
										<option value="Triticale">
										</option>
										<option value="Tung nuts">
										</option>
										<option value="Energy_recovery of unsorted waste">
										</option>
										<option value="Incineration of unsorted waste">
										</option>
										<option value="Landfill of unsorted waste">
										</option>
										<option value="Other_disposal of unsorted waste">
										</option>
										<option value="Recycling of unsorted waste">
										</option>
										<option value="Vanilla">
										</option>
										<option value="Vegetables, homogenized preparations">
										</option>
										<option value="Vegetable tallow">
										</option>
										<option value="Vegetables, leguminous nes">
										</option>
										<option value="Vetches">
										</option>
										<option value="Collected and purified water, distribution services of water (41)">
										</option>
										<option value="White Spirit &amp; SBP">
										</option>
										<option value="Wood and products of wood and cork (except furniture); articles of straw and plaiting materials (20)">
										</option>
										<option value="Wool, silk-worm cocoons">
										</option>
										<option value="Recycling of wood">
										</option>
										<option value="Other_disposal of wood">
										</option>
										<option value="Wafers">
										</option>
										<option value="Walnuts, shelled">
										</option>
										<option value="Walnuts, with shell">
										</option>
										<option value="Watermelons">
										</option>
										<option value="Wheat">
										</option>
										<option value="Whey, condensed">
										</option>
										<option value="Whey, dry">
										</option>
										<option value="Whey, cheese">
										</option>
										<option value="Whey, fresh">
										</option>
										<option value="Wine">
										</option>
										<option value="Yams">
										</option>
										<option value="Yoghurt">
										</option>
										<option value="Cars">
										</option>
										<option value="Bottle water">
										</option>
										<option value="buses">
										</option>
										<option value="Oil, castor beans">
										</option>
										<option value="">
										</option>
										<option value="Animal energy feed">
										</option>
										<option value="Anomal protein feed">
										</option>
										<option value="Fruit, tropical fresh nes">
										</option>
										<option value="Fibre crops nes">
										</option>
										<option value="Fruit, citrus nes">
										</option>
										<option value="Fruit, fresh nes">
										</option>
										<option value="Fruit, pome nes">
										</option>
										<option value="Fruit, stone nes">
										</option>
										<option value="Vegetables, fresh nes">
										</option>
										<option value="Oil palm fruit">
										</option>
										<option value="Trucks">
										</option>
										<option value="Oil, vegetable origin nes">
										</option>
										<option value="Milk, whole fresh buffalo">
										</option>
										<option value="Milk, whole fresh cow">
										</option>
										<option value="Milk, whole fresh goat">
										</option>
										<option value="Milk, whole fresh sheep">
										</option>
										<option value="additives/blending components">
										</option>
										<option value="aviation gasoline">
										</option>
										<option value="aluminium and aluminium products">
										</option>
										<option value="aluminium ores and concentrates">
										</option>
										<option value="recycling of aluminium">
										</option>
										<option value="incineration with energy recovery of aluminium">
										</option>
										<option value="landfill of aluminium">
										</option>
										<option value="anthracite">
										</option>
										<option value="recycling of ashes">
										</option>
										<option value="landfill of ashes">
										</option>
										<option value="agave fibres nes">
										</option>
										<option value="">
										</option>
										<option value="almonds, without shell">
										</option>
										<option value="almonds, in shell">
										</option>
										<option value="">
										</option>
										<option value="anise, badian, fennel">
										</option>
										<option value="apples">
										</option>
										<option value="apricots">
										</option>
										<option value="apricots, dried">
										</option>
										<option value="areca nuts">
										</option>
										<option value="artichokes">
										</option>
										<option value="asparagus">
										</option>
										<option value="avocados">
										</option>
										<option value="energy recovery of batteries and accumulators waste">
										</option>
										<option value="incineration without energy recovery of batteries and accumulators waste">
										</option>
										<option value="landfill of batteries and accumulators waste">
										</option>
										<option value="recycling of batteries and accumulators waste">
										</option>
										<option value="biodiesels">
										</option>
										<option value="biogasoline">
										</option>
										<option value="bitumen">
										</option>
										<option value="bkb/peat briquettes">
										</option>
										<option value="bricks, tiles and construction products, in baked clay">
										</option>
										<option value="bambara beans">
										</option>
										<option value="bananas">
										</option>
										<option value="barley, pearled">
										</option>
										<option value="pot barley">
										</option>
										<option value="barley">
										</option>
										<option value="jute-like fibres">
										</option>
										<option value="beans, green">
										</option>
										<option value="beans, dry">
										</option>
										<option value="sausages of beef and veal">
										</option>
										<option value="beef and veal, dried, salted, smoked">
										</option>
										<option value="">
										</option>
										<option value="">
										</option>
										<option value="">
										</option>
										<option value="">
										</option>
										<option value="beef meat processed (boneless)">
										</option>
										<option value="beer of barley">
										</option>
										<option value="beer of millet">
										</option>
										<option value="beer of maize">
										</option>
										<option value="beer of sorghum">
										</option>
										<option value="beeswax">
										</option>
										<option value="berries nes">
										</option>
										<option value="beverages, distilled alcoholic">
										</option>
										<option value="Pastry">
										</option>
										<option value="Peaches and nectarines">
										</option>
										<option value="Peanut butter">
										</option>
										<option value="Pears">
										</option>
										<option value="Peas, green">
										</option>
										<option value="Peas, dry">
										</option>
										<option value="Pepper (piper spp.)">
										</option>
										<option value="Peppermint">
										</option>
										<option value="Persimmons">
										</option>
										<option value="Phosphatic fertilizers">
										</option>
										<option value="P fert from BIOF">
										</option>
										<option value="P fert from BIOP">
										</option>
										<option value="P fert from BIOs">
										</option>
										<option value="P fert from COMF">
										</option>
										<option value="P fert from COMW">
										</option>
										<option value="P fert from manure treat conventional">
										</option>
										<option value="Pigeon peas">
										</option>
										<option value="Pig meat (live)">
										</option>
										<option value="Pineapples canned">
										</option>
										<option value="Pineapples">
										</option>
										<option value="Pistachios">
										</option>
										<option value="Plantains and others">
										</option>
										<option value="Plums dried (prunes)">
										</option>
										<option value="Plums and sloes">
										</option>
										<option value="Poultry - Meat (live)">
										</option>
										<option value="Poppy seed">
										</option>
										<option value="Meat of pig with the bone, fresh or chilled">
										</option>
										<option value="Meat, pig sausages">
										</option>
										<option value="Bacon and ham">
										</option>
										<option value="Meat of pig boneless, fresh or chilled">
										</option>
										<option value="Meat, pig, preparations">
										</option>
										<option value="Sausages and similar products of meat, offal or blood of pig">
										</option>
										<option value="Pig meat preparations">
										</option>
										<option value="Potatoes, frozen">
										</option>
										<option value="Potatoes">
										</option>
										<option value="Pulses nes">
										</option>
										<option value="Pumpkins, squash and gourds">
										</option>
										<option value="Pyrethrum, dried">
										</option>
										<option value="Quinoa">
										</option>
										<option value="Quinces">
										</option>
										<option value="Radio, television and communication equipment and apparatus (32)">
										</option>
										<option value="Real estate services (70)">
										</option>
										<option value="Recreational, cultural and sporting services (92)">
										</option>
										<option value="Refinery Feedstocks">
										</option>
										<option value="Research and development services (73)">
										</option>
										<option value="Refinery Gas">
										</option>
										<option value="Rubber and plastic products (25)">
										</option>
										<option value="Secondary raw materials">
										</option>
										<option value="Raisins">
										</option>
										<option value="Ramie">
										</option>
										<option value="Rapeseed">
										</option>
										<option value="Raspberries">
										</option>
										<option value="Rice, broken">
										</option>
										<option value="Rice, husked">
										</option>
										<option value="Rice, milled/husked">
										</option>
										<option value="Rice, milled">
										</option>
										<option value="Rice, paddy">
										</option>
										<option value="Roots and tubers nes">
										</option>
										<option value="Rubber, natural">
										</option>
										<option value="Rye">
										</option>
										<option value="Sand and clay">
										</option>
										<option value="Energy_recovery of sewage">
										</option>
										<option value="Incineration of sewage">
										</option>
										<option value="Landfill of sewage">
										</option>
										<option value="Other_disposal of sewage">
										</option>
										<option value="Recycling of sewage">
										</option>
										<option value="Biogasification and land application">
										</option>
										<option value="P fert from waste eater treat">
										</option>
										<option value="Basic iron and steel and of ferro-alloys and first products thereof">
										</option>
										<option value="Recycling of steel">
										</option>
										<option value="Stone">
										</option>
										<option value="Energy_recovery of steel">
										</option>
										<option value="Incineration of steel">
										</option>
										<option value="Landfill of steel">
										</option>
										<option value="Other_disposal of steel">
										</option>
										<option value="Sub-Bituminous Coal">
										</option>
										<option value="Safflower seed">
										</option>
										<option value="Sesame seed">
										</option>
										<option value="Sheep - Meat (live)">
										</option>
										<option value="Sheep - Milk">
										</option>
										<option value="Silk-worm cocoons, reelable">
										</option>
										<option value="Silk, raw">
										</option>
										<option value="Sisal">
										</option>
										<option value="Skins, goat, fresh">
										</option>
										<option value="Skins, sheep, fresh">
										</option>
										<option value="Snails, not sea">
										</option>
										<option value="Sorghum">
										</option>
										<option value="Soya sauce">
										</option>
										<option value="Soya curd">
										</option>
										<option value="Soya paste">
										</option>
										<option value="Soybeans">
										</option>
										<option value="Spices nes">
										</option>
										<option value="Spinach">
										</option>
										<option value="Starch, cassava">
										</option>
										<option value="Starch, maize">
										</option>
										<option value="Starch, potatoes">
										</option>
										<option value="Starch, rice">
										</option>
										<option value="Starch, wheat">
										</option>
										<option value="Strawberries">
										</option>
										<option value="String beans">
										</option>
										<option value="Sugar crops nes">
										</option>
										<option value="Sugar cane">
										</option>
										<option value="Sugar non-centrifugal">
										</option>
										<option value="Sugar Raw Centrifugal">
										</option>
										<option value="Sugar nes">
										</option>
										<option value="Sugar beet">
										</option>
										<option value="Sunflower seed">
										</option>
										<option value="Sweet corn prep or preserved">
										</option>
										<option value="Sweet corn frozen">
										</option>
										<option value="Sweet potatoes">
										</option>
										<option value="Air transport services (62)">
										</option>
										<option value="Supporting and auxiliary transport services; travel agency services (63)">
										</option>
										<option value="Molasses">
										</option>
										<option value="Mushrooms, canned">
										</option>
										<option value="Mushrooms, dried">
										</option>
										<option value="Mushrooms and truffles">
										</option>
										<option value="Mustard seed">
										</option>
										<option value="Naphtha">
										</option>
										<option value="Nickel ores and concentrates">
										</option>
										<option value="NK_fertilizers">
										</option>
										<option value="NPK_fertilizers">
										</option>
										<option value="NP_fertilizers">
										</option>
										<option value="Non-specified Petroleum Products">
										</option>
										<option value="Nuclear fuel">
										</option>
										<option value="Ammonium nitrate (AN)">
										</option>
										<option value="Ammonium sulphate">
										</option>
										<option value="Calcium ammonium nitrate">
										</option>
										<option value="Nitrogen solutions">
										</option>
										<option value="Urea">
										</option>
										<option value="Nutmeg, mace and cardamoms">
										</option>
										<option value="Nuts, prepared (exc. groundnuts)">
										</option>
										<option value="Nuts nes">
										</option>
										<option value="Other Liquid Biofuels">
										</option>
										<option value="Other business services (74)">
										</option>
										<option value="Office machinery and computers (30)">
										</option>
										<option value="Other Hydrocarbons">
										</option>
										<option value="Other non-ferrous metal products">
										</option>
										<option value="Other non-ferrous metal ores and concentrates">
										</option>
										<option value="Recycling of other non-ferrous metals">
										</option>
										<option value="Energy_recovery of other non-ferrous metals">
										</option>
										<option value="Landfill of other non-ferrous metals">
										</option>
										<option value="Other non-metallic mineral products">
										</option>
										<option value="Uranium and thorium ores (12)">
										</option>
										<option value="Membership organisation services n.e.c. (91)">
										</option>
										<option value="Other services (93)">
										</option>
										<option value="Other Bituminous Coal">
										</option>
										<option value="Other transport equipment (35)">
										</option>
										<option value="Oats rolled">
										</option>
										<option value="Oats">
										</option>
										<option value="Offals, liver chicken">
										</option>
										<option value="Offals, liver duck">
										</option>
										<option value="Offals, liver geese">
										</option>
										<option value="Offals, liver turkeys">
										</option>
										<option value="Offals, edible, cattle">
										</option>
										<option value="Offals, pigs, edible">
										</option>
										<option value="Offals, sheep,edible">
										</option>
										<option value="Offals, edible, buffaloes">
										</option>
										<option value="Offals, edible, camels">
										</option>
										<option value="Offals, edible, goats">
										</option>
										<option value="Offals, horses">
										</option>
										<option value="Oil, coconut (copra)">
										</option>
										<option value="Oil, cottonseed">
										</option>
										<option value="Oil, groundnut">
										</option>
										<option value="Oil, hempseed">
										</option>
										<option value="Oil, hydrogenated">
										</option>
										<option value="Oil, kapok">
										</option>
										<option value="Oil, linseed">
										</option>
										<option value="Oil, maize">
										</option>
										<option value="Oil, mustard">
										</option>
										<option value="Oil, olive, virgin">
										</option>
										<option value="Oil, olive residues">
										</option>
										<option value="Oil, palm kernel">
										</option>
										<option value="Oil, palm">
										</option>
										<option value="Oil, poppy">
										</option>
										<option value="Oil, rapeseed">
										</option>
										<option value="Oil, rice bran">
										</option>
										<option value="Oil, safflower">
										</option>
										<option value="Oil, sesame">
										</option>
										<option value="Oil, soybean">
										</option>
										<option value="Oil, sunflower">
										</option>
										<option value="Oil of Tung Nuts">
										</option>
										<option value="Oils, fats of animal nes">
										</option>
										<option value="Oilseeds nes">
										</option>
										<option value="Okra">
										</option>
										<option value="Olives">
										</option>
										<option value="Onions, shallots, green">
										</option>
										<option value="Onions, dry">
										</option>
										<option value="Oranges">
										</option>
										<option value="Other animal products">
										</option>
										<option value="Public administration and defence services; compulsory social security services (75)">
										</option>
										<option value="Paper and paper products">
										</option>
										<option value="Recycling of paper">
										</option>
										<option value="Paraffin Waxes">
										</option>
										<option value="Patent Fuel">
										</option>
										<option value="Other_disposal of paper">
										</option>
										<option value="Peat">
										</option>
										<option value="Petroleum Coke">
										</option>
										<option value="PK_fertilizers">
										</option>
										<option value="Plastics, basic">
										</option>
										<option value="Recycling of plastic and rubber">
										</option>
										<option value="Other_disposal of plastic and rubber">
										</option>
										<option value="Distribution and trade services of electricity">
										</option>
										<option value="Electricity by solar thermal">
										</option>
										<option value="Electricity by nuclear">
										</option>
										<option value="Electricity by tide, wave, ocean">
										</option>
										<option value="Transmission services of electricity">
										</option>
										<option value="Precious metals">
										</option>
										<option value="Precious metal ores and concentrates">
										</option>
										<option value="Recycling of preciuos metals">
										</option>
										<option value="Private households with employed persons (95)">
										</option>
										<option value="Post and telecommunication services (64)">
										</option>
										<option value="Pulp">
										</option>
										<option value="Papayas">
										</option>
										<option value="Juice, fruit nes">
										</option>
										<option value="Juice, grapefruit, concentrated">
										</option>
										<option value="Juice, grape">
										</option>
										<option value="Juice, grapefruit">
										</option>
										<option value="Juice, lemon, single strength">
										</option>
										<option value="Juice, lemon, concentrated">
										</option>
										<option value="Juice, mango">
										</option>
										<option value="Juice, orange, single strength">
										</option>
										<option value="Juice, orange, concentrated">
										</option>
										<option value="Juice, pineapple">
										</option>
										<option value="Juice, pineapple, concentrated">
										</option>
										<option value="Juice, tangerine">
										</option>
										<option value="Juice, tomato">
										</option>
										<option value="Juice, vegetables nes">
										</option>
										<option value="Jute">
										</option>
										<option value="Kerosene">
										</option>
										<option value="Kerosene Type Jet Fuel">
										</option>
										<option value="Kapok fibre">
										</option>
										<option value="Kapokseed shelled">
										</option>
										<option value="Kapokseed in shell">
										</option>
										<option value="Kapok fruit">
										</option>
										<option value="Karite nuts (sheanuts)">
										</option>
										<option value="K_fertilizer">
										</option>
										<option value="Kiwi fruit">
										</option>
										<option value="Kola nuts">
										</option>
										<option value="Landfill of food">
										</option>
										<option value="Landfill of plastic and rubber">
										</option>
										<option value="Landfill of paper">
										</option>
										<option value="Landfill of wood">
										</option>
										<option value="Leather and leather products (19)">
										</option>
										<option value="Lignite/Brown Coal">
										</option>
										<option value="Liquefied Petroleum Gases (LPG)">
										</option>
										<option value="Lubricants">
										</option>
										<option value="Lead, zinc and tin ores and concentrates">
										</option>
										<option value="Lead, zinc and tin and products thereof">
										</option>
										<option value="Recycling of lead, zinc and tin">
										</option>
										<option value="Energy_recovery of lead, zinc and tin">
										</option>
										<option value="Landfill of lead, zinc and tin">
										</option>
										<option value="Lactose">
										</option>
										<option value="Lard">
										</option>
										<option value="Lard stearine oil">
										</option>
										<option value="Leeks, other alliaceous vegetables">
										</option>
										<option value="Lemons and limes">
										</option>
										<option value="Lentils">
										</option>
										<option value="Lettuce and chicory">
										</option>
										<option value="Linseed">
										</option>
										<option value="to be detemined">
										</option>
										<option value="Liver Preparations">
										</option>
										<option value="Lupins">
										</option>
										<option value="Machinery and equipment n.e.c. (29)">
										</option>
										<option value="Renting services of machinery and equipment without operator and of personal and household goods (71)">
										</option>
										<option value="Energy_recovery of manure">
										</option>
										<option value="Incineration of manure">
										</option>
										<option value="Landfill of manure">
										</option>
										<option value="Other_disposal of manure">
										</option>
										<option value="Recycling of manure">
										</option>
										<option value="Blast Furnace Gas">
										</option>
										<option value="Biogas">
										</option>
										<option value="Printed matter and recorded media (22)">
										</option>
										<option value="Medical, precision and optical instruments, watches and clocks (33)">
										</option>
										<option value="Foundry work services">
										</option>
										<option value="Motor Gasoline">
										</option>
										<option value="Gas Works Gas">
										</option>
										<option value="Energy_recovery of mix of non-ferrous metals">
										</option>
										<option value="Incineration of mix of non-ferrous metals">
										</option>
										<option value="Landfill of mix of non-ferrous metals">
										</option>
										<option value="Other_disposal of mix of non-ferrous metals">
										</option>
										<option value="Recycling of mix of non-ferrous metals">
										</option>
										<option value="Oxygen Steel Furnace Gas">
										</option>
										<option value="Other vehicles">
										</option>
										<option value="Macaroni">
										</option>
										<option value="Maize">
										</option>
										<option value="Maize, green">
										</option>
										<option value="Malt extract">
										</option>
										<option value="Malt">
										</option>
										<option value="Mango pulp">
										</option>
										<option value="Mangoes, mangosteens, guavas">
										</option>
										<option value="Manila fibre (abaca)">
										</option>
										<option value="Margarine, liquid">
										</option>
										<option value="Margarine, short">
										</option>
										<option value="Maté">
										</option>
										<option value="Meat, ass">
										</option>
										<option value="Meat, cattle">
										</option>
										<option value="Meat, buffalo">
										</option>
										<option value="Meat, chicken">
										</option>
										<option value="Meat, dried nes">
										</option>
										<option value="Meat, duck">
										</option>
										<option value="Meat, extracts">
										</option>
										<option value="Meat, game">
										</option>
										<option value="Meat, goat">
										</option>
										<option value="Meat, goose and guinea fowl">
										</option>
										<option value="Meat, homogenized preparations">
										</option>
										<option value="Meat, horse">
										</option>
										<option value="Meat, mule">
										</option>
										<option value="Meat nes, preparations">
										</option>
										<option value="Meat, other camelids">
										</option>
										<option value="Meat, other rodents">
										</option>
										<option value="Meat, pig">
										</option>
										<option value="Meat nes">
										</option>
										<option value="Meat, rabbit">
										</option>
										<option value="Meat, sheep">
										</option>
										<option value="Meat, turkey">
										</option>
										<option value="Melons, other (inc.cantaloupes)">
										</option>
										<option value="Melonseed">
										</option>
										<option value="Dry Buttermilk">
										</option>
										<option value="Milk, products of natural constituents nes">
										</option>
										<option value="Milk, skimmed buffalo">
										</option>
										<option value="Milk, skimmed cow">
										</option>
										<option value="Milk, skimmed dried">
										</option>
										<option value="Milk, skimmed sheep">
										</option>
										<option value="Millet">
										</option>
										<option value="Mixes and doughs">
										</option>
										<option value="Eggs, hen, in shell">
										</option>
										<option value="Fabricated metal products, except machinery and equipment (28)">
										</option>
										<option value="Services auxiliary to financial intermediation (67)">
										</option>
										<option value="Insurance and pension funding services, except compulsory social security services (66)">
										</option>
										<option value="Financial intermediation services, except insurance and pension funding services (65)">
										</option>
										<option value="Fish">
										</option>
										<option value="">
										</option>
										<option value="Heavy Fuel Oil">
										</option>
										<option value="Waste wateer treatment of food">
										</option>
										<option value="Products of forestry, logging and related services (02)">
										</option>
										<option value="Wood for combustion">
										</option>
										<option value="Other_disposal of food">
										</option>
										<option value="Recycling of food">
										</option>
										<option value="Fish products">
										</option>
										<option value="Furniture; other manufactured goods n.e.c. (36)">
										</option>
										<option value="Fatty acids">
										</option>
										<option value="Fat, buffaloes">
										</option>
										<option value="Fat, camels">
										</option>
										<option value="Fat, cattle">
										</option>
										<option value="Fat, goats">
										</option>
										<option value="Fat, liver prepared (foie gras)">
										</option>
										<option value="Fat nes, prepared">
										</option>
										<option value="Fat, other camelids">
										</option>
										<option value="Fat, pigs">
										</option>
										<option value="Fat, poultry">
										</option>
										<option value="Fat, poultry, rendered">
										</option>
										<option value="Fat, sheep">
										</option>
										<option value="Fatty substance residues">
										</option>
										<option value="Feed and meal, gluten">
										</option>
										<option value="Figs dried">
										</option>
										<option value="Figs">
										</option>
										<option value="Flax fibre and tow">
										</option>
										<option value="Flour, barley and grits">
										</option>
										<option value="Flour, buckwheat">
										</option>
										<option value="Flour, cassava">
										</option>
										<option value="Flour, fonio">
										</option>
										<option value="Flour, fruit">
										</option>
										<option value="Flour, maize">
										</option>
										<option value="Flour, millet">
										</option>
										<option value="Flour, mixed grain">
										</option>
										<option value="Flour, mustard">
										</option>
										<option value="Food prep nes">
										</option>
										<option value="Flour, potatoes">
										</option>
										<option value="Flour, pulses">
										</option>
										<option value="Flour, rice">
										</option>
										<option value="Flour, roots and tubers nes">
										</option>
										<option value="Flour, rye">
										</option>
										<option value="Flour, sorghum">
										</option>
										<option value="Flour, triticale">
										</option>
										<option value="Flour, wheat">
										</option>
										<option value="Fonio">
										</option>
										<option value="Fructose and syrup, other">
										</option>
										<option value="Fruit, dried nes">
										</option>
										<option value="Fruit, cooked, homogenized preparations">
										</option>
										<option value="Fruit, prepared nes">
										</option>
										<option value="Wearing apparel; furs (18)">
										</option>
										<option value="Distribution services of gaseous fuels through mains">
										</option>
										<option value="Natural gas and services related to natural gas extraction, excluding surveying">
										</option>
										<option value="Natural Gas Liquids">
										</option>
										<option value="Gas Coke">
										</option>
										<option value="Gasoline Type Jet Fuel">
										</option>
										<option value="Glass and glass products">
										</option>
										<option value="Collection of glass bottles service">
										</option>
										<option value="Recycling of glass">
										</option>
										<option value="Energy_recovery of glass">
										</option>
										<option value="Incineration of glass">
										</option>
										<option value="Landfill of glass">
										</option>
										<option value="Garlic">
										</option>
										<option value="Germ, maize">
										</option>
										<option value="Germ, wheat">
										</option>
										<option value="Ghee, buffalo milk">
										</option>
										<option value="Ghee, butteroil of cow milk">
										</option>
										<option value="Ginger">
										</option>
										<option value="Glucose and dextrose">
										</option>
										<option value="Gluten, maize">
										</option>
										<option value="Gluten, rice">
										</option>
										<option value="Gluten, wheat">
										</option>
										<option value="Goats - Meat (live)">
										</option>
										<option value="Gooseberries">
										</option>
										<option value="Grain, mixed">
										</option>
										<option value="Grapefruit (inc. pomelos)">
										</option>
										<option value="Grapes">
										</option>
										<option value="Grapes, must">
										</option>
										<option value="Groundnuts, prepared">
										</option>
										<option value="Groundnuts, shelled">
										</option>
										<option value="Groundnuts, with shell">
										</option>
										<option value="Energy_recovery of hazardous">
										</option>
										<option value="Incineration of hazardous waste">
										</option>
										<option value="Landfill of hazardous">
										</option>
										<option value="Other_disposal of hazardous">
										</option>
										<option value="Recycling of hazardous">
										</option>
										<option value="Health and social work services (85)">
										</option>
										<option value="Hotel and restaurant services (55)">
										</option>
										<option value="Steam and hot water supply services">
										</option>
										<option value="Hazelnuts, shelled">
										</option>
										<option value="Hazelnuts, with shell">
										</option>
										<option value="Hemp tow waste">
										</option>
										<option value="Hempseed">
										</option>
										<option value="Hides, buffalo, fresh">
										</option>
										<option value="Hides, cattle, fresh">
										</option>
										<option value="Honey, natural">
										</option>
										<option value="Hops">
										</option>
										<option value="Energy_recovery of food">
										</option>
										<option value="Incineration of food">
										</option>
										<option value="Energy_recovery of plastic/rubber">
										</option>
										<option value="Incineration of plastic and rubber">
										</option>
										<option value="Energy_recovery of paper">
										</option>
										<option value="Incineration of paper">
										</option>
										<option value="Energy_recovery of wood">
										</option>
										<option value="Incineration of wood waste">
										</option>
										<option value="Iron ores">
										</option>
										<option value="Ice cream and edible ice">
										</option>
										<option value="Isoglucose">
										</option>
										<option value="Jojoba seed">
										</option>
										<option value="Juice, apple, single strength">
										</option>
										<option value="Juice, apple, concentrated">
										</option>
										<option value="Copper products">
										</option>
										<option value="Recycling of copper">
										</option>
										<option value="Coal Tar">
										</option>
										<option value="Energy_recovery of construction">
										</option>
										<option value="Incineration of construction">
										</option>
										<option value="Landfill of construction">
										</option>
										<option value="Other_disposal of construction">
										</option>
										<option value="Ceramic goods">
										</option>
										<option value="Energy_recovery of copper">
										</option>
										<option value="Landfill of copper">
										</option>
										<option value="Cabbages and other brassicas">
										</option>
										<option value="Camel - Milk">
										</option>
										<option value="Canary seed">
										</option>
										<option value="Carobs">
										</option>
										<option value="Carrots and turnips">
										</option>
										<option value="Casein">
										</option>
										<option value="Cashew nuts, shelled">
										</option>
										<option value="Cashewapple">
										</option>
										<option value="Cashew nuts, with shell">
										</option>
										<option value="Cassava">
										</option>
										<option value="Cassava dried">
										</option>
										<option value="Cassava leaves">
										</option>
										<option value="Castor oil seed">
										</option>
										<option value="Cattle - Meat (live)">
										</option>
										<option value="Cattle - Milk">
										</option>
										<option value="Cauliflowers and broccoli">
										</option>
										<option value="Cereals, breakfast">
										</option>
										<option value="Cereal preparations nes">
										</option>
										<option value="Cereals nes">
										</option>
										<option value="Cheese, buffalo milk">
										</option>
										<option value="Cheese, skimmed cow milk">
										</option>
										<option value="Cheese, whole cow milk">
										</option>
										<option value="Cheese, goat milk">
										</option>
										<option value="Cheese, processed">
										</option>
										<option value="Cheese, sheep milk">
										</option>
										<option value="Cherries, sour">
										</option>
										<option value="Cherries">
										</option>
										<option value="Chestnut">
										</option>
										<option value="Chick peas">
										</option>
										<option value="Chicory roots">
										</option>
										<option value="Chillies and peppers, green">
										</option>
										<option value="Chillies and peppers, dry">
										</option>
										<option value="Chocolate products nes">
										</option>
										<option value="Cider etc">
										</option>
										<option value="Cinnamon (cannella)">
										</option>
										<option value="Cake, copra">
										</option>
										<option value="Cake, cottonseed">
										</option>
										<option value="Cake, groundnuts">
										</option>
										<option value="Cake, kapok">
										</option>
										<option value="Cake, linseed">
										</option>
										<option value="Cake, maize">
										</option>
										<option value="Cake, mustard">
										</option>
										<option value="Cake, palm kernel">
										</option>
										<option value="Cake, rapeseed">
										</option>
										<option value="Cake, rice bran">
										</option>
										<option value="Cake, safflower">
										</option>
										<option value="Cake of Oilseeds nes">
										</option>
										<option value="Cake, sesame seed">
										</option>
										<option value="Cake, soybeans">
										</option>
										<option value="Cake, sunflower">
										</option>
										<option value="Cloves">
										</option>
										<option value="Goats - Milk">
										</option>
										<option value="Cocoa, butter">
										</option>
										<option value="Cocoa, husks, shell">
										</option>
										<option value="Cocoa, paste">
										</option>
										<option value="Cocoa, powder &amp; cake">
										</option>
										<option value="Cocoa, beans">
										</option>
										<option value="Coconuts, desiccated">
										</option>
										<option value="Coconuts">
										</option>
										<option value="Coffee, extracts">
										</option>
										<option value="Coffee, substitutes containing coffee">
										</option>
										<option value="Coffee, roasted">
										</option>
										<option value="Coffee, green">
										</option>
										<option value="Coir">
										</option>
										<option value="Copra">
										</option>
										<option value="Cottonseed">
										</option>
										<option value="Cotton lint">
										</option>
										<option value="Cow peas, dry">
										</option>
										<option value="Cranberries">
										</option>
										<option value="Cream fresh">
										</option>
										<option value="Cucumbers and gherkins">
										</option>
										<option value="Currants">
										</option>
										<option value="Energy_recovery of discarded equipment">
										</option>
										<option value="Incineration of discarded equipment">
										</option>
										<option value="Landfill of discarded equipment">
										</option>
										<option value="Other_disposal of discarded equipment">
										</option>
										<option value="Recycling of discarded equipment">
										</option>
										<option value="Gas/Diesel Oil">
										</option>
										<option value="Energy_recovery of discarded vehicles">
										</option>
										<option value="Landfill of discarded vehicles">
										</option>
										<option value="Recycling of discarded vehicles">
										</option>
										<option value="Dates">
										</option>
										<option value="Education services (80)">
										</option>
										<option value="Electricity">
										</option>
										<option value="Electrical machinery and apparatus n.e.c. (31)">
										</option>
										<option value="Ethane">
										</option>
										<option value="Extra-territorial services">
										</option>
										<option value="Eggplants (aubergines)">
										</option>
										<option value="Additives/Blending Components">
										</option>
										<option value="Aviation Gasoline">
										</option>
										<option value="Aluminium and aluminium products">
										</option>
										<option value="Aluminium ores and concentrates">
										</option>
										<option value="Recycling of aluminium">
										</option>
										<option value="Energy_recovery of aluminium">
										</option>
										<option value="Landfill of aluminium">
										</option>
										<option value="Anthracite">
										</option>
										<option value="Recycling of ashes">
										</option>
										<option value="Landfill of ashes">
										</option>
										<option value="Agave fibres nes">
										</option>
										<option value="Alcohol non food">
										</option>
										<option value="Almonds shelled">
										</option>
										<option value="Almonds, with shell">
										</option>
										<option value="Anise, badian, fennel, coriander">
										</option>
										<option value="Apples">
										</option>
										<option value="Apricots">
										</option>
										<option value="Apricots, dry">
										</option>
										<option value="Areca nuts">
										</option>
										<option value="Artichokes">
										</option>
										<option value="Asparagus">
										</option>
										<option value="Avocados">
										</option>
										<option value="Energy_recovery of batteries and accumulators wastes">
										</option>
										<option value="Incineration of batteries and accumulators wastes">
										</option>
										<option value="Landfill of batteries and accumulators wastes">
										</option>
										<option value="Recycling of batteries and accumulators wastes">
										</option>
										<option value="Biodiesels">
										</option>
										<option value="Biogasoline">
										</option>
										<option value="Bitumen">
										</option>
										<option value="BKB/Peat Briquettes">
										</option>
										<option value="Bricks, tiles and construction products, in baked clay">
										</option>
										<option value="Bambara beans">
										</option>
										<option value="Bananas">
										</option>
										<option value="Barley, pearled">
										</option>
										<option value="Barley, pot">
										</option>
										<option value="Barley">
										</option>
										<option value="Bastfibres, other">
										</option>
										<option value="Beans, green">
										</option>
										<option value="Beans, dry">
										</option>
										<option value="Meat, beef and veal sausages">
										</option>
										<option value="Meat, beef, dried, salted, smoked">
										</option>
										<option value="Meat of cattle boneless, fresh or chilled">
										</option>
										<option value="beef and veal preparations nes">
										</option>
										<option value="Meat, beef, preparations">
										</option>
										<option value="Bovine meat, salted, dried or smoked">
										</option>
										<option value="Meat, cattle, boneless (beef &amp; veal)">
										</option>
										<option value="Beer of barley">
										</option>
										<option value="Beer of millet">
										</option>
										<option value="Beer of maize">
										</option>
										<option value="Beer of sorghum">
										</option>
										<option value="Beeswax">
										</option>
										<option value="Berries nes">
										</option>
										<option value="Beverages, distilled alcoholic">
										</option>
										<option value="Beverages, fermented rice">
										</option>
										<option value="Blueberries">
										</option>
										<option value="Bran, barley">
										</option>
										<option value="Bran, buckwheat">
										</option>
										<option value="Bran, cereals nes">
										</option>
										<option value="Bran, fonio">
										</option>
										<option value="Bran, maize">
										</option>
										<option value="Bran, millet">
										</option>
										<option value="Bran, mixed grains">
										</option>
										<option value="Bran, oats">
										</option>
										<option value="Bran, pulses">
										</option>
										<option value="Bran, rice">
										</option>
										<option value="Bran, rye">
										</option>
										<option value="Bran, sorghum">
										</option>
										<option value="Bran, triticale">
										</option>
										<option value="Bran, wheat">
										</option>
										<option value="Brazil nuts, shelled">
										</option>
										<option value="Brazil nuts, with shell">
										</option>
										<option value="Bread">
										</option>
										<option value="Broad beans, horse beans, dry">
										</option>
										<option value="Buckwheat">
										</option>
										<option value="Buffalos - Meat (live)">
										</option>
										<option value="Buffalos - Milk">
										</option>
										<option value="Butter, buffalo milk">
										</option>
										<option value="Butter, cow milk">
										</option>
										<option value="Butter, goat milk">
										</option>
										<option value="Butter and ghee, sheep milk">
										</option>
										<option value="Buttermilk, curdled, acidified milk">
										</option>
										<option value="Butter of karite nuts">
										</option>
										<option value="Charcoal">
										</option>
										<option value="Chemicals nec">
										</option>
										<option value="Chemical and fertilizer minerals, salt and other mining and quarrying products n.e.c.">
										</option>
										<option value="Cement, lime and plaster">
										</option>
										<option value="Crude petroleum and services related to crude oil extraction, excluding surveying">
										</option>
										<option value="Coking Coal">
										</option>
										<option value="Coke Oven Coke">
										</option>
										<option value="Computer and related services (72)">
										</option>
										<option value="Construction work (45)">
										</option>
										<option value="Recycling of construction">
										</option>
										<option value="Coke oven gas">
										</option>
										<option value="Copper ores and concentrates">
										</option>
										<option value="">
										</option>
									</datalist>
									<button>
										<svg width="37" height="34" viewBox="0 0 37 34" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M34.9521 33.4583L21.15 20.4374C20.0458 21.3402 18.776 22.0346 17.3406 22.5208C15.9052 23.0069 14.4882 23.2499 13.0896 23.2499C9.69498 23.2499 6.82194 22.1416 4.47043 19.9249C2.1193 17.7086 0.943726 15.0003 0.943726 11.7999C0.943726 8.59992 2.11856 5.88881 4.46823 3.66659C6.81752 1.44436 9.68836 0.333252 13.0807 0.333252C16.4727 0.333252 19.3465 1.44228 21.7021 3.66034C24.0576 5.87874 25.2354 8.58915 25.2354 11.7916C25.2354 13.2152 24.9594 14.6041 24.4073 15.9583C23.8552 17.3124 23.1375 18.4583 22.2541 19.3958L36.0562 32.4166L34.9521 33.4583ZM13.0896 21.7916C16.0708 21.7916 18.5828 20.828 20.6255 18.901C22.6682 16.9739 23.6896 14.6041 23.6896 11.7916C23.6896 8.97908 22.6682 6.60929 20.6255 4.68221C18.5828 2.75513 16.0708 1.79159 13.0896 1.79159C10.1083 1.79159 7.59633 2.75513 5.55362 4.68221C3.51091 6.60929 2.48956 8.97908 2.48956 11.7916C2.48956 14.6041 3.51091 16.9739 5.55362 18.901C7.59633 20.828 10.1083 21.7916 13.0896 21.7916Z" fill="#031819" fill-opacity="0.39"></path>
										</svg>
									</button>
								</div>
							</form>
							<div class="most-popular-wrapper">
								<div class="most-popular-container">
									<!-- By other searches -->
									<p>Most popular:</p>
									<ul>
										<li><button data-code="M_Pears" data-uuid="9b43fecf-408d-4c99-8b5a-d6de3f0e27a3" data-choices="{" footprint_type":="" "product",="" "footprint_year":="" "2016",="" "footprint_location":="" "at"}"="">pears</button></li>
										<li><button data-code="M_Spinh" data-uuid="81961539-30ea-44e6-9b43-ca8573133d18" data-choices="{" footprint_type":="" "product",="" "footprint_year":="" "2016",="" "footprint_location":="" "at"}"="">spinach</button></li>
										<li><button data-code="M_Pines" data-uuid="dbcd7e97-b343-40b7-85db-8b5e51c00b99" data-choices="{" footprint_type":="" "product",="" "footprint_year":="" "2016",="" "footprint_location":="" "at"}"="">pineapples</button></li>
										<li><button data-code="M_Avocs" data-uuid="70345035-4c2b-4ced-916e-c8832e011802" data-choices="{" footprint_type":="" "product",="" "footprint_year":="" "2016",="" "footprint_location":="" "at"}"="">avocados</button></li>
									</ul>
								</div>
							</div>
							<div class="text-center" style="display: block;">
								<div class="is-divider divider clearfix" style="
									margin-top:50px;
									margin-bottom:50px;
									max-width:75%;
									height:1px;
									background-color: #E8EDED;
									">
								</div>
							</div>
							<div class="co2-form-result" style="display: block;">
								<div id="co2-form-result-header" class="col medium-12 small-12 large-12">
									<div class="row">
										<div class="col medium-6 small-12 large-6">
											<h3>Footprint</h3>
										</div>
										<div class="switch-field-wrapper-basic col medium-6 small-12 large-6">
											<div class="switch-field-container">
												<input type="radio" id="basic-choice" name="switch-two" value="basic">
												<label for="basic-choice">Basic</label>
												<input type="radio" id="advanced-choice" name="switch-two" value="advanced" checked="">
												<label for="advanced-choice">Advanced</label>
											</div>
										</div>
									</div>
									<div class="row">
										<div class="select-wrapper col medium-12 small-12 large-12">
											<div>
												<div class="tooltip tooltipstered">
													<a href="#info-location">
													Location
													</a>
													<div id="info-location" class="lightbox-by-id lightbox-content mfp-hide lightbox-white " style="max-width:600px ;padding:20px">
														<u class="has-block"><strong>Location:</strong></u>&nbsp;refers to the country or region, for which the footprint is presented. The world is divided into 43 countries and five ‘rest-of-world (RoW)’ regions.	
													</div>
												</div>
												<label class="select" for="location">
													<select id="location">
														<option value="AT">Austria</option>
														<option value="AU">Australia</option>
														<option value="BE">Belgium</option>
														<option value="BG">Bulgaria</option>
														<option value="BR">Brazil</option>
														<option value="CA">Canada</option>
														<option value="CH">Switzerland</option>
														<option value="CN">China</option>
														<option value="CY">Cyprus</option>
														<option value="CZ">Czech Republic</option>
														<option value="DE">Germany</option>
														<option value="DK">Denmark</option>
														<option value="EE">Estonia</option>
														<option value="ES">Spain</option>
														<option value="Europe">Europe, geographic</option>
														<option value="FI">Finland</option>
														<option value="FR">France</option>
														<option value="GB">United Kingdom</option>
														<option value="GR">Greece</option>
														<option value="Global">Global</option>
														<option value="HR">Croatia</option>
														<option value="HU">Hungary</option>
														<option value="ID">Indonesia</option>
														<option value="IE">Ireland</option>
														<option value="IN">India</option>
														<option value="IT">Italy</option>
														<option value="JP">Japan</option>
														<option value="KR">South Korea</option>
														<option value="LT">Lithuania</option>
														<option value="LU">Luxembourg</option>
														<option value="LV">Latvia</option>
														<option value="MT">Malta</option>
														<option value="MX">Mexico</option>
														<option value="NL">Netherlands</option>
														<option value="NO">Norway</option>
														<option value="PL">Poland</option>
														<option value="PT">Portugal</option>
														<option value="RO">Romania</option>
														<option value="RU">Russia</option>
														<option value="SE">Sweden</option>
														<option value="SI">Slovenia</option>
														<option value="SK">Slovakia</option>
														<option value="TR">Turkey</option>
														<option value="TW">Taiwan</option>
														<option value="US">United States</option>
														<option value="WA">RoW Asia and Pacific</option>
														<option value="WE">RoW Europe</option>
														<option value="WF">RoW Africa</option>
														<option value="WL">RoW America</option>
														<option value="WM">RoW Middle East</option>
														<option value="ZA">South Africa</option>
													</select>
													<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"></path>
													</svg>
												</label>
											</div>
											<div>
												<div class="tooltip tooltipstered">
													<a href="#info-year">
													Year
													</a>
													<div id="info-year" class="lightbox-by-id lightbox-content mfp-hide lightbox-white " style="max-width:600px ;padding:20px">
														<u class="has-block"><strong>Year:</strong></u>&nbsp;refers to the year of the data used to calculate the footprint. Currently, only data for 2016 are available.	
													</div>
												</div>
												<label class="select" for="year">
													<select id="year">
														<option value="2016">2016</option>
													</select>
													<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"></path>
													</svg>
												</label>
											</div>
											<div>
												<div class="tooltip tooltipstered">
													<a href="#info-climate-metric">
													Climate metric
													</a>
													<div id="info-climate-metric" class="lightbox-by-id lightbox-content mfp-hide lightbox-white " style="max-width:600px ;padding:20px">
														<u class="has-block"><strong>Climate metric:</strong></u>&nbsp;refers to how green house gas emissions are translated into an indicator to represent climate change impacts. Currently, only the IPCC global warming potential (GWP) (100 year time horizon) is available. The GWP are from IPCC (2013). Climate Change 2013: The Physical Science Basis.	
													</div>
												</div>
												<label class="select" for="climate-metric">
													<select id="climate-metric">
														<option value="gwp100">GWP100</option>
													</select>
													<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"></path>
													</svg>
												</label>
											</div>
										</div>
										<div id="share-wrapper">
											<div class="share-icon">
												<div>
													<p class="pb-0 mb-0">Share search</p>
												</div>
												<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M20 13V17.5C20 20.5577 16 20.5 12 20.5C8 20.5 4 20.5577 4 17.5V13M12 3L12 15M12 3L16 7M12 3L8 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
												</svg>
											</div>
										</div>
									</div>
									<div class="error-message text-left" style="display: none;">
										Selected footprint doesn't exist in the database. Try selecting a different product, location or footprint type.                
									</div>
								</div>
								<div class="row align-equal search-result basic" style="display: none;">
									<div class="col medium-6 small-12 large-6" data-set-0="149244" data-set-1="187694">
										<div class="col-inner">
											<p class="product-title" data-code="M_Cucus">Cucumbers and gherkins, market of</p>
											<div class="product-tag-wrapper">
												<span class="product-tag footprint-type" data-type="product">Cradle to gate</span>
												<span class="product-tag country" data-country="AT">Austria</span>
												<span class="product-tag year" data-year="2016">2016</span>
												<span class="product-tag climate-metrics" data-climate-metrics="gwp100">GWP100</span>
											</div>
											<div class="unit-select-wrapper">
												<label class="select" for="amount">
													<input type="number" id="amount" class="amount" value="1" max="999999" min="1">
													<!-- <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
														</svg> -->
												</label>
												<label class="select" for="unit">
													<select id="unit" class="unit">
														<option value="tonnes">kg</option>
														<option value="Meuro">EUR</option>
													</select>
													<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"></path>
													</svg>
												</label>
												<p>equal</p>
											</div>
											<p class="product-result">165.66</p>
											<p class="product-result-unit">kg CO2eq</p>
											<div class="tooltip-wrapper">
												<a href="#info-product">
												Read more about the result
												</a>
												<div id="info-product" class="lightbox-by-id lightbox-content mfp-hide lightbox-white " style="max-width:600px ;padding:20px">
													Read more about the result	
												</div>
											</div>
										</div>
									</div>
									<div class="col medium-6 small-12 large-6" data-set-0="148402" data-set-1="186852">
										<div class="col-inner">
											<p class="product-title" data-code="M_Cauli">Cauliflowers and broccoli, market of</p>
											<div class="product-tag-wrapper">
												<span class="product-tag footprint-type" data-type="product">Cradle to gate</span>
												<span class="product-tag country" data-country="DK">Denmark</span>
												<span class="product-tag year" data-year="2016">2016</span>
												<span class="product-tag climate-metrics" data-climate-metrics="gwp100">GWP100</span>
											</div>
											<div class="unit-select-wrapper">
												<label class="select" for="amount">
													<input type="number" id="amount" class="amount" value="1" max="999999" min="1">
													<!-- <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
														</svg> -->
												</label>
												<label class="select" for="unit">
													<select id="unit" class="unit">
														<option value="tonnes">kg</option>
														<option value="Meuro">EUR</option>
													</select>
													<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"></path>
													</svg>
												</label>
												<p>equal</p>
											</div>
											<p class="product-result">401.91</p>
											<p class="product-result-unit">kg CO2eq</p>
											<div class="tooltip-wrapper">
												<a href="#info-product">
												Read more about the result
												</a>
												<div id="info-product" class="lightbox-by-id lightbox-content mfp-hide lightbox-white " style="max-width:600px ;padding:20px">
													Read more about the result	
												</div>
											</div>
										</div>
										<span class="adt-close"></span>
									</div>
									<div class="col medium-6 small-12 large-6" style="display: none;">
										<a href="#" class="col-inner">
											<p class="primary-text add">+</p>
											<p>Add to comparison</p>
										</a>
									</div>
								</div>
								<div class="row align-equal search-result advanced" style="display: flex;">
									<div class="col medium-12 small-12 large-12" data-set-0="149244" data-set-1="187694">
										<div class="col-inner">
											<div class="calculation-wrapper">
												<div class="choices">
													<p class="product-title" data-code="M_Cucus">Cucumbers and gherkins, market of</p>
													<div class="product-tag-wrapper">
														<span class="product-tag footprint-type" data-type="product">Cradle to gate</span>
														<span class="product-tag country" data-country="AT">Austria</span>
														<span class="product-tag year" data-year="2016">2016</span>
														<span class="product-tag">GWP100</span>
													</div>
													<div class="unit-select-wrapper">
														<label class="select" for="amount">
															<input type="number" id="amount" class="amount" value="1" max="999999" min="1">
															<!-- <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
																</svg> -->
														</label>
														<label class="select" for="unit">
															<select id="unit" class="unit">
																<option value="tonnes">kg</option>
																<option value="Meuro">EUR</option>
															</select>
															<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"></path>
															</svg>
														</label>
														<p>equal</p>
													</div>
												</div>
												<div class="calculation-result">
													<p class="product-result">165.66</p>
													<p class="product-result-unit">kg CO2eq</p>
												</div>
											</div>
											<p class="big-font">Where do emissions for 1kg come from?</p>
											<table class="emissions-table">
												<thead>
													<tr>
														<th>Inputs</th>
														<!-- flow_input -->
														<th>Country</th>
														<!-- region_inflow -->
														<th>Input</th>
														<!-- value_inflow + unit_inflow -->
														<th>Emissions<span>[kg CO2eq]</span></th>
														<!-- value_emission + unit_emission -->
													</tr>
												</thead>
												<tbody>
													<tr>
														<td><a href="#" data-code="A_Cucus" data-uuid="05ac7fd9-9308-4bbd-bcc9-36b6cbfa13cc" data-country="DE">Cucumbers and gherkins</a></td>
														<td>DE</td>
														<td>61.39</td>
														<td>12.80</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cucus" data-uuid="33f2d23b-a0ff-4e3b-85c7-1a09d3fadc3f" data-country="IT">Cucumbers and gherkins</a></td>
														<td>IT</td>
														<td>38.98</td>
														<td>11.37</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cucus" data-uuid="5b4917a1-e071-4d89-9ecf-6850df7688d0" data-country="TR">Cucumbers and gherkins</a></td>
														<td>TR</td>
														<td>15.90</td>
														<td>4.26</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cucus" data-uuid="61763cd8-505f-432e-a602-28b6e1ba8407" data-country="AT">Cucumbers and gherkins</a></td>
														<td>AT</td>
														<td>641.62</td>
														<td>95.84</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cucus" data-uuid="7b2dea76-a0a8-42fd-a1d2-35f72af4ae54" data-country="FR">Cucumbers and gherkins</a></td>
														<td>FR</td>
														<td>3.86</td>
														<td>1.10</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cucus" data-uuid="7cf3a7b4-611f-4afb-bac6-7ea6814bd241" data-country="NL">Cucumbers and gherkins</a></td>
														<td>NL</td>
														<td>36.15</td>
														<td>11.10</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cucus" data-uuid="bcbc48bd-5238-4ccb-9b19-f3aea6b84a68" data-country="ES">Cucumbers and gherkins</a></td>
														<td>ES</td>
														<td>134.26</td>
														<td>15.21</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cucus" data-uuid="7e947140-2a27-4554-9397-3cc19ac185b7" data-country="WE">Cucumbers and gherkins</a></td>
														<td>WE</td>
														<td>43.10</td>
														<td>9.85</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cucus" data-uuid="e1becf25-104a-4c70-9614-175cac7abfc4" data-country="HU">Cucumbers and gherkins</a></td>
														<td>HU</td>
														<td>11.98</td>
														<td>1.71</td>
													</tr>
													<tr>
														<td><a href="#" data-code="other" data-uuid="c0851c23-da94-4297-8b81-8878b5812430" data-country="null">null</a></td>
														<td>null</td>
														<td>0.00</td>
														<td>2.41</td>
													</tr>
												</tbody>
											</table>
											<div class="result-buttons">
												<div class="go-back text-left show-for-small">
													<a href="#" class="button primary lowercase" style="border-radius:99px; font-size:10px;">
													<i class="icon-angle-left" aria-hidden="true"></i>
													<span>Go back</span>
													</a>
												</div>
												<div class="download text-right hide-for-small">
													<a href="#" class="button grey lowercase" style="border-radius:99px;">
													<span>Download</span>
													<i class="icon-dribbble" aria-hidden="true"></i>
													</a>
												</div>
											</div>
											<div class="tooltip-wrapper">
												<a href="#info-product">
												Read more about the result
												</a>
												<div id="info-product" class="lightbox-by-id lightbox-content mfp-hide lightbox-white " style="max-width:600px ;padding:20px">
													Read more about the result	
												</div>
											</div>
										</div>
									</div>
									<div class="col medium-12 small-12 large-12" data-set-0="148402" data-set-1="186852">
										<div class="col-inner">
											<div class="calculation-wrapper">
												<div class="choices">
													<p class="product-title" data-code="M_Cauli">Cauliflowers and broccoli, market of</p>
													<div class="product-tag-wrapper">
														<span class="product-tag footprint-type" data-type="product">Cradle to gate</span>
														<span class="product-tag country" data-country="DK">Denmark</span>
														<span class="product-tag year" data-year="2016">2016</span>
														<span class="product-tag">GWP100</span>
													</div>
													<div class="unit-select-wrapper">
														<label class="select" for="amount">
															<input type="number" id="amount" class="amount" value="1" max="999999" min="1">
															<!-- <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"/>
																</svg> -->
														</label>
														<label class="select" for="unit">
															<select id="unit" class="unit">
																<option value="tonnes">kg</option>
																<option value="Meuro">EUR</option>
															</select>
															<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M1.66174 5.67766L2.66705 4.67236L8.49982 10.5051L14.3326 4.67236L15.3379 5.67767L8.49982 12.5157L1.66174 5.67766Z" fill="#031819"></path>
															</svg>
														</label>
														<p>equal</p>
													</div>
												</div>
												<div class="calculation-result">
													<p class="product-result">401.91</p>
													<p class="product-result-unit">kg CO2eq</p>
												</div>
											</div>
											<p class="big-font">Where do emissions for 1kg come from?</p>
											<table class="emissions-table">
												<thead>
													<tr>
														<th>Inputs</th>
														<!-- flow_input -->
														<th>Country</th>
														<!-- region_inflow -->
														<th>Input</th>
														<!-- value_inflow + unit_inflow -->
														<th>Emissions<span>[kg CO2eq]</span></th>
														<!-- value_emission + unit_emission -->
													</tr>
												</thead>
												<tbody>
													<tr>
														<td><a href="#" data-code="A_Cauli" data-uuid="27f8548b-065c-4140-9898-256484f63273" data-country="PL">Cauliflowers and broccoli</a></td>
														<td>PL</td>
														<td>9.92</td>
														<td>2.94</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cauli" data-uuid="3a258f60-bd14-4665-8899-e705b76ea38f" data-country="GB">Cauliflowers and broccoli</a></td>
														<td>GB</td>
														<td>12.98</td>
														<td>8.12</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cauli" data-uuid="608b5b90-6d8b-494c-818e-cbe41ac84a40" data-country="SE">Cauliflowers and broccoli</a></td>
														<td>SE</td>
														<td>2.24</td>
														<td>1.46</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cauli" data-uuid="9bce15a1-2383-4672-a2ed-609fc54df7f7" data-country="FR">Cauliflowers and broccoli</a></td>
														<td>FR</td>
														<td>23.34</td>
														<td>9.63</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cauli" data-uuid="05e49607-bbcd-4806-bb14-da54c0f776f3" data-country="ES">Cauliflowers and broccoli</a></td>
														<td>ES</td>
														<td>372.48</td>
														<td>83.85</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cauli" data-uuid="b41ef4c3-081a-42d9-a444-d494bf40ed65" data-country="IT">Cauliflowers and broccoli</a></td>
														<td>IT</td>
														<td>222.78</td>
														<td>74.09</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cauli" data-uuid="dacdb795-3b57-45d1-943a-68d68cd0776a" data-country="NL">Cauliflowers and broccoli</a></td>
														<td>NL</td>
														<td>24.15</td>
														<td>16.04</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cauli" data-uuid="1f8058ec-fac3-46d1-92d5-85f533c673e0" data-country="DE">Cauliflowers and broccoli</a></td>
														<td>DE</td>
														<td>79.13</td>
														<td>24.71</td>
													</tr>
													<tr>
														<td><a href="#" data-code="A_Cauli" data-uuid="1b465643-86f8-4ec9-8da8-9560901c3cd3" data-country="DK">Cauliflowers and broccoli</a></td>
														<td>DK</td>
														<td>252.79</td>
														<td>180.99</td>
													</tr>
													<tr>
														<td><a href="#" data-code="other" data-uuid="fd1fc673-2133-48f8-8a3a-7b7d20339567" data-country="null">null</a></td>
														<td>null</td>
														<td>0.00</td>
														<td>0.08</td>
													</tr>
												</tbody>
											</table>
											<div class="result-buttons">
												<div class="go-back text-left show-for-small">
													<a href="#" class="button primary lowercase" style="border-radius:99px; font-size:10px;">
													<i class="icon-angle-left" aria-hidden="true"></i>
													<span>Go back</span>
													</a>
												</div>
												<div class="download text-right hide-for-small">
													<a href="#" class="button grey lowercase" style="border-radius:99px;">
													<span>Download</span>
													<i class="icon-dribbble" aria-hidden="true"></i>
													</a>
												</div>
											</div>
											<div class="tooltip-wrapper">
												<a href="#info-product">
												Read more about the result
												</a>
												<div id="info-product" class="lightbox-by-id lightbox-content mfp-hide lightbox-white " style="max-width:600px ;padding:20px">
													Read more about the result	
												</div>
											</div>
										</div>
										<span class="adt-close"></span>
									</div>
									<div class="col medium-12 small-12 large-12" style="display: none;">
										<a href="#" class="col-inner">
											<p class="primary-text add">+</p>
											<p>Add to comparison</p>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<style>
					#row-1608667878 > .col > .col-inner {
					padding: 70px 25px 70px 25px;
					background-color: rgb(255,255,255);
					border-radius: 50px;
					}
					@media (min-width:550px) {
					#row-1608667878 > .col > .col-inner {
					padding: 70px 70px 70px 70px;
					}
					}
				</style>
			</div>
		</div>
		<style>
			#section_1111236685 {
			padding-top: 0px;
			padding-bottom: 0px;
			}
		</style>
	</section>
	<section class="section" id="section_928067937">
		<div class="section-bg fill">
		</div>
		<div class="section-content relative">
			<div class="row row-collapse align-middle" id="row-535202887">
				<div id="col-1090906995" class="col medium-6 small-12 large-6">
					<div class="col-inner">
						<div class="img has-hover border-radius__50 x md-x lg-x y md-y lg-y" id="image_2111500449">
							<div class="img-inner image-cover dark" style="padding-top:75%;">
								<img decoding="async" width="611" height="453" src="https://aau.test/app/uploads/2025/01/Skaermbillede-2024-11-12-kl.-15.13.06-1.webp" class="attachment-original size-original" alt="" srcset="https://aau.test/app/uploads/2025/01/Skaermbillede-2024-11-12-kl.-15.13.06-1.webp 611w, https://aau.test/app/uploads/2025/01/Skaermbillede-2024-11-12-kl.-15.13.06-1-300x222.webp 300w" sizes="(max-width: 611px) 100vw, 611px">						
							</div>
							<style>
								#image_2111500449 {
								width: 100%;
								}
							</style>
						</div>
					</div>
					<style>
						#col-1090906995 > .col-inner {
						padding: 0px 40px 0px 40px;
						}
						@media (min-width:550px) {
						#col-1090906995 > .col-inner {
						padding: 0px 0px 0px 15px;
						}
						}
						@media (min-width:850px) {
						#col-1090906995 > .col-inner {
						padding: 0px 0px 0px 0px;
						}
						}
					</style>
				</div>
				<div id="col-824946717" class="col medium-6 small-12 large-6">
					<div class="col-inner text-left">
						<h3>Getting the data right</h3>
						<p>Sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitar sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercita</p>
						<a class="button primary lowercase mobile-right" style="border-radius:99px;padding:0px 30px 0px 30px;">
						<span>Read more</span>
						</a>
					</div>
					<style>
						#col-824946717 > .col-inner {
						padding: 0px 40px 0px 40px;
						margin: 15px 0px 0px 0px;
						}
						@media (min-width:550px) {
						#col-824946717 > .col-inner {
						padding: 0px 15px 0px 50px;
						margin: 0px 0px 0px 0px;
						}
						}
						@media (min-width:850px) {
						#col-824946717 > .col-inner {
						padding: 0px 0px 0px 50px;
						margin: 0px 0px 0px 0px;
						}
						}
					</style>
				</div>
			</div>
		</div>
		<style>
			#section_928067937 {
			padding-top: 60px;
			padding-bottom: 60px;
			}
			@media (min-width:550px) {
			#section_928067937 {
			padding-top: 145px;
			padding-bottom: 145px;
			}
			}
		</style>
	</section>
	<section class="section" id="section_909677838">
		<div class="section-bg fill">
		</div>
		<div class="section-content relative">
			<div class="row row-collapse align-middle" id="row-1526367965">
				<div id="col-288035494" class="col medium-6 small-12 large-6">
					<div class="col-inner">
						<h3>Getting the data right</h3>
						<p>Sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitar sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercita</p>
						<a class="button primary lowercase mobile-right" style="border-radius:99px;padding:0px 30px 0px 30px;">
						<span>Read more</span>
						</a>
					</div>
					<style>
						#col-288035494 > .col-inner {
						padding: 0px 40px 0px 40px;
						margin: 15px 0px 0px 0px;
						}
						@media (min-width:550px) {
						#col-288035494 > .col-inner {
						padding: 0px 50px 0px 15px;
						margin: 0px 0px 0px 0px;
						}
						}
						@media (min-width:850px) {
						#col-288035494 > .col-inner {
						padding: 0px 50px 0px 0px;
						margin: 0px 0px 0px 0px;
						}
						}
					</style>
				</div>
				<div id="col-1116742711" class="col medium-6 small-12 large-6 small-col-first">
					<div class="col-inner">
						<div class="img has-hover border-radius__50 x md-x lg-x y md-y lg-y" id="image_1990264146">
							<div class="img-inner image-cover dark" style="padding-top:75%;">
								<img decoding="async" width="593" height="443" src="https://aau.test/app/uploads/2025/01/GettyImages-2155749920-1.webp" class="attachment-original size-original" alt="" srcset="https://aau.test/app/uploads/2025/01/GettyImages-2155749920-1.webp 593w, https://aau.test/app/uploads/2025/01/GettyImages-2155749920-1-300x224.webp 300w" sizes="(max-width: 593px) 100vw, 593px">						
							</div>
							<style>
								#image_1990264146 {
								width: 100%;
								}
							</style>
						</div>
					</div>
					<style>
						#col-1116742711 > .col-inner {
						padding: 0px 40px 0px 40px;
						}
						@media (min-width:550px) {
						#col-1116742711 > .col-inner {
						padding: 0px 0px 0px 0px;
						}
						}
					</style>
				</div>
			</div>
			<div id="gap-2042677148" class="gap-element clearfix" style="display:block; height:auto;">
				<style>
					#gap-2042677148 {
					padding-top: 60px;
					}
					@media (min-width:550px) {
					#gap-2042677148 {
					padding-top: 160px;
					}
					}
				</style>
			</div>
		</div>
		<style>
			#section_909677838 {
			padding-top: 0px;
			padding-bottom: 0px;
			}
		</style>
	</section>
</div>
<?php
echo do_shortcode(ob_get_clean());

get_footer();