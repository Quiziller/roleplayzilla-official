/* OMNITURE TRACKING CODE */
var id,item_id,view,title,task;

var channel = (app=="default") ? "misc":app;

var pageName 	= getPgName(app,view);//window.location.pathname

dispatcher.setAttribute("pageName", pageName);
dispatcher.setAttribute("channel", channel);

var contentType = (id) ? id:0;
var actionType=0;
var contentID=0;

// type switch based on app name
switch(channel) { 
	case "quizzes": contentType=1;break;
	case "tests": contentType=2;break;
	case "stories": contentType=3;break;
	case "polls": contentType=4;break;
	case "lyrics": contentType=5;break;
	case "poems": contentType=6;break;
	case "games": contentType=7;break;
	case "profiles": contentType=8;break;
	case "images": contentType=9;break;
	default: 0;break;
}

switch(view) {
	case "create": actionType=11;break;
	default: actionType=12;break;
}

if (item_id) id=item_id;
id = (id) ? id:0;
contentID = id;

sendQuizillaReporting(contentType, actionType, contentID);

function getPgName(a,v) { // dupe of hierarchy
	
	if (v=="create"){v=a;a="creator";}
	if (v=="type" && a=="quizzes")  { a="creator";v="quiz_"+v; }
	if (v=="share") v="published";
	
	switch(a) {
		case "register":a="utils";break;
		case "pages":a="info";break;
		case "user":
		case "my":a="mystuff";break;
		default:break;
	}
	
	pn=(a=="default")?"home/home":a;

	if ( (pn != "home") || (pn != "search") ) {
		pn += (v=="" && a!="default" && a!="info" && a!="utils") ? "/hub":"/"+v;
		if (a=="utils" && (!v) ) {pn +="register";}
	}

	if ( (a == "mystuff") && (v=="inbox" || v=="message" || v=="sent" ) ){
		insertmsg = pn.split("/");
		if(task=="compose") insertmsg[1] = task;
		pn = insertmsg[0] + "/messages/" + insertmsg[1];
	}
	
	if ( (a=="quizzes" || a=="polls" || a=="tests") && view=="result") {
		inserttype = pn.split("/");
		var loc_a=a=="quizzes"?"/quiz/":a=="polls"?"/poll/":"/test/";
		pn = inserttype[0] + loc_a + inserttype[1];
	}
	return pn;
}

/*
     FILE ARCHIVED ON 00:15:51 Jan 05, 2010 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:55:47 Oct 04, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 40.226 (3)
  esindex: 0.006
  captures_list: 370.702
  CDXLines.iter: 27.637 (3)
  PetaboxLoader3.datanode: 47.887 (4)
  exclusion.robots: 0.343
  exclusion.robots.policy: 0.328
  RedisCDXSource: 0.608
  PetaboxLoader3.resolve: 3045.255
  load_resource: 3079.917
*/