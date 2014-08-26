
function renderResults(results_template, selector, data) {
	jQuery(results_template).insertAfter(selector);
	jQuery("#results_list").append('<div class="list-group">');
	//the first option is to reset city/place/beer
	if (jQuery(selector).attr("id") == "select_city") {
		jQuery("#results_list .list-group").append('<a href="#" class="list-group-item">Select a city</a>');		
	}
	if (jQuery(selector).attr("id") == "select_place") {
		jQuery("#results_list .list-group").append('<a href="#" class="list-group-item">Select a place</a>');		
	}
	if (jQuery(selector).attr("id") == "select_beer") {
		jQuery("#results_list .list-group").append('<a href="#" class="list-group-item">Select a beer</a>');		
	}		
	//add the rest of the list
	jQuery.each(data, function(k, v){
		jQuery("#results_list .list-group").append('<a href="#" class="list-group-item">' + v + '</a>');
	});
	jQuery("#results_container").show();
}

jQuery(document).ready(function(){

	var results_template = "<div id='results_container' style='display: none;'>\
								<div style='margin: 2px;'><input type='search' class='search_field form-control' placeholder='search this list'></input></div>\
								<div class='results_list_container'><div id='results_list' style='margin: 2px;'></div></div>\
								<div style='margin: 2px;'><button id='close_list' class='btn btn-block btn-danger'>Close</button></div>\
							</div>";
	//verify if value is a numeric one
	function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

	jQuery("#select_city").click(function(){
		jQuery(".select").attr("disabled", "disabled");
		jQuery.get(
				'/cities',
				function(data){
					renderResults(results_template, jQuery('#select_city'), data);
				}
			);
	});

	jQuery("#select_beer").click(function(){
		jQuery(".select").attr("disabled", "disabled");
		var city_name = jQuery("#select_city").html();
		var place_name = jQuery("#select_place").html();
		//var search_criteria = jQuery("#select_city").html() + "_" + jQuery("#select_place").html();
		if (jQuery("#select_place").html() == "Select a place") {
			jQuery.get(
					'/beers',
					function(data){
						renderResults(results_template, jQuery('#select_beer'), data);
					}
				);
		} else {
			jQuery.get(
					'/beers_for_place',
					{
						c_name: city_name,
						p_name: place_name
					},
					function(data){
						renderResults(results_template, jQuery('#select_beer'), data);
					}
				);			
		}
	});

	jQuery("#select_place").click(function(){
		if (jQuery("#select_city").html() != "Select a city") {
			var c_name = jQuery("#select_city").html();
			jQuery(".select").attr("disabled", "disabled");
			jQuery.get(
					'/places',
					{
						data: c_name
					},
					function(response){
						if ( response == "[]" ){
							alert("No places available for the selected City :(");
							jQuery(".select").removeAttr("disabled");
						} else {
							renderResults(results_template, jQuery('#select_place'), response);
						}
					}

				);
		} else {
			alert("Please select a city first !");
			jQuery(".select").removeAttr("disabled");
		}

	});

	//general search
	jQuery("#submit_search").click(function(){
		jQuery("#submit_search").attr("disabled", "disabled");
		var city = jQuery("#select_city").html();
		var place = jQuery("#select_place").html();
		var beer = jQuery("#select_beer").html();
		var type = jQuery("input[name='optionsRadios']:checked").val();
		
		if (city == "Select a city") {
			alert("Please select a city first !");
		} else {
			if ((place == "Select a place") && (beer == "Select a beer")){
				alert("Please select a beer / place or both !");
			} else {
				jQuery.get(
					'/search',
					{
						c_name: city,
						p_name: place,
						b_name: beer,
						b_type: type
					},
					function(response){
						if (response == "{}"){
							alert("We're sorry, but there are no results that match your search :(");
							jQuery("#select_place").html("Select a place");
							jQuery("#select_beer").html("Select a beer");								
						} else {
							jQuery("#search_results").append("<div id='results_wrapper'></div>");
							if (place == "Select a place") {
								jQuery("#results_wrapper").append("<div><u>Results for: '"+beer+"'</u></div>");	
							} else if (beer == "Select a beer") {
								jQuery("#results_wrapper").append("<div><u>Results for: '"+place+"'</u></div>");
							} else {
								jQuery("#results_wrapper").append("<div><u>Results for: '"+place+"', '"+beer+"'</u></div>");
							}
							jQuery("#results_wrapper").append("<table class='table'></table");
							jQuery.each(response, function(k, v){
								jQuery("table.table").append("<tr><td colspan=3 class=title><b>" + k + "</b></td></tr>");

								jQuery.each(v, function(kk, vv){
									if (kk == "N/A"){
										jQuery("table.table").append("<tr><td>non alcoholic</td><td><!-- Price --></td><td class=price>"+vv.price+" <span>RON</span></td></tr>");
									} else {
										jQuery("table.table").append("<tr><td>"+kk+"</td><td><!-- Price --></td><td class=price>"+vv.price+" <span>RON</span></td></tr>");
									}
								});
							});
							jQuery("#select_city").hide();
							jQuery("#search_page").hide();
							jQuery("#search_results").show();
							jQuery("#switch_page").find('span.add-page').html("Back");
							jQuery("#switch_page").find('span.glyphicon').addClass('glyphicon-arrow-left');
							jQuery("#select_place").html("Select a place");
							jQuery("#select_beer").html("Select a beer");
						}
					}
					);
			}
		}
		jQuery("#submit_search").removeAttr("disabled");
	});

	jQuery("#add_place_beer").click(function(){
		var city = jQuery("#select_city").html();
		var place = jQuery("#enter_place").val();
		var beer = jQuery("#enter_beer").val();
		var beer_type = jQuery("#beer_type").val();
		var beer_price = jQuery("#enter_beer_price").val();

		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		var submit_date = day+"-"+month+"-"+year+"_"+hour+":"+minute+":"+second;

		var add_data = city+"_places_beers"+";"+place+"-"+beer+";"+beer_type+";"+beer_price+";"+submit_date+";";

		if ((city == "Select a city") || (place == "") || (beer == "") || (isNumber(beer_price) == false) || (beer_price == "") || (beer_type == "Select beer type")){
			alert("Please enter all information !");
		} else {
			jQuery.post(
				'/add',
				{
					data: add_data
				},
				function(response){
					alert(response);
					}
				);
		}
	})

	//new search
	jQuery(document).on("keyup", ".search_field", function(){
		var filter = jQuery(this).val(), count = 0;

		jQuery("#results_list .list-group").children().each(function(){
			if (jQuery(this).text().search(new RegExp(filter, "i")) < 0){
				jQuery(this).hide();
			} else {
				jQuery(this).show();
			}
		});

	});

	//when selecting element from city/place/beer list put name on button
	jQuery(document).on("click", ".list-group a", function(){
		var value = jQuery(this).html();
		jQuery("results_container").hide();
		jQuery(".select").removeAttr('disabled');
		jQuery("#results_container").prev().html(value);
		//reset place name when city changes
		if (jQuery("#results_container").prev().attr("id") == "select_city"){
			jQuery("#select_place").html("Select a place");
		}
		jQuery("#results_container").remove();
	});

	jQuery(document).on("click" , "#close_list", function(){
		jQuery("#results_container").remove();
		jQuery(".select").removeAttr("disabled");
	});

	jQuery("#switch_page").click(function(){
		if (jQuery("#search_page").is(':visible')) {
			jQuery("#search_page").hide();
			jQuery(this).find('span.add-page').html("Back");
			jQuery(this).find('span.glyphicon').addClass('glyphicon-arrow-left');
			jQuery("#add_page").show();
		} else if (jQuery("#add_page").is(':visible')){
			jQuery("#add_page").hide();
			jQuery(this).find('span.add-page').html("Add page");
			jQuery(this).find('span.glyphicon').removeClass('glyphicon-arrow-left');
			jQuery("#search_page").show();
		} else {
			jQuery("#results_wrapper").remove();
			jQuery("#search_results").hide();
			jQuery(this).find('span.add-page').html("Add page");
			jQuery(this).find('span.glyphicon').removeClass('glyphicon-arrow-left');
			jQuery("#search_page").show();
			jQuery("#select_city").show();
		}
	});

	if (document.cookie.indexOf("ever_visited") >= 0){
		jQuery("#main_page").show();
	} else {
		jQuery("#first_welcome").show("slow");
	}

	jQuery("#close_welcome").click(function() {
		document.cookie = "ever_visited=yes;"

		jQuery("#first_welcome").hide();
		jQuery("#main_page").show();
	});
});