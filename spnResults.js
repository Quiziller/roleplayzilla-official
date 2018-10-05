
var resultstart = (window.zSr.length>6) ? 1:0;
var resultmiddle = (window.zSr.length>18) ? 1:0;
var resultend = (window.zSr.length>30) ? 1:0;

function parstring (str) {
    str = str.replace(/&/g, '&#38;');
    str = str.replace(/'/g, '&#39;');
    str = str.replace(/"/g, '&#34;');
    str = str.replace(/\\/g, '&#92;');
    var ptitle = '';
   
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 31 && str.charCodeAt(i) < 127) ptitle += str.charAt(i) 
    }
    return ptitle;
}
function ShowListings(seedVal,upperLimit) {
	var i=seedVal;
	var linkstring = "";

	while (i <= upperLimit) {
		var descr = zSr[i++]; // listing description
		if (descr === undefined) break;
		var unused1 = zSr[i++]; // (ignore)
		var clickURL = zSr[i++]; // listing link
		var title = zSr[i++]; // listing title
		var sitehost = zSr[i++]; // advertisers domain name
		var unused2 = zSr[i++]; // (ignore)
		var ptitle=parstring(title);
		
		linkstring += ('<div class="yblock"><a href="'+clickURL + '" target="_new">'+title+'<\/a><div><a href="'+clickURL+'" target="_blank" style="text-decoration:none;color:#000;">'+descr+'</a><\/div><a href="'+clickURL+'"  target="_new">'+sitehost+'<\/a><\/div><br>');
		
	}
 
   document.write('<script type="text/javascript">alert(1 + 2);</script>'); 

}
