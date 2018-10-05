/**
 * Star Rating - jQuery plugin
 *
 * Copyright (c) 2007 Wil Stuckey
 * Modified by John Resig
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a degradeable star rating interface out of a simple form structure.
 * Returns a modified jQuery object containing the new interface.
 *
 * @example jQuery('form.rating').rating();
 * @cat plugin
 * @type jQuery
 *
 */
jQuery.fn.rating = function(){
    return this.each(function(){
        var div = jQuery("<div/>").attr({
            title: this.title,
            className: this.className
        }).insertAfter( this );

        jQuery(this).find("select option").each(function(){
            div.append( this.value == "0" ?
               "" : // "<div class='cancel'><a href='#0' title='Cancel Rating'>Cancel Rating</a></div>" :
                "<div class='star' id='star"+this.value+"'><a href='#" + this.value + "' title='Give it a " +
                    this.value + " Star Rating'>" + this.value + "</a></div>" );
        });

        var averageRating = this.title.split(/:\s*/)[1].split("."),
            url = this.action,
            averageIndex = averageRating[0],
            averagePercent = averageRating[1];
		
        // hover events and focus events added
        var stars = div.find("div.star")
            .mouseover(drainFill).focus(drainFill)
            .mouseout(drainReset).blur(drainReset)
            .click(click);

        // cancel button events
        div.find("div.cancel")
            .mouseover(drainAdd).focus(drainAdd)
            .mouseout(resetRemove).blur(resetRemove)
            .click(click);

       	reset();
		hasrated = 0;
        function drainFill(){ drain(); fill(this); }
        function drainReset(){ drain(); reset(); }
        function resetRemove(){ reset(); jQuery(this).removeClass('on'); }
        function drainAdd(){ drain(); jQuery(this).addClass('on'); }
		
        function click(){
			averageIndex = stars.index(this) + 1;
			averagePercent = 0;

			if ( averageIndex == 0 )
				drain();
			jQuery.post(url,{
				'rating': jQuery(this).find('a')[0].href.slice(-1)
			});
			hasrated=1;
			lockRating();
			return false;
        }
		
		function lockRating() {
			$(".rater").remove();
			div.find("div.star,a").unbind("mouseover").unbind("mouseout").unbind("click").css({ "cursor" : "default" });
			div.find(".hover").addClass("on").removeClass("hover");
			div.find("div.on").css({ "background-position" : "0 -31px" });
			div.find("a").css({ "visibility" : "hidden" });
			div.css({ "cursor" : "default" }).append("Thanks for rating!");
		}
		
        // fill to the current mouse position.
        function fill( elem ){
        	if(!hasrated) {
				stars.find("a").css("width", "100%");
				//was stars.lt(stars.index(elem) + 1)
				stars.slice(0, stars.index(elem) + 1 ).addClass("hover");
				plural = (stars.index(elem)==0) ? "":"s";
				div.append("<div class='rater'> Give it "+(stars.index(elem) + 1)+" star"+plural+"!</div>"); /* adds messaging */
			}
        }
        
        // drain all the stars.
        function drain(){
            stars.removeClass("on hover");
            $(".rater").remove(); /* clears out messaging */
            
        }

        // Reset the stars to the default index.
        function reset() {
            stars.slice(0,averageIndex).addClass("on");
            percent = averagePercent ? averagePercent:0;
            percent = (percent == 50)?43:percent; // display hack to reset 50% values to look like 50% stars
			$("#star"+(eval(averageIndex)+1)).addClass("on").children("a").css("width", percent + "%");
		}
			
        
    }).remove();
};

// fix ie6 background flicker problem.
if ( jQuery.browser.msie == true )
    document.execCommand('BackgroundImageCache', false, true);

/*
     FILE ARCHIVED ON 00:18:15 Jan 05, 2010 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:55:37 Oct 04, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 442.835 (3)
  esindex: 0.008
  captures_list: 556.091
  CDXLines.iter: 28.623 (3)
  PetaboxLoader3.datanode: 117.079 (4)
  exclusion.robots: 0.206
  exclusion.robots.policy: 0.175
  RedisCDXSource: 0.483
  PetaboxLoader3.resolve: 897.807 (2)
  load_resource: 607.609
*/