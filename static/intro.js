jQuery(document).ready(function(){

	if (jQuery.cookie("lang")){
		var lang_cookie = jQuery.cookie("lang");
		var new_url = "/"+lang_cookie;
		location.href = new_url;
	}

	jQuery(".lang").click(function() {
		var new_url = '/'+jQuery(this).attr("id");
		jQuery.cookie("lang", jQuery(this).attr("id"));
	});

});