/* Quizilla.com Global Javascript Functions */

//start the jQuery functions
$(document).ready(function() {

	// remove 'username'/'password' overtext if the browser has already
	// saved and inserted a value in to the field.
	if ($('#login_username').val()) {
		$('#login_username').removeClass('logu'); 
		$('#login_password').removeClass('logp');
	}
	
	/*clear input field text. applied to the header search input - add as needed*/
	$("#search, #title_createit, #username, #pass").inputClear();

	/*add class to drop downs for IE <6*/
	if(document.all){
	    $("#nav>li").hover(
	            function() {
					$(this).addClass("over");
				},
	            function() {
					$(this).removeClass("over");
				}
	    );
	}// if document.all

	// for buttons, we will wrap the span around the outside.  buttons do not take the wrapping in certain contexts
	$("button:not(.continue):not(.gobutton):not(.entry-content button), a.button:not(.createthemebutton)").wrap("<span class='buttonwrap'></span>");
	$("button.continue, button.morebutton").wrap("<span class='morebutton'></span>").filter("button.back").parent().addClass("back");
	$(".button.addimage").parent().addClass("addimage");
	$("#deletechecked").parent().css({ float: "right" });

	// .continue class is floated and may be followed by another element.  IE6 doesn't
	// support sibling selectors, so using jQuery to take care of that.
	if (typeof document.body.style.maxHeight == 'undefined')  {// testing document.all still captures IE7.  this test does not.
		$(".continue + *").css("clear", "left");
	}

	//tabs - enter a number in tabs(here) to make a tab other than the first display by default.
	//full docs can be found at: http://www.stilbuero.de/jquery/tabs/
	$(".tabbedlisting, .tabwrap, #creator, #themepreview ").not("#edit_profile .tabwrap").tabs({
		onHide: function(a) {
			if (a.href.indexOf("#deleteaccount")>-1) {
				$("#edit_profile>.buttonwrap").hide();
			} else {
				$("#edit_profile>.buttonwrap").show();
			}
		}									 
	});
	$(".hubtabs").tabs(3);/* setting the third tab ('newest) to display first  */

	//activate password box on 'sharing' squidget
	$("#sharewithpasswordonly").css({display: "none"});
	$("#canview").change(function() {
			if(this.value == 1) { /* CHANGED FROM 0 TO 1 */
				$("#sharewithpasswordonly").css({display: "block"});
				$("#contentpassword").attr("autocomplete","off");
			} else {
				$("#sharewithpasswordonly").css({display: "none"});
			}
	});

	//load suggested tags
	$(".tagadd a").click(function () {
		var recommendedtag = $(this).html();//the clicked tag
		
		var currenttags = $(this).parent().parent().parent().find("#tagittags,#categories").val(); //the current tags in case they've been added
		var delimiter = $(this).parents(".editcategories").length>0 && currenttags!="" ? "," : currenttags=="" ? "" : " ";
		$(this).parent().parent().parent().find("#tagittags,#categories").val(currenttags + delimiter + recommendedtag).html(currenttags + delimiter + recommendedtag) //mash em up
		
		return false;
	});

	// populate creator tabs as content is entered.
	// uses js since we aren't doing posts. could ajax later as saving to server. this is demo code only
	if($('.creator').length>0) {
		$('.creator #title').blur( function() {	if($('.creator #title').val() != "" ) { $('.quiztitle').html( this.value ); $('#preview legend.accessibility').html( this.value ); } });
		$('.creator #memo').blur( function() { if($('.creator #memo').val() != "" ) { $('.quizmemo').html( this.value ); } });
	}


	//make the rating stars (transforms a regular form into something pretty)
	$('form.rating,div.rating').rating();

	$(".comment:odd").addClass("alternaterow");


	// MyStuff tables - pulls meta info out of ul in title_cell and adds it as a seperate, collapsed row below current.  also turns on toggling (to reveal item meta) on title_cell.  Formats meta row appropriately based on type of sort that has been done on the page; assumes that the .stuff container will have the appropriate (.category or .type) class appended.

	if ($(".stuff").length>0){
   		//var sortstate = $('.stuff').attr('class').match(/bycategory/) ? 'category' : 'type';

		/* wrap the meta info in a new row and move it to an appropriate place in the table.
		$('td.title_cell ul').toggleClass('closed').wrap("<tr class='meta'><td class='stuffmeta' colspan='4'></td></tr>").parent().parent().each(function() {
			if (sortstate == 'category') $(this).prepend('<td></td>');
			if ($(this).parent().attr('class').match(/alternaterow/)) {
			$(this).children('td').addClass('alternaterow'); 
		}
		$(this).parent().parent().after($(this));
		});*/
	
		/* attach the meta display toggle to the click event of the title cell.*/
		$('td.title_cell').click( function() {
			$(this).toggleClass('open');
			var collapser = $(this).parent().next('tr');
			collapser.toggle();
		});

	}; //if (stuff)

	// un/check messages
	$(".checkall").click(function(){
		$(".mymessages input:checkbox").attr({ checked:"checked" });
		return false;
	});
	$(".uncheckall").click(function(){
		$(".mymessages input:checkbox").removeAttr("checked");		
		return false;
	});
	$("#selectallmessages").click(function() {
	
		if($(this).is(":checked")) {
			$(".mymessages input:checkbox").attr({ checked:"checked" });
		} else {
			$(".mymessages input:checkbox").removeAttr("checked");	
		}
	});

	//tagcloud switcher
	if($(".tagcloud").length>0) {

		//saved for later
		$(".taglist").each(function(t){	
			$(this).attr({"rel":"tags-"+t});
			QUIZ.taglist.push($(this).html()); 
			QUIZ.taglistgraph.push("");
		});

		// safari doesn't let the selected state change after the fact, so flag each and add in dom
		var selected = {
			size: "",
			color: "",
			graph: ""		
		};
		if(getCookie("tagtype")) {
			var cookietype = getCookie("tagtype");

			switch (cookietype) {
				case "size":
					selected.size = ' selected="selected"';
					break;
				case "graph":
					selected.graph = ' selected="selected"';
					break;	
				default:
					selected.color = ' selected="selected"';
					break;				
			}
		}	
		
		
		$("body:not(.tagspage) .taglist").before('<label class="tagview">View: <select><option value="size"'+selected.size+'>By Size</option><option value="color"'+selected.color+'>By Color</option><option value="graph"'+selected.graph+'>As Graph</option></select></label>');
		
		$("select").change(function(){ showTags($(this).val(),"",$(this).parent().parent()); });

		if(getCookie("tagtype")) {

			if(cookietype=="size" || cookietype=="graph") {
				$("#tagsby"+cookietype).parent().addClass("selected");
				showTags(cookietype);
				$("option[@value="+cookietype+"]").attr("selected","selected");
			} else {
				$("#tagsbycolor").parent().addClass("selected");
				showTags("color",cookietype);
				$("option[@value=color]").attr("selected","selected");
			}
		}
	} //tagcloud

	//tagtype switch on hub
	$(".toptagsbytype ol:not(#tags-quizzes)").hide();
	$("#tagtypeselect").change(function(){
		var val = $(this).val().toLowerCase();
		$(".toptagsbytype ol.taglist").hide();
		$("#tags-"+val).show();
	});
	// hub switch
	$("#globaltagstyle li a").click(function(){
		
		$("#globaltagstyle li").removeClass("selected");
		$(this).parent().toggleClass("selected");
		showTags($(this).attr("rel"));
		$(this).blur();
		return false;
	
	});
	

	//hide stuff turned on via thickbox
	$("div.helpcontainer").hide();

	/* toggles for register page document agreements */
	$("#usagepolicy, #contentpolicy").hide();

	$("label[@for=usagepolicyagree] a").click(function(){
		$("#usagepolicy").slideToggle(50); 	return false });

	$("label[@for=contentpolicyagree] a").click(function(){
		$("#contentpolicy").slideToggle(50); return false});

	$("label[@for=postingrulesagree] a").click(function(){
		$("#postingrules").slideToggle(50); return false;
	});


	/* DISPLAY COMMENTS IF SINGLE JOURNAL ENTRY 
	if($(".journalpage").length == 0) {
		$("#comments").hide();
	}*/
	$(".commentinvite a").click(function(){

		var hash = $(this).attr('href');
		
		if(hash == "#commentinputlabel") {
			if($("#comments").css("display")!="block") { $("#comments").toggle(); } 
			$("#commentinput").focus();
		} else {
		$("#comments").toggle();
		}
		
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
		      var $target = $(this.hash);
		      $target = $target.length && $target
		      || $('[name=' + this.hash.slice(1) +']');
		      if ($target.length) {
		        var targetOffset = $target.offset().top;
		        $('html,body').animate({scrollTop: targetOffset}, 150);
		       return false;
		      }
		    }
			/*
			plugin:
				get the current a's $target, hide it
				speed is a passable param
				$("a.toggler").targetScroll();
				$("a.toggler").targetScroll(250);
			*/
	});


	$(".shareitbutton + #shareit").hide()
	$("#shareittoggler").click(function(){
		$("#shareit").toggle();
		$(this).toggleClass("open").blur();		

		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
		    && location.hostname == this.hostname) {
		      var $target = $(this.hash);
		      $target = $target.length && $target
		      || $('[name=' + this.hash.slice(1) +']');
		      if ($target.length) {
		        var targetOffset = $target.offset().top;
		        $('html,body').animate({scrollTop: targetOffset}, 150);
		       return false;
		      }
		    }
	});

	//hide the textarea gigya gets its code from.
	$("#htmlsharecode, label[for=htmlsharecode]").hide();

	// hide/show email form
	$("#shareit #composemessage").hide();
	$(".shareemail a,#shareit .sendbuttons a.button").click(function(){
		
		var $this = $(this);
		/* reset gigya height to make slide below content */
		$("#shareit #composemessage").slideToggle("normal",function(){ 
			if($this.parents(".modalwrap").length>0) {
				$(".shareitwrapper").slideToggle("normal");
			} else { $(".gigya").toggleClass("plusone"); }
		});
		
		return false;
	});
	$("#shareit #composemessage").submit(function(){
											 
		$.post($(this).attr("action"),$(this).formSerialize(),function(){
		
			// USER CLICKS SEND, MESSAGE CHANGES, MOUSE TURNS TO DISPLAY 'NO LINK'
			$("#shareit #composemessage button").html('Message Sent!').css('cursor','default');
			
			// BYPASS SUBMISSION IF USER HAS SENT ALREADY
			$("#shareit #composemessage button").click(function() {
				if ( $("#shareit #composemessage button").html() == "Message Sent!") {return false;}
			});
			
			s = setTimeout('$("#shareit #composemessage").slideToggle("normal",function(){ $(".gigya").toggleClass("plusone"); $("#shareit #composemessage").find("button").html("Send").css("cursor","pointer"); $("#shareit #composemessage").resetForm(); });$("#shareit #composemessage button").click(function() {return true;});',2000)

		});
		return false;
											 
	});
	
	/* toggles for login form - forgot password and temporary 'sent'
		hides the second two divs and swaps them in and out.

		this is for display only. can be separated into ajax calls once hooked into the backend instead
		of having all elements inline on the page and hidden.

	*/
	$("#forgotpassword, #passwordsent").hide();
	var forgotpassword = $("#forgotpassword");

	$(".forgotpassword").click(function () {
		$("#loginformwrap").insertAfter("#forgotpassword");
		$("#forgotpassword, #loginformwrap").toggle();
		return false;
	});

	$("#forgotpassword button#gogogo").click(function () {
		$("#forgotpassword").insertAfter("#passwordsent");
		$("#forgotpassword, #passwordsent").toggle();
	});

	$("#passwordsent .loginlink").click(function () {
		$("#passwordsent").insertAfter("#loginformwrap");
		$("#loginformwrap, #passwordsent").toggle();
		return false;
	});
	
	/* NEW CANCEL BUTTON FOR FORGOT PASSWORD */
	$(".cancelbutton").click(function() {
		$("#forgotpassword, #loginformwrap").toggle();
		return false;
	});
	
/* behind the menu dropdowns we must put an iframe to save IE6 from the evil select dropdowns*/
/* because of the lag in menu operation that this fix introduces, it will only fire if there are selects
close enough to the top to neccessitate it.  because of this, it must be initalized after all other document.ready
functions have been completed, as these changes may move selects around on the page. */
if (typeof document.body.style.maxHeight == 'undefined')  {// true for IE6 ONLY.
	var selectflag = false;
	$('select').each(function(){ if ($(this).topPos() < 450) selectflag = true });
	if (selectflag) {
		$('#nav > li').hover(function() { 
			if ($(this).attr("id") != "games-menu") { // SINCE GAMES HAS NO CHILDREN, FIXING IE ERROR
				$(this).children('ul:first').before('<iframe class="selectfix" src="javascript:\'\'"></iframe>');
				$('.selectfix').height($(this).children('ul').height()+5);
			}
		},
		function(){
			$('.selectfix').remove();
		});// end $().hover()
	} //end if(selectflag)
}

/* folding lists - faqs, mystuff, myimages...*/
if ($('.squeezebox dl').length > 0){
	$('.squeezebox dt').click(function(){
		$(this).next("dd").toggle();
		$(this).toggleClass("selected");
	});
	$(".expandall").toggle(
		function() {
			$('.squeezebox dl dd').css("display","block"); // no more slidey slidey
			$('.squeezebox dl dt').addClass("selected");
			$(this).html("Collapse All")
			return false;
		},
		function(){
        	$('.squeezebox dl dd').css("display","none"); // no more slidey slidey
			$('.squeezebox dl dt').removeClass("selected");
			$(this).html("Expand All")
			return false;
		}
	);

		/* lightbox for delete cat */
	
	
	$(".remove_cat").click(function() {
		deleteThisCat = $(this).parent();
		$("#del_cat_msg").html("Are you sure you want to delete the category " + deleteThisCat.attr("title") + " ?");
		currentCat = deleteThisCat.attr("id");
	});
		
	$("#delete_cat").jqm({trigger: '.remove_cat', toTop: true}).hide();
	
	$("#del_cat").click(function() {	
			$.post("index.php",{'id':currentCat});
			deleteThisCat.next().remove();
			deleteThisCat.css("display","none");// no more slidey slidey
			if($(".jqmOverlay").length>0) { $(".jqmWindow").jqmHide(); }
		}
	);
	
	/* GLOBAL REMOVE FOR SQUEEZBOX ? */
	$('.squeezebox dt a').click(function(event) { 

		event.stopPropagation();
		$(this).parent().next().remove();

		// IF MYSTUFF, DON'T AUTOKILL CATEGORY
		if($(".mystuff").length<0) { $(this).parent().css("display","none"); }// no more slidey slidey
		
		/* this will hide the element.  link will still fire unless next line is uncommented.  if Ajax callback is needed, it can be added here; 
		change previous line to $(this).parent().slideUp('fast', function(){ ... your code here ... }); */
		// return false; 
	});
};


   	//$('.jqmWindow').jqm().hide();
	/* can be custom triggers/dialog class.  pagehelptrigger/pagehelp
	$('.pagehelp').jqm({
		trigger: '.pagehelptrigger',
    	overlay: 30,
		ajax: '@href', // Extract ajax URL from the 'href' attribute of triggering element
    	overlayClass: 'whiteOverlay'});*/
	$(".jqmWindow").prepend("<div class='jqmHeader'><a href='#' class='jqmClose'>Close</a> or ESC Key</div>").hide().wrapInner("<div class='modalwrap'></div>");

/*
	//listen for the escape key to hide the box
	 $(document).keydown( function( e ) {
	   if( e.which == 27) {  // escape, close box
	     $(".jqmWindow").jqmHide();
	   }
	 });
*/


	if ($('.myimages dl').length > 0){
		
		//hide delete confirm message
		$("#removeimage fieldset:eq(1), #removeimage fieldset:eq(2)").hide();
		
		$("#addimage").jqm({trigger: 'a.add', toTop: true}).hide();
		$("#editimage").jqm({trigger: '.myimages dd li a:not(.removeimage)', toTop: true}).hide();
		$(".myimages dd li a:not(.removeimage)").click(function() {
			$("#imageid").val($(this).children("img").attr("title")); 
			$("#editimage img").attr("src",$(this).children("img").attr("src"));
		});
		$("#removeimage").jqm({
			trigger: '.myimages dd li a.removeimage',
			toTop: true
       		}).hide();
		$(".removeimage").click(function() {
			$("#removeimgid").val($(this).attr("title"));
			removethisimg = $("#removeimgid").val();
		});
		//ajax to tell server image is deleted
		hasdel=0;
		$("#removeimage button[@type=submit]").click(function(){
			if(!hasdel) {
				$.ajax({
					type: "POST",
					url: $("#deleteimageform").attr("action"),
					data: "image="+removethisimg,
					success: function(msg) {
						$("#removeimage fieldset:eq(0), #removeimage fieldset:eq(2)").hide();
						$("#removeimage fieldset:eq(1)").show();
					},
					error: function(msg) {
						$("#removeimage fieldset:eq(0), #removeimage fieldset:eq(1)").hide();
						$("#removeimage fieldset:eq(2)").show();
					}				
				});
				hasdel=1;
			}
			return false;		
		});
		
		//Delete category. Modal submits a form
			$('.confirm-category-delete').jqm({trigger: '.myimages dt a', toTop: true, top: "100px", width: "500px" }).hide();	
			$(".myimages dt a").click(function(){
				var name = $(this).parent().html().split("(");
				$("#deletecategory").html($.trim(name[0]));	
				$("#categoryid").val($("#deletecategory").html());		
			});
	};




	//original method of loading games via ajax into a lightbox.  removed by QZ team.
	//$('#gamecontainer').jqm({ajax: '@href', trigger: '.gameslisting a', toTop: true}).hide();
	//The actual backend functions need to be added to these
	$('#blockthisuser').click(function() {
		if($('#blockthisuser').html() == "block user") {
			
			$('.confirm-block').jqm().jqmShow();
		} else {
			newMsg = "block user";
			$.ajax({
				type: "POST",
				url: "index.php?a=communication&app=user&task=removeblock&protocol=json&view=friends&profile_username="+curUsr,
				data: "name="+curUsr,
					success:function(msg) {
						if (msg != "ok" ) {
							$("#gen_msg").html(msg);
							$(".generic-message").jqm().jqmShow();
							newMsg = "unblock user"; // fails for some reason
						}
						
					},
					error:function() {
						$("#gen_msg").html("oh noes! couldn't remove friend!");
						$(".generic-message").jqm().jqmShow();
						newMsg = "unblock user"; // fails for some reason
					}
				});
				$('#blockthisuser').html(newMsg);
			}
		
		return false;
	});
	
	//The actual backend functions need to be added to these.
	$('.confirm-delete').jqm({trigger: 'a.deletemessage', toTop: true, width: "500px" }).hide();	
	
	/* 	$(".listtable").each(function(){
		 $(this).find("tr:odd td").addClass("alternaterow");
	});*/
	//Delete content item. Modal submits a form
	$('.confirm-content-delete').jqm({trigger: 'a.deletecontent', toTop: true, width: "500px" }).hide();	
	$("a.deletecontent").click(function(){
		$("#itemid").val($(this).parents("tr").find(".title_cell a").attr("title"));
		getType = $(this).parents("tr").find(".title_cell a").attr("href").split('/');
		$("#typename").val(getType[getType.length-3]);
		$("#deletename").html($(this).parents("tr").find(".title_cell a").html());	
	});	

	//Delete category. Modal submits a form
	$('.confirm-category-delete').jqm({trigger: '.stuff dt a', toTop: true, top: "100px", width: "500px" }).hide();	
	$(".stuff dt a").click(function(){
		var name = $(this).parent().html().split("(");
		$("#deletecategory").html($.trim(name[0]));	
		$("#categoryid").val($("#deletecategory").html());		
	});

	//Edit categories. Modal submits a form
	$('.category-select').jqm({trigger: 'a.categoryselect', toTop: true, width: "500px" }).hide();	
	$("a.categoryselect").click(function(){		
		$("#categoryname").html($(this).parents("tr").find(".title_cell a").html());
		var val = typeof($(this).attr("rel")) != "undefined" ? $(this).attr("rel") : "";
		$("#categories").val(val);
		$("#contentid").val($(this).parents("tr").find(".title_cell a").attr("title"));
	});	
	

	//The actual backend functions need to be added to these.
 	function share_writer(info,link){
		
		info=info.split(',');
	
		// OS X FF has trouble with flash on opacity
		function detectMacXFF() {
			var userAgent = navigator.userAgent.toLowerCase();
			if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1) {
				return true;
			}
		}
		if (detectMacXFF()) { $(".jqmOverlay").css({ opacity:"1", background: "transparent url(" + qzPath + "/templates/QZ2/images/dev/modal_bg.png) repeat" }); }
		
		$("p.sharelink").text(document.location.protocol+'//'+document.location.host+link);
		
		// append content url to yahoo messenger href
		document.getElementById("ymsgrlink").href=document.getElementById("ymsgrlink").href + document.location.protocol+'//'+document.location.host+link;
		
		// append content url to AIM messenger href
		document.getElementById("aimlink").href=document.getElementById("aimlink").href + document.location.protocol+'//'+document.location.host+link;

		qtype=info[0];
		qid=info[1];
		qtitle=info[2];
		
		// set item id, item type, url and title hidden vars in shareit form block
		document.getElementById("item_id").value=qid;
		document.getElementById("title").value=qtitle;
		document.getElementById("item_type").value=qtype;
		document.getElementById("url").value=document.location.protocol+'//'+document.location.host+link;
		
		embedwrite = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="https://web.archive.org/web/20100105001639/http://macromedia.com/cabs/swflash.cab#version=6,0,0,0" width="250" height="250">';
		embedwrite += '<param name="movie" value="https://web.archive.org/web/20100105001639/http://www.quizilla.teennick.com/templates/QZ2/media/swf/quidget.swf?q_id='+qid+'&q_type='+qtype+'" />';
		embedwrite += '<param name="name" value="Quidget" />';
		embedwrite += '<param name="id" value="Quidget" />';
		embedwrite += '<param name="quality" value="high" />';
		embedwrite += '<embed src="https://web.archive.org/web/20100105001639/http://www.quizilla.teennick.com/templates/QZ2/media/swf/quidget.swf?q_id='+qid+'&q_type='+qtype+'">" quality="high" width="250" height="250" name="Quidget" id="Quidget" type="application/x-shockwave-flash" pluginspace="https://web.archive.org/web/20100105001639/http://www.macromedia.com/go/getflashplayer">';
		embedwrite += '</object>';
		
		$("#htmlsharecode").text(embedwrite);
		
		var pconf= {
			UIConfig: '<config><display showCloseButton="false" networksToHide="" networksWithCodeBox="" networksToShow="myspace, hi5, facebook, tagged, blogger, freewebs, livejournal, typepad, bebo, livespaces, wordpress" /><body><controls><snbuttons iconsOnly="false" /></controls></body></config>',
			 defaultContent: 'htmlsharecode',
			 showEmailAfterPost: 'false'
			};
		
		Wildfire.initPost('13481', 'divWildfirePost', 570, 200, pconf);
	}
	
	var close = function(hash){ hash.w.hide(); hash.o.remove(); if(document.all){$("#createtype").show()}};
	$('.share-content').jqm({trigger: 'a.sharecontent', toTop: true, width: "650px" }).hide();	
	$('.sharecontent').click(function(){
		share_writer( $(this).attr("title"), $(this).parents("tr").find(".title_cell a").attr("href") );
	});

	
	// autocomplete for typing name on compose message
	if($("#composemessage #messageto").length>0){
		$("#composemessage #messageto").autocompleteArray(getFriends());
	}
	// message recipient box, compose message page
	// MODIFIED TO ACCEPT ONLY ONE USER FROM FRIEND LIGHTBOX
	$('#selectrecipient').click(function(){
		$("#messageto").val("");
		$("#messagerecipientselect .friendslist a").removeClass("selected");
	});
	$('#messagerecipientselect').jqm({trigger: '#selectrecipient', toTop: true	}).hide();
	$('#messagerecipientselect li a').click(function(){
		$("#messagerecipientselect .friendslist a").removeClass("selected");
		$(this).blur().toggleClass("selected");
		return false;
	});

	// use hash to prevent modul on backbutton
	if($('#confirmsent').length>0 && location.hash == "#confirm") {
		$('#confirmsent').jqm({	onHide: function(hash) { hash.w.remove(); hash.o.remove(); location.hash = "#"; } }).jqmShow();
	}

	$('#toselection').click(function() {
		var selected = $("#messagerecipientselect a.selected img").attr('alt');
		$("#messageto").val(selected);
		$('#messagerecipientselect').jqmHide();
		return false;
	});
	
	$("#favoritesconfirmation").jqm({trigger: '.addtomyfavorites', toTop: true}).hide();
	$(".favoritelisting a.remove").click(function(){
		var url = $(this).attr('title');
		var content = url.split(',');
		
		var c_type = content[0];
		var c_id = content[1];
		
		$.get('index.php?a=communication&app='+c_type+'&task=removefromfavorites&protocol=json&id='+c_id);
		
		var $table = $(this).parents("table");
		$(this).parents("tr").remove();
		$table.find("td").removeClass("alternaterow");
		$table.find("tr:odd td").addClass("alternaterow");
	});
	
	$('#invitefriendformwrap').jqm({trigger: '.invitefriend .gobutton', toTop: true});
	// form validation for invite friend & submission behavior handled in forms.validation.js
	
	// wires up the 'delete account' confirmation lightbox on edit profile.  callback to delete account should probably put on the 'ok' button on that dialoge, which can be found on the edit profile page immediately below the "Delete This Account" button.
	$("#deleteaccountconfirm").jqm({trigger:"#deleteaccountbutton", toTop: true});

	var checkcom = function(hash) {
		if(hash.t.href.match(/#c/)) {
			commentid = hash.t.href.split("#");
			c_id = commentid[1].substring(1,commentid[1].length);
			$("#com_id").val(c_id);
			actionstring = $("#reportitform").attr("action");
			$("#reportitform").attr( "action", actionstring+"&comment_id="+c_id); 
		}
		hash.w.show();
	};

	$("#reportitcontainer").jqm({trigger: '.reportit', toTop: true, onShow:checkcom}).hide();

	$("#reportitconfirmation").hide();
	$("#resetreport").click(function() {
		$('#reportitcontainer').jqmHide();
		$("#reportitform, #reportitconfirmation").toggle();
		$("#report_comments").val("");
	});
	$("#reportit form").submit(function() {
	
		// DO NOT EDIT BELOW VALUE NAMES (reason, comments)
		$.post(this.action,{'reason':this.why_reported.value, 'comments':this.commentfield.value});  

		$("#reportitconfirmation, #reportitform").toggle();
		
		return false;
	});
	
	$("#reportit button .formsubmit").click(function(){ 
		return false;
	});
	
	$(".fullhoroscopewindow").jqm({trigger:'a.fullhoroscope,a.openfullhoroscope', toTop: true});
	var horosign = $(".openfullhoroscope").html();
	
	/* HOROSCOPE EXTERNAL LOADER WHEN REQUESTED */
	var hashoroscope = false;
	$("a.fullhoroscope,.openfullhoroscope").click(function(){
		if (!hashoroscope) {
			$("#horoscopelist .horoscopelistcontent").load(qzPath + "/templates/QZ2/media/horoscopes/" + horosign.toLowerCase() + "_details.html");
			$("#completehoroscope .horoscopecontent").load(qzPath + "/templates/QZ2/media/horoscopes/"+horosign.toLowerCase()+".html");
			hashoroscope=true;
		}
	});
	
	$(".fullhoroscopewindow #togglehoroscope").toggle(
		function(){
			$("#horoscopelist").toggle();
			$("#completehoroscope").toggle();
			$(this).html("View Quick Profile").prev("h4").html("Complete Profile: "+horosign);
		},
		function(){
			$("#completehoroscope").toggle();	
			$("#horoscopelist").toggle();
			$(this).html("View Complete Profile").prev("h4").html("Quick Profile: "+horosign);
		}
	);
	

	/* quiz results buttons : view and save results */
	$("#allresultscontainer").jqm({trigger: '.viewallresults', toTop: true}).hide();
	$("#savedresultsconfirmation").jqm({trigger: '.savemyresults', toTop: true}).hide();



/* This attaches a count-down style character counter to any text area with a label.charactersremaining; there can be any number of these on a page as long as they are all uniquely id'd (which is as it should be).  the "for" attribute must be specified, and the function takes the max limit information from the label.charactersremaining - place it within the label, in a span, like this: <label class="charactersremaining" for="mytextareaid"><span>250</span> characters remaining</label> */
$('.charactersremaining').each(function() {
	targettext = $(this).attr('for');
	maxvalue = $(this).children('span:first').text();
		$(this).children('span:first').text(maxvalue-$("#"+targettext).html().length);
	$(this).append('<span id="'+targettext+'max" class="hide">'+maxvalue+'</span>');
// attaching same function to keyup and keydown.  keyup gives correct value for this.value.length, but keyup is neccessary for count to animate during key repeat.	
		$('#'+targettext).keydown(function() { 
			var chrmax = $('#'+this.id+'max').text();
			if (this.value.length >	chrmax) { 
				this.value = this.value.substring(0, chrmax);
				$('label[for=\''+this.id+'\'] span:first').text(chrmax - this.value.length);
			} else { 		
				$('label[for=\''+this.id+'\'] span:first').text(chrmax - this.value.length);
			}
	});
	$('#'+targettext).keyup(function() { 
			var chrmax = $('#'+this.id+'max').text();
			if (this.value.length >	chrmax) { 
				this.value = this.value.substring(0, chrmax);
				$('label[for=\''+this.id+'\'] span:first').text(chrmax - this.value.length);
			} else { 		
				$('label[for=\''+this.id+'\'] span:first').text(chrmax - this.value.length);
			}
	});
});


	/* below adds extra js alert to delete account lightbox 
		$("#deleteaccountbutton").not("label").click(function(){
		return confirm("Are you sure you want to delete your account? You cannot undo this.");
	}); */
 	
	// Clear out current user name
	//document.forms["logf"].elements[1].value  = "";
	$('#login_username').focus(function(event) {
		$('#login_username').removeClass('logu');
		$('#login_password').removeClass('logp');
	});

	$('#login_password').focus(function(event) {
		$('#login_password').removeClass('logp');
	});
	
	$(".ratingdisplay_ulo").bind("mouseover",function() {
		$(".display_u_msg").toggle();
		if( $(".display_u_msg").html() != "You've already rated this!" ) {
			$(".ratingdisplay_ulo").css("cursor","pointer");
		}
	});
	
	$(".ratingdisplay_ulo").click(function() {
		if( $(".display_u_msg").html() != "You've already rated this!" ) {
			document.location = "/index.php/register/login/";
		}
		return false;
	});
	
	$(".ratingdisplay_ulo").bind("mouseout",function() {
		$(".display_u_msg").toggle();
	});
	
	/* lightbox for rss help */
	$("#rsshelpcontainer").jqm({trigger: '.rsshelp', toTop: true}).hide();
	


	/* BELOW CHANGES MESSAGES TO USE BLUE MESSAGING INSTEAD OF DEFAULT ERROR MESSAGING
		TO CHANGE TO BLUE, AD IDENTICAL COPY INTO messagesToChange ARRAY */
		
	messagesToChange = ["Profile Updated","Image Added","Message Sent"];
	
	function checkErrorMessage() {
		txt = $("#system-message ul li").html();
		for(i=0;i<messagesToChange.length;i++) {
			if (messagesToChange[i] == txt || messagesToChange[i] + " " == txt) {
				return true;
			}
		} 
		return false;
	}
		
	if ( checkErrorMessage() ) {
		$("#system-message dd").css({background:"#E1EBED",color:"#187682",border:"1px solid #187682"});
	}
	
	
	/* USER PROFILE BUTTON BEHAVIORS */
	$("#addasfriend").click(function(){
		curMsg = $("#addasfriend").html();
		curUsr = $("#addasfriend").attr("title");
		switch (curMsg) {
			case "add friend":newMsg ="remove friend";
				$.ajax({
					type: "POST",
					url: "index.php?a=communication&app=user&task=addfriend&protocol=json&view=friends&profile_username="+curUsr,
					data: "name="+curUsr,
					success:function(msg) {
						if (msg != "ok" ) {
							$("#gen_msg").html(msg);
							$(".generic-message").jqm().jqmShow();
							newMsg = "add friend"; // fails for some reason
						}
					},
					error:function() {
						$("#gen_msg").html("oh noes! couldn't add friend!");
						$(".generic-message").jqm().jqmShow();
						newMsg = "add friend"; // fails for some reason
					}
				});break;
					
			case "remove friend":newMsg = "add friend";
				$.ajax({
					type: "POST",
					url: "index.php?a=communication&app=user&task=removefriend&protocol=json&view=friends&profile_username="+curUsr,
					data: "name="+curUsr,
					success:function(msg) {
						if (msg != "ok" ) {
							$("#gen_msg").html(msg);
							$(".generic-message").jqm().jqmShow();
							newMsg = "remove friend"; // fails for some reason
						}
						
					},
					error:function() {
						$("#gen_msg").html("oh noes! couldn't remove friend!");
						$(".generic-message").jqm().jqmShow();
						newMsg = "remove friend"; // fails for some reason
					}
				});break;
			default:return false;
		}
		$("#addasfriend").html(newMsg);
		return false;
	});
	
	$("#watchthisuser").click(function(){
		curMsg = $("#watchthisuser").html();
		curUsr = $("#watchthisuser").attr("title");
		switch (curMsg) {
			case "add to watch list":newMsg ="remove from watch list";
				$.ajax({
					type: "POST",
					url:"index.php?a=communication&app=user&task=addtowatchlist&protocol=json&view=watchlist&profile_username="+curUsr,
					data: "name="+curUsr,
					success:function(msg) {
						if (msg != "ok" ) {
							$("#gen_msg").html(msg);
							$(".generic-message").jqm().jqmShow();
							newMsg = "add to watch list"; // fails for some reason
						}
						
					},
					error:function() {
						$("#gen_msg").html("oh noes! couldn't add to watch list!");
						$(".generic-message").jqm().jqmShow();
						newMsg = "add to watch list"; // fails for some reason
					}
				});break;
			case "remove from watch list":newMsg = "add to watch list";
				$.ajax({
					type: "POST",
					url:"index.php?a=communication&app=user&task=removefromwatchlist&protocol=json&view=watchlist&profile_username="+curUsr,
					data: "name="+curUsr,
					success:function(msg) {
						if (msg != "ok" ) {
							$("#gen_msg").html(msg);
							$(".generic-message").jqm().jqmShow();
							newMsg = "remove from watch list"; // fails for some reason
						}
						
					},
					error:function() { 
						$("#gen_msg").html("oh noes! couldn't remove from watch list!");
						$(".generic-message").jqm().jqmShow();
						newMsg = "remove from watch list"; // fails for some reason
					}
				});break;
			default:return false;
		}
		$("#watchthisuser").html(newMsg);
		return false;
	});
	 
	$("#blockconfirm").click(function(){
		 $(".jqmWindow").jqmHide();
		curMsg = $("#blockthisuser").html();
		curUsr = $("#blockthisuser").attr("title");
		switch (curMsg) {
			case "block user":
				newMsg ="unblock user";
				$.ajax({
					type: "POST",
					url: "index.php?a=communication&app=user&task=addblock&protocol=json&view=friends&profile_username="+curUsr,
					data: "name="+curUsr,
					success:function(msg) {
						if (msg != "ok" ) {
							$("#gen_msg").html(msg);
							$(".generic-message").jqm().jqmShow();
							newMsg = "block user"; // fails for some reason
						}
						
					},
					error:function() { 
						$("#gen_msg").html("oh noes! couldn't block user!");
						$(".generic-message").jqm().jqmShow();
						newMsg = "block user"; // fails for some reason
					}
				});break;
			case "unblock user":newMsg="block user";
			default:return false;
		}
		
		$("#blockthisuser").html(newMsg);
		return false;
	});
	
	
	
	/* WATCHED LIST PG REMOVE BUTTON */
	$("#wl").jqm({trigger:".rmfwl", toTop: true});
	$(".rmfwl").click(function(){
		curUsr = $(this).parent("li").children("a").children("img").attr("alt");
		$("#wl p").html("Are you sure you want to remove <b>" + curUsr + "</b> from your Watched List?");
		return false;
	});
	$("#confirmrflw").click(function() {
			$.ajax({
				type: "POST",
				url:"index.php?a=communication&app=user&task=removefromwatchlist&protocol=json&view=watchlist&profile_username="+curUsr,
				data: "name="+curUsr,
				success:function(msg) {
					if (msg != "ok" ) {
						$("#gen_msg").html(msg);
						$(".generic-message").jqm().jqmShow();
						newMsg = "add to watch list"; // fails for some reason
					}
					
				},
				error:function() {
					$("#gen_msg").html("oh noes! couldn't add to watch list!");
					$(".generic-message").jqm().jqmShow();
					newMsg = "add to watch list"; // fails for some reason
				}
			});
		$(".jqmWindow").jqmHide();
		return true;
	});
	
	
	/* HOROSCOPE NONSENSE */
	$("#yesterday_link,#tomorrow_link,#today_link").click(function(){
		id = (this).id;
		clearHoroscope( id.substring(0,id.indexOf("_")) );
	});

	function clearHoroscope(day){
		$("#currentday").fadeOut("fast",function() {
			$(".horoscope h4").children("span").css("display","none");
			$("#currentday").children("div").css("display","none");
			$("#horonav").children("li").css("color","red");
			switch(day){
				case "yesterday":
					$("#yesterday_date,#yesterday").css("display","block");
					$("#yesterday_link").css("color","#000");
					break;
				case "tomorrow":
					$("#tomorrow_date,#tomorrow").css("display","block");
					$("#tomorrow_link").css("color","#000");
					break;
				default:
					$("#today_date,#today").css("display","block");
					$("#today_link").css("color","#000");
					break;
			}
		});
		$("#currentday").fadeIn("fast");
	}
	
	/* REGISTRATION HOTWIRE */
	$("#usagepolicy,#contentpolicy,#postingrules").children("div").css("width","360px");
	$("#reggo").click(function(){
		$("#registrationform").submit();
	});
	
	$("#addfav").click(function() {
		curMsg = $(this).html();
		curLink = $(this).attr("href").split("task=");
		addorremove = curLink[1].split("&");
		
		newtask= (curLink[0] + "task=" +((addorremove[0] == "addtofavorites")?"removefromfavorites":"addtofavorites")+"&protocol=json&"+addorremove[2]);
		
		if (curMsg == "add to favorites" || curMsg == "remove favorite") {
			$.get($(this).attr("href"));
			$(this).attr("href",newtask);
			$(this).html((curMsg == "add to favorites")?"remove favorite":"add to favorites");
		}
		
		return false;
	});
	
	
	
	$("#report_topic").change(function(){
		if($(this).val() == 2) {
			$(this).after("<div id=\"copyalert\">Be sure to include a link to the original piece of work you believe is being plagiarized here.</div>");
		} else {
			if($("#copyalert")) { $("#copyalert").remove(); }
		}
	});
	
	if($("input#contentpassword").val() != "") {
		$("#sharewithpasswordonly").css("display","block");
	}
	
	$("#msg_blockthisuser").click(function() {
		switch ( $("#msg_blockthisuser").html() ) {
			case "block user":$('.msg_confirm-block').jqm().jqmShow();break;
			case "unblock user":$.post('index.php?a=communication&app=user&task=removeblock&protocol=json&view=message&profile_username='+$("#msg_blockthisuser").attr("title"));$("#msg_blockthisuser").html("block user");break;
			default:return false;
		}
	});

	$("#msg_block").click(function() {
		$.get('index.php?a=communication&app=user&task=addblock&protocol=json&view=message&profile_username='+$("#msg_blockthisuser").attr("title"));
		$("#msg_blockthisuser").html("unblock user");
	});
	
	$("#msg_blockdel").click(function() {
		//$.get('index.php?a=communication&app=user&task=deletemsg&protocol=json&view=message&profile_username='+$("#msg_blockthisuser").attr("title"));
	});
	
	
	/* WATCH LIST FUNCS */
	$(".wl_userlink").click(function(){
		curUsr = $(this).children("img").attr("alt");
		
		$.ajax({
				type: "POST",
				url:"index.php?app=user&task=getNewestContent&protocol=json&view=watchlist&profile_username="+curUsr,
				data: "name="+curUsr,
				success:function(msg) {
					getCnt = msg.split('.');
					cnt = getCnt[getCnt.length-1];
					
					if(cnt<5) {
						$("#wl_list").css({overflow:"visible",height:"auto"});
					} else {
						$("#wl_list").css({overflow:"auto",height:"300px"});
					}
					msg = msg.substring(0,msg.length-4);

					$("#wl_nc").remove();
					$("#wl_list").after("<div style=\"width:600px;text-align:right;\" id=\"wl_nc\"><a href=\"#\" onclick=\"javascript:window.location.reload();\">50 Newest Creations</a></div>");
					$("#wl_list").html(msg);
					$("#wl_title span").html(curUsr + "'s Newest Creations");			
				},
				error:function(msg) {
					alert('bork!');
				}
			});
		
		});
	
	$(".journalentry h2").each(function(i) {
		if (i != 0) $(this).css({background:"none",color:"#000"});
	});
	
	$('#creator').css("display","block");
	$('#loadmsg').css("display","none");
	
	getNewAds();
});// document ready / end jquery functions / FLAG END OF DOCLOAD

function getNewAds() {
	//console.log('updating');
	$("#qzBannerAd").attr({src:$("#qzBannerAd").attr('src')});
	$("#qzRColAd").attr({src:$("#qzRColAd").attr('src')});
	at=setTimeout('getNewAds()',60000);
}
sentmsg=0;
function checkSend() {
	if (!sentmsg) {return true; sentmsg=1;}else{return false;}
}
function parseURLVar() {
	var getURLVars = new Array();
	var URLqString = unescape(top.location.search.substring(1));
	if (URLqString.length>0) {
	var pairs = URLqString.split(/\&/);
		for (var i in pairs) {
			if (!isNaN(i)) {
				var nameVal = pairs[i].split(/\=/);
				getURLVars[nameVal[0]] = nameVal[1];
			}
		}
	return getURLVars;
	}
}
	
function getAds(w,h,tile) {
	
	var g = parseURLVar();
	var appendQStringToDBClickURL = '';
	
	if (g) {
		for (var i in g) {
			if (i=='testmode') {
				if (g[i] == '') {
					appendQStringToDBClickURL = 'testmode=on;';
				}
				else if (!isNaN( g[i] )) {
					appendQStringToDBClickURL = i+'='+g[i]+';';
				} else {
					appendQStringToDBClickURL = 'testmode=on;';
				}
			}
		}
	}

	
	AdDcopt = (tile == 1)?'dcopt=ist;':AdDcopt = '';
	AdPage = (window.DCadPage)?'page=' + DCadPage + ';':'';
	
	var curH = fetchHierarchy(app,view,title,item_id,id);
	curH = curH.split('/');

	var sections = "";

	for(var c=0;c<curH.length;c++) {
		if (curH[c]!="") {sections += "sec"+c+"="+curH[c];}
		if (c!=curH.length) {sections+=';';}
	}

	sections = (app=="default") ? sections.substring(0,sections.length-1):sections;
	sections = sections.replace(/ /g,"_");
	
	var rnd=Math.round(Math.random()*10000000000000000);
	var pth="<scr"+"ipt type='text/javascript' language='javascript' src='https://web.archive.org/web/20100105001639/http://ad.doubleclick.net/adj/quizilla.nol/atf_j_s/home;"+sections+"pos=atf;tag=adj;mtype=standard;sz="+w+"x"+h+";" + AdDcopt + appendQStringToDBClickURL + AdPage + "tile="+tile+";u=mtype-standard|tile-1;ord="+rnd+"?'><\/scr"+"ipt>";
	
	return pth;
}

function getAdParams(w,h,tile) {

	var g = parseURLVar();
	var appendQStringToDBClickURL = '';

	if (g) {
		for (var i in g) {
			if (i=='testmode') {
				if (g[i] == '') { 
					appendQStringToDBClickURL = 'testmode=on;'; 
				} else if (!isNaN( g[i] )) { 
					appendQStringToDBClickURL = i+'='+g[i]+';'; 
				} else { 
					appendQStringToDBClickURL = 'testmode=on;'; 
				} 
			}
		}
	}

	var AdDcopt = (tile == 1)?'dcopt=ist;':AdDcopt = '';
	var AdPage = (window.DCadPage)?'page=' + DCadPage + ';':'';
	var curH = fetchHierarchy(app,view,title,item_id,id);

	return({size:w+"x"+h,keyValues:AdDcopt+appendQStringToDBClickURL+AdPage+"tile="+tile+";",sections:curH});
}





function fetchHierarchy(a,v,t,iid,gid) {//formerly in coda_funcs
	
	if (v=="create"){v=a;a="creator";}
	if (v=="type" && a=="quizzes")  { a="creator";v="quiz_"+v; }
	
	switch(a) {
		case "register":a="utils";break;
		case "pages":a="info";break;
		case "user":
		case "my":a="mystuff";break;
		default:break;
	}
	
	h=(a=="default")?"home/home":a;

	if ( (h != "home") || (h != "search") ) {
		h += (view=="" && a!="default" && a!="info" && a!="utils") ? "/hub":"/"+v;
		if (a=="utils" && (!v) ) {h +="register";}
		switch (v) {
			case "quiz":
			case "test":
			case "lyric":
			case "poem":
			case "poll":
			case "story":h += "/"+t;break;
			case "info":h += "/"+iid;break;
			default:break;
		}
	}
	
	if (a=="lists") {h = "home/lists/"+ ( (v=="top")?"top_rated":v);}
	if (a=="games" && (gid) ) { h += "/"+gid; }
	return h;
}

/*/ search func
function chksearch(qs) {
	f=document.forms["sform"];
	if (f.q.value=="") return false;
	m="https://web.archive.org/web/20100105001639/http://search.live.com/results.aspx?q="+escape( f.q.value.replace(/ /g, "+") )+"&mkt=en-us&FORM=VCM017";
	if(f.stype[0].checked){window.open(m);return false;}else{f.action=qs;f.submit();}
	return true;
}*/
	
// a jquery cancel default
$.fn.cancel = function( e ) { return this.bind( e, function() { return false; } ); };


/*clear search field on click - made into plugin so it can easily be used more than once. use: $("input id/class").inputClear(). */
$.fn.inputClear = function() {
	return this.focus(function() {
		if( this.value == this.defaultValue ) {
			this.value = "";
		}
	}).blur(function() {
		if( !this.value.length ) {
			this.value = this.defaultValue;
		}
	});
};

$.fn.topPos = function() {
	var curtop = 0;
	var obj=this.get(0);
	if (obj.offsetParent) {
		curtop = obj.offsetTop
		while (obj = obj.offsetParent) {
			curtop += obj.offsetTop
		}
	}
	return curtop;
}


// some vars we use to check status
var QUIZ = function () {
	return {
		cpon : 0, // was for color picker
		edititem : 0, // for quiz creation
		section : 0, // for quiz creation
		results : 1,
		questions : 1,
		answers : 1,
		currentLabel: "",
		resultsstatus : ' disabled="disabled"',
		newresult : "",
		image : "",
		gotoquestion : "", // jump back after result creation
		returnanswer : "", // populate after result creation
		taglist : Array(), // tagstyle
		taglistgraph : Array(), // tagstyle
		tagcolors : Array("red","blue","green","purple","yellow","brown"),
		type : "",
		scored : 0,
		f: "", // for onblur + cancel action in jeditable
		params: "",

		result : function(title,description) { //this got dropped
			this.title = title;
			this.description = description;
		}
	}
}();

// close stuff with esc key
$(document).keydown( function( e ) {
	if( e.which == 27) {  // escape, close box
		// remove jqmodal

		if($(".jqmOverlay").length>0) { $(".jqmWindow").jqmHide(); }
		// remove colorpicker
		if(QUIZ.cpon == 1) { cp_remove(); }
	}
});

// close color picker when click away.
// todo: make it not coloorpicker only
document.onclick=check;
function check(e){
	var target = (e && e.target) || (event && event.srcElement);
	var obj = document.getElementById('colorpicker');
	if (target != document.getElementById("cpicon")&&target != document.getElementById("cpclose")&&QUIZ.cpon == 1) {
		checkParent(target) ? cp_remove() : null;
	}
}
function checkParent(t){
	while(t.parentNode){
		if(t==document.getElementById('colorpicker')){
			return false
		}
		t=t.parentNode
	}
	return true
}

// toggle and reset
function cp_remove() {
	$("#colorpicker").remove();
	QUIZ.cpon = 0;
}

/* toggle the color picker
function cp_toggle() {
	$('#colorpicker').toggle();
	$('form.colorpicker .colorpickerclose').toggle();
	QUIZ.cpon = 0 ? 0 : 1;
}*/

function breaker() {
	loc = window.location.href.split('/');
	return (loc[loc.length-1] == "create" && loc[loc.length-2] == "stories") ? true:false;
}


// init the RTE if it's included. textarea class=rte
if(typeof(tinyMCE)!="undefined") {

	tinyMCE.init({
		force_p_newlines : breaker(),
		mode : "textareas",
		theme : "advanced",
		editor_selector : "rte",
		convert_fonts_to_spans : true,
		invalid_elements : "font",
		inline_styles : true,
		relative_urls : false,
		remove_script_host : false,
		plugins : "inlinepopups,searchreplace,quizimage",
		theme_advanced_buttons1 : "bold,italic,underline,formatselect,fontselect,fontsizeselect,separator,forecolor,separator,removeformat,separator,image",
		theme_advanced_buttons2 : ",justifyleft,justifycenter,justifyright,justifyfull,separator,cut,copy,paste",
		theme_advanced_buttons3 : "",
		theme_advanced_fonts : "Andale Mono=andale mono,monospace;Arial=arial,helvetica,sans-serif;Arial Black=arial black,sans-serif;Century Gothic=century gothic,sans-serif;Courier New=courier new,courier,monospace;Comic Sans MS=comic sans,cursive;Georgia=georgia,arial,helvetica,san-serif;Impact=impact,sans-serif;Times-Roman=Times New Roman,Times,times,timesroman,serif;Trebuchet MS=trebuchet ms,san-serif;",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		extended_valid_elements : "em/i,strong/b,u,a[name|href|target|title|onclick],img[style|rel|class|src|alt|title|width|height|name],hr[class|width|size],span[class|style]"
	});
}

// showtags
function showTags(type,color,obj) {

	var $obj = $(obj);

	switch (type) {
		case "size":
			$obj.find(".taglist").removeClass(QUIZ.tagcolors.join(" ")+" graph").addClass("size");
			$obj.find(".tagselect").remove();
			
			// if it's not graph but coming from, replace html with og and pull the sorted class
			$obj.find(".sorted").each(function(){
				var tindex = $(this).attr("rel").substring(5);
				$(this).html(QUIZ.taglist[tindex]);
				$(this).removeClass("sorted");
			});

			// remember for next time
			setCookie("tagtype", type);
			break
		case "color":
				
				
			if($obj.find(".tagselect").length==0) {
		
				$obj.find(".taglist").removeClass(QUIZ.tagcolors.join(" ")+" graph size").addClass(QUIZ.tagcolors[0]);
			
				/* BELOW BREAKS COLOR BLOCKS ON TAG HUB
				
				if((arguments.length>2 || color!="") && $("body.tagspage").length==0) { $obj.find(".taglist").before(colorList()); } else {$("#globaltagstyle").append(colorList());	 }
				
				*/
				
				$obj.find(".taglist").before(colorList());
				
				
				// if it's not graph but coming from, replace html with og and pull the sorted class
				$obj.find(".sorted").each(function(){
					var tindex = $(this).attr("rel").substring(5);
					$(this).html(QUIZ.taglist[tindex]);
					$(this).removeClass("sorted");
				});

			//change on hover
				$obj.find(".tagselect a").cancel("click").click(function(){
				var tempcolor = $(this).attr("href").split("#");
				var newcolor = tempcolor[1];

				$(this).parent().parent().parent().find(".tagselect a").removeClass("on");
				$(this).addClass("on");

				// remove all possible colors and add just the hovered
					// below line was used for individual cloud controls on tags page. change to global control
					// $(this).parent().parent().parent().find(".taglist").removeClass(QUIZ.tagcolors.join(" ")+" graph").addClass(newcolor);	
					$(".taglist").removeClass(QUIZ.tagcolors.join(" ")+" graph").addClass(newcolor);

				// remember for next time
				setCookie("tagtype", newcolor);
			});

			if(color) {
					$obj.find(".taglist").addClass(color);
					$obj.find(".tagselect li."+color+" a").addClass("on");
				} else { 
					$obj.find(".tagselect li:first a").addClass("on");
				}
			}
			
			break
		case "graph":
			$obj.find(".taglist").removeClass(QUIZ.tagcolors.join(" ")+" size").addClass("graph");
			$obj.find(".tagselect").remove();
			sortList($obj.find(".taglist"),"class");

			// remember for next time
			setCookie("tagtype", type);
			break
	}
}

//buildcolorlistforselection
function colorList() {
	var list = '<ul class="tagselect">';
	for(i=0;i<QUIZ.tagcolors.length;i++) {
		list += '<li class="'+QUIZ.tagcolors[i]+'"><a href="#'+QUIZ.tagcolors[i]+'">'+QUIZ.tagcolors[i]+'</a></li>';
	}
	list += '</ul>';
	return list;
}

// sort list of tags for graph
function sortList(obj,attr) {

	var $obj = $(obj);	
	if($obj.find(".sorted").length==0) {		
		$obj.each(function(t) {							 
			
			var $current = $(this);			
			if(!QUIZ.taglistgraph[t] || QUIZ.taglistgraph[t]=="") {				
				QUIZ.taglistgraph[t]=="";
			var i = 10;
			while(i>0) {
					$current.find(".rank-"+i).each(function(){		
						QUIZ.taglistgraph[t] += "<li>"+$(this).parent().html()+"</li>";
				});
				i--;
			}
		}
			$current.addClass("sorted").html(QUIZ.taglistgraph[t]);			
		});
	}
}

// Cookies get/set/delete
function getCookie( name ) {
	var start = document.cookie.indexOf( name + "=" );
	var len = start + name.length + 1;
	if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
		return null;
	}
	if ( start == -1 ) return null;
	var end = document.cookie.indexOf( ";", len );
	if ( end == -1 ) end = document.cookie.length;
	return unescape( document.cookie.substring( len, end ) );
}
function setCookie( name, value, expires, path, domain, secure ) {
	var today = new Date();
	today.setTime( today.getTime() );
	if ( expires ) {
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );
	document.cookie = name+"="+escape( value ) +
		( ( expires ) ? ";expires="+expires_date.toGMTString() : "" ) + //expires.toGMTString()
		( ( path ) ? ";path=" + path : "" ) +
		( ( domain ) ? ";domain=" + domain : "" ) +
		( ( secure ) ? ";secure" : "" );
}
function deleteCookie( name, path, domain ) {
	if ( getCookie( name ) ) document.cookie = name + "=" +
			( ( path ) ? ";path=" + path : "") +
			( ( domain ) ? ";domain=" + domain : "" ) +
			";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}
/* popular array for compose message to field friends autocomplete */
function getFriends() {
	
	var friends = new Array();
	$("#messagerecipientselect .friendslist a img").each(function(){	
		friends.push($(this).attr("alt"));	
	});
	
	return friends;	
}

Array.prototype.inArray = function (value)
// Returns true if the passed value is found in the
// array.  Returns false if it is not.
{
    var i;
    for (i=0; i < this.length; i++) {
        // Matches identical (===), not just similar (==).
        if (this[i] === value) {
            return true;
        }
    }
    return false;
};

function singleApp(a) {
	switch(a) {
		case "quizzes":ap="quiz";break;
		case "tests":ap="test";break;
		case "stories":ap="story";break;
		case "polls":ap="poll";break;
		case "poems":ap="poem";break;
		case "lyrics":ap="lyrics";break;
		default: ap="quiz";break;
	}
	return ap;
}

function setupPopQuiz() { 
	pt=$("#hub_list").text().split(', ');
	mod = "<div><h2><span>"+pt[0]+"<\/span><\/h2>";
	for(i=1;i<pt.length;i++) {
		mod += '<a href="/hubs/'+hubruls[i-1]+'">'+pt[i]+'<\/a> | ';
	}
	mod = mod.substring(0,mod.length-2);
	
	return mod+"<\/div>";

}

/*
     FILE ARCHIVED ON 00:16:39 Jan 05, 2010 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:55:39 Oct 04, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 2027.062 (3)
  esindex: 0.009
  captures_list: 2128.218
  CDXLines.iter: 26.066 (3)
  PetaboxLoader3.datanode: 33.687 (4)
  exclusion.robots: 0.259
  exclusion.robots.policy: 0.243
  RedisCDXSource: 1.725
  PetaboxLoader3.resolve: 4357.77 (2)
  load_resource: 2404.832
*/