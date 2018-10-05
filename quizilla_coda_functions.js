var contentTitle 	= ["Page","Quizzes","Tests","Stories","Polls","Lyrics","Poems","Games","Profiles","Images"];
var actionTitle 	= ["","Created","Served","Saved","Reported","Shared","Favorited","Emailed"];

function sendQuizillaReporting(contentType, actionType, contentID, userID, result){
	if(typeof dispatcher!="undefined"){		
		clearDispatcherAttributes(20);		
		setOmniDispatcher();		
		dispatcher.sendCall();
	}
}

function setOmniDispatcher(){
        try{
               if(typeof dispatcher!="undefined"){   
                       if(contentType != 0){                         
                               if(typeof hierarchy != "undefined"){
                                      hierarchy = actionTitle[actionType%10] + "/" + contentTitle[contentType] + "/" + contentID;
                               }
 
                               dispatcher.setAttribute("channel", channel);
                               dispatcher.setAttribute("prop"+contentType, contentID);
                               dispatcher.setAttribute("prop"+actionType, contentID);
                               switch(contentType){
                                      case 1:
                                      case 2:
                                      case 4: if(actionType == 13) dispatcher.setAttribute("prop18", result);
                                              break;
                               }
                       }
 
                       hierarchy = pageName;//redefineHierarchy(app,view,title,item_id,id);
 
                       dispatcher.setAttribute("pageName ", pageName);
                       dispatcher.setAttribute("hier1", hierarchy);
                       dispatcher.setAttribute("prop20", userID);
 
                       if (app=="search" && s_term != "") { dispatcher.setAttribute("prop21",s_term);}
               }
        }catch(e){}
}
function clearDispatcherAttributes(count){
	try{
		if(count){
			if(typeof dispatcher!="undefined"){
				for(var i=1; i<=count; i++){
					dispatcher.setAttribute("prop"+i, "");
				}
			}
		}
	}catch(e){}
}

function debug(dispatcher){
	if(typeof dispatcher != "undefined"){
		var str = 	"pageName: " + dispatcher.setAttribute("pageName") + "\n";
		str +=		"hier1: " + dispatcher.setAttribute("hier1") + "\n";
		str +=		"channel: " + dispatcher.setAttribute("channel") + "\n";
		for(var i=1; i<=20; i++){
			str +=	"prop" + i + ": " + dispatcher.getAttribute("prop"+i) + "\n";
		}
	}
}

//top logo link -- link event
function headerclicked(){
                try{
                                com.mtvi.reporting.Account.name = "viaquiz";
                                dispatcher.setAttribute("linkType","o");
                                dispatcher.setAttribute("linkName",pageName+"/"+quizName+"/headerClickThru");
                                dispatcher.setAttribute("lnk",true);
                                dispatcher.setAttribute("pageName","");
                                dispatcher.setAttribute("hier1","");
                                dispatcher.setAttribute("channel","");
                                clearDispatcherAttributes(20);   
                                dispatcher.sendCall();
                } catch(e){}
}

//report on flash quiz taken
function quiztaken(){
	try{
		resetParamsToDefault();
		dispatcher.setAttribute("prop10",quizName);
		dispatcher.sendCall();
	} catch(e){}
 	$.get("index.php?a=quizzes&view=quiztaken&flash_quiz_id="+item_id);
}

function sendAnalyticsEvent(str,lnkname){
	
	try {
		if(com.mtvi.util.isDefined(dispatcher)){
			if(com.mtvi.util.isDefined(com.mtvi.reporting.Account)){
				if(com.mtvi.util.isDefined(lnkname)){
					obj = {};					
					if(com.mtvi.util.isDefined(str)){ 
						obj.name=str;
						omniSetOverrides(obj, "append");
					}else{ 
						obj.name=com.mtvi.reporting.Account.name;
						omniSetOverrides(obj, null);
					}					
					delete obj;
					dispatcher.sendLinkEvent({linkType:"o",lnk:true,linkName:lnkname});
				}else{
					if(com.mtvi.util.isDefined(str))
						omniSetOverrides({name:str}, "append");
					else
						omniSetOverrides({name:com.mtvi.reporting.Account.name}, null);
					dispatcher.sendCall();
				}
			}
		}
	} catch(e){}	
}
function omniSetOverrides(or,acctNameAction){
	try{
		resetParamsToDefault();
		var ro = {};
		for(i in or){
			var tmpi=i.replace(/s_/,"");
			tmpi=(tmpi=="account")? "name" : tmpi;
			ro[tmpi]=or[i];
			
			if(tmpi=="name"){
				if(acctNameAction){
					if(acctNameAction=="append"){
						var pattern = new RegExp("^"+ro[tmpi]+"$|^"+ro[tmpi]+",|,"+ro[tmpi]+"$|,"+ro[tmpi]+",");
						if(!pattern.test(com.mtvi.reporting.Account.name))
							com.mtvi.reporting.Account.name += ',' + ro[tmpi]; 
					}else if(acctNameAction=="overwrite")
						com.mtvi.reporting.Account.name = ro[tmpi]; 
				}
				ro[tmpi]= com.mtvi.reporting.Account.name;
			}
		}
		ro.dynamicAccountSelection = false;
		ro.linkInternalFilters = "javascript:,quizilla.teennick.com";
		ro.trackExternalLinks = true;
		ro.trackDownloadLinks = true;
		if(com.mtvi.util.isDefined(dispatcher)) dispatcher.setAccountVars(ro);
	}catch(e){}
}
function resetParamsToDefault(){
	try {
		if(com.mtvi.util.isDefined(dispatcher)){
			com.mtvi.reporting.Account={
				name:'viaquiz',
				dynamicAccountSelection:true,	
				dynamicAccountList:'viaquizdev=www.quizilla.teennick-d.mtvi.com ',
				linkInternalFilters:'javascript:,quizilla.teennick.com',
				trackExternalLinks: true,
				trackDownloadLinks: true
			};
			clearDispatcherAttributes(20);
			setOmniDispatcher();
		}
	} catch(e){}
}
/*
     FILE ARCHIVED ON 00:18:56 Jan 05, 2010 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 20:55:41 Oct 04, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 147.098 (3)
  esindex: 0.01
  captures_list: 289.441
  CDXLines.iter: 32.152 (3)
  PetaboxLoader3.datanode: 154.154 (4)
  exclusion.robots: 0.171
  exclusion.robots.policy: 0.159
  RedisCDXSource: 1.78
  PetaboxLoader3.resolve: 3346.799
  load_resource: 3395.333
*/