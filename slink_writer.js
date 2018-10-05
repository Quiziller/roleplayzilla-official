var linkspotlist = mapkey[0].keywords.split(', ');

function parstring (str) {
    str = str.replace(/&/g, '&#38;');
    str = str.replace(/'/g, '&#39;');
    str = str.replace(/"/g, '&#34;');
    str = str.replace(/\\/g, '&#92;');
    var ptitle = '';
   
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 31 && str.charCodeAt(i) < 127) { ptitle += str.charAt(i); }
    }

    return ptitle;
}


function ylistings(type) {
	var linkspots ="";
	var i=6;
	var rowcount = 0;
	var linkstring = "";
	
		while (i<zSr.length) {
			var desc = zSr[i++];var unused1 = zSr[i++];var clickURL = zSr[i++];var title = zSr[i++]; var sitehost = zSr[i++]; var unused = zSr[i++];
			var ptitle=parstring(title);
			var pdesc = parstring(desc);
			linkstring += '<div class="ylink" ';
			if (i==24) { linkstring += 'style="padding-right:0px;"';}
			linkstring += ('><a class="ylinktitle" href="'+clickURL + '" target="_new">'+ptitle+'<\/a><br><a href="'+clickURL + '" target="_new" class="ylinkdesc">'+pdesc+'<\/a><br><a href="'+clickURL+'" class="ysitelink" target="_new">'+sitehost+'<\/a><\/div>');
		}
		
		linkspots += '<br clear="all"><br><center><table cellpadding="0" cellspacing="0" border="0" width="600"><tr>';
		for(x=0;x<4;x++) {
			linkspots += '<td width="150" valign="top" align="center"><a href="/search/?q=' + linkspotlist[x].toLowerCase() + '&ls=1" class="ylinkspottitle">'+linkspotlist[x]+'<\/a><\/td>';
		}
		linkspots += '<\/table><\/center>';
		
	document.write(linkstring+linkspots);
}

if(zSr.length>0){ ylistings(); }
/*
     FILE ARCHIVED ON 00:14:10 Jan 05, 2010 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:55:58 Oct 04, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 132.771 (3)
  esindex: 0.008
  captures_list: 569.319
  CDXLines.iter: 39.371 (3)
  PetaboxLoader3.datanode: 243.484 (4)
  exclusion.robots: 0.233
  exclusion.robots.policy: 0.218
  RedisCDXSource: 1.672
  PetaboxLoader3.resolve: 129.046
  load_resource: 358.741
*/