jQuery(document).ready(function(){
	jQuery("#get_records").click(function(){
		jQuery.get(
			'/get_dicts',
			function(response){
				jQuery.each(response, function(key, value){
					/*
					if (key == "beers_list"){
						var save_delete = "<td><button class='save_entry'>Save</button></td><td><button class='delete_entry'>Delete</button></td>";
						jQuery("#all_keys").append("<h2>"+key+"</h2>");
						var table = "<table id="+key+">";
						jQuery.each(value, function(key, value){
							table = table + "<tr><td><input type='text' value='" + key + "'></input></td>";
							jQuery.each(value, function(key, value){
								table = table + "<td>" + key + "</td><td><input type='text' value='" + value + "'></input></td>";
							});
							table=table+save_delete;
						});
						table = table + "</tr></table>";
						jQuery("#all_keys").append(table);
					}*/
					if (key.indexOf("_places_beers") != -1) {
						var save_delete = "<td><button class='save_entry'>Save</button></td><td><button class='delete_entry'>Delete</button></td>";
						jQuery("#all_keys").append("<h2>"+key+"</h2>");
						var table = "<table id="+key+">";
						jQuery.each(value, function(key, value){
							var key_place_beer = "<td><input type='text' value='" + key + "'></input></td>";
							table = table + "<tr>";
							jQuery.each(value, function(key, value){
								table = table + key_place_beer;										
								table = table + "<td><input type='text' value='" + key + "'></input></td>";
								jQuery.each(value, function(key, value){
									table = table + "<td>" + key + "</td><td><input type='text' value='" + value + "'></input></td>";
								});
								table = table + save_delete+ "</tr>";
							});
							table = table + "</tr>";
						});	
						table = table + "</tr></table>";						
						jQuery("#all_keys").append(table);

					} /*else if((key != "cities_list") && (key != "beers_list")) {
						var save_delete = "<td><button class='save_entry'>Save</button></td><td><button class='delete_entry'>Delete</button></td>";
						jQuery("#all_keys").append("<h2>"+key+"</h2>");
						var table = "<table id="+key+">";
						jQuery.each(value, function(key, value){
							table = table + "<tr><td><input type='text' value='" + key + "'></input></td>";
							jQuery.each(value, function(key, value){
								table = table + "<td>" + key + "</td><td><input type='text' value='" + value + "'></input></td>";
							});
						table = table+save_delete;
						});
						table = table + "</tr></table>";
						jQuery("#all_keys").append(table);								
					}*/
					
				});						
			}
			);
	});
	jQuery(document).on("click", ".save_entry", function(){
		
		var row_elements = "";
		var table_id = jQuery(this).closest('table').attr('id');
		//row_elements = row_elements + ";";
		row_elements = row_elements + table_id + ";";
		jQuery(this).closest('tr').find('td').each(function(){
			
			if (jQuery(this).find("input").val() == undefined){
				console.log("undefined");
			} else {
				//row_elements.push(jQuery(this).find("input").val());
				row_elements = row_elements + jQuery(this).find("input").val() + ";";
			}

		});
		//console.log(row_elements);
		jQuery(this).closest('tr').remove();
		jQuery.post(
			'/save_record',
			{
				data: row_elements
			},
			function(response){
				alert(response);
				}
			);
		jQuery.post(
			'/delete_record',
			{
				data: row_elements
			},
			function(response){
				alert(response);
				}
			);				
	});

	jQuery(document).on("click", ".delete_entry", function(){
		var row_elements = "";
		var table_id = jQuery(this).closest('table').attr('id');
		//row_elements = row_elements + ";";
		row_elements = row_elements + table_id + ";";
		jQuery(this).closest('tr').find('td').each(function(){
			
			if (jQuery(this).find("input").val() == undefined){
				console.log("undefined");
			} else {
				//row_elements.push(jQuery(this).find("input").val());
				row_elements = row_elements + jQuery(this).find("input").val() + ";";
			}

		});
		//console.log(row_elements);
		jQuery(this).closest('tr').remove();
		jQuery.post(
			'/delete_record',
			{
				data: row_elements
			},
			function(response){
				alert(response);
				}
			);
	});

	jQuery("#dropdown").change(function(){
		jQuery("#fields").remove();
		//alert(jQuery(this).val());
		var dropdown_option_selected = jQuery(this).val();
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		if (dropdown_option_selected == "city-name_places_beers") {
			jQuery("<table id='fields'></table>").insertAfter("#dropdown");
			jQuery("#fields").append("<tr><th>City name</th><th>Place-Beer pair</th><th>Beer type</th><th>Price</th><th>Datetime</th><th>Action</th></tr>");
			jQuery("#fields").append("<tr>\
										<td><input class='input_val' value='cluj-napoca_places_beers'></input></td>\
										<td><input class='input_val'></input></td>\
										<td><select class='input_val'>\
												<option>Select</option>\
												<option>bottle-330ml</option>\
												<option>bottle-355ml</option>\
												<option>bottle-400ml</option>\
												<option>bottle-450ml</option>\
												<option>bottle-500ml</option>\
												<option>bottle-660ml</option>\
												<option>draught-200ml</option>\
												<option>draught-250ml</option>\
												<option>draught-300ml</option>\
												<option>draught-400ml</option>\
												<option>draught-500ml</option>\
												<option>draught-1L</option>\
												<option>draught-2L</option>\
												<option>draught-2.5L</option>\
												<option>draught-2.7L</option>\
												<option>N/A</option>\
											</select></td>\
										<td><input class='input_val'></input></td>\
										<td><input class='input_val' value="+day+"-"+month+"-"+year+"_"+hour+":"+minute+":"+second+"></input></td>\
										<td><button id='add_manual_record_place_beer'>Save</button><button id='cancel'>Cancel</button></td>\
									</tr>");
			
		} 
		if (dropdown_option_selected == "city-name_places") {
			jQuery("<table id='fields'></table>").insertAfter("#dropdown");
			jQuery("#fields").append("<tr><th>City name</th><th>Place name</th><th>Searches</th><th>Datetime</th><th>Action</th></tr>");
			jQuery("#fields").append("<tr>\
										<td><input class='input_val' value='_places'></input></td>\
										<td><input class='input_val'></input></td>\
										<td><input class='input_val' value='0'></input></td>\
										<td><button id='add_manual_record_place'>Save</button><button id='cancel'>Cancel</button></td>\
									</tr>");
		} 				
		if (dropdown_option_selected == "beer") {
			jQuery("<table id='fields'></table>").insertAfter("#dropdown");
			jQuery("#fields").append("<tr><th>Beer name</th><th>Searches</th><th>Datetime</th><th>Action</th></tr>");
			jQuery("#fields").append("<tr>\
										<td><input class='input_val'></input></td>\
										<td><input class='input_val' value='0'></input></td>\
										<td><button id='add_manual_record_beer'>Submit</button><button id='cancel'>Cancel</button></td>\
									</tr>");
		} 					

	});
	//click cancel button in manual section
	jQuery(document).on("click", "#cancel", function(){
		jQuery(this).closest("table").remove();
	});

	jQuery(document).on("click", "#add_manual_record_place_beer", function(){

		var row_elements = "";
		jQuery(this).closest('tr').find('.input_val').each(function(){
			row_elements = row_elements + jQuery(this).val()+";";
		});
		jQuery("#fields").remove();
		console.log(row_elements);
		
		jQuery.post(
			'/save_record',
			{
				data: row_elements
			},
			function(response){
				alert(response);
				}
			);			
	});

	jQuery(document).on("click", "#add_manual_record_place", function(){
		
		var row_elements = "";
		jQuery(this).closest('tr').find('.input_val').each(function(){
			row_elements = row_elements + jQuery(this).val()+";";
		});
		jQuery("#fields").remove();
		
		jQuery.post(
			'/save_manual_place',
			{
				data: row_elements
			},
			function(response){
				alert(response);
				}
			);				
	});

	jQuery(document).on("click", "#add_manual_record_beer", function(){
		
		var row_elements = "";
		jQuery(this).closest('tr').find('.input_val').each(function(){
			row_elements = row_elements + jQuery(this).val()+";";
		});
		jQuery("#fields").remove();
		
		jQuery.post(
			'/save_manual_beer',
			{
				data: row_elements
			},
			function(response){
				alert(response);
				}
			);					
	});			
});