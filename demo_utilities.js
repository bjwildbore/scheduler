function loadFilters(){
		var aFilters = [],		
		
		filter = new fuiFilter('sources','Sources');
		filter.required = true;
			
		filter.options = [
			{value:'courses',label:'Courses',selected:true},
			{value:'events',label:'Events',selected:false},
			{value:'dates',label:'Dates',selected:false}
		];
			
		aFilters.push(filter);


		filter = new fuiFilter('region','Region');
		filter.required = true;
		filter.applyTo = ['courses'];
			
		filter.options = [
			{value:1,label:'Northern',selected:false},
			{value:2,label:'Central',selected:false},
			{value:3,label:'Southern',selected:false}
		];
			
		aFilters.push(filter);

		
		filter = new fuiFilter('location','Location');
		filter.multi = false;
		filter.required = false;
		filter.parent = 'region';
		filter.applyTo = ['courses'];
		filter.options = [
			{value:'akl',label:'Auckland',selected:false,parent:'1'},
			{value:'alb',label:'Albany',selected:false,parent:'1'},
			{value:'pmr',label:'Palmy',selected:true,parent:'2'},
			{value:'wan',label:'Vegas',selected:true,parent:'2'},
			{value:'cch',label:'Christchurch',parent:'3'},
			{value:'dnd',label:'Dunedin',parent:'3'}
		];		
		
		aFilters.push(filter);		
		
		filter = new fuiFilter('category','Category');
		filter.required = false;
		filter.multi = false;	
		
		filter.applyTo = ['courses'];		
		filter.options = [
			{value:1,label:'a',selected:false},
			{value:11,label:'b',selected:true},
			{value:2,label:'c',selected:true},
			{value:23,label:'d',selected:true},
			{value:3,label:'e'},
			{value:4,label:'f'}
		];
		
		aFilters.push(filter);	

return aFilters;		
}


/*
	function loadDictionaryArrays(){
		
		oFilters.region.dictionary  = $.jStorage.get("caRegions");				
		if(!oFilters.region.dictionary ){		  
		  oFilters.region.dictionary = getRegionsArrayFromSP();			
		  $.jStorage.set("caRegions",oFilters.region.dictionary);		  
		}  
		
		oFilters.location.dictionary = $.jStorage.get("caLocations");				
		if(!oFilters.location.dictionary ){	
		  oFilters.location.dictionary = getLocationsArrayFromSP();			
		  $.jStorage.set("caLocations",oFilters.location.dictionary );		  
		}

		oFilters.tutor.dictionary = $.jStorage.get("caTutors");				
		if(!oFilters.tutor.dictionary ){	
		  oFilters.tutor.dictionary = getTutorsArrayFromSP();			
		  $.jStorage.set("caTutors",oFilters.tutor.dictionary );		  
		}	

		oFilters.type.dictionary = $.jStorage.get("caTypes");				
		if(!oFilters.type.dictionary){	
		  oFilters.type.dictionary = getTypesArrayFromSP();			
		  $.jStorage.set("caTypes",oFilters.type.dictionary);		  
		}

		oFilters.status.dictionary = $.jStorage.get("caStatus ");				
		if(!oFilters.status.dictionary){	
		  oFilters.status.dictionary = getStatusArrayFromSP();			
		  $.jStorage.set("caStatus ",oFilters.status.dictionary );		  
		} 
		
	}// end loadDictionaryArrays

		function clearBrowserCache(){
		
	    $.jStorage.flush();
		$.cookie("f_region","");
		
		$.cookie("f_tutor","");
		$.cookie("f_location","");		
		$.cookie("f_status","");
		$.cookie("f_type","");
		$.cookie("f_options","");	
	  
	    location.reload(true);	  	
	}
	
	function formatOwsDate(d){	
		var	sDateSplit = d.split(' ');
		var	sTimeSplit = sDateSplit[1].split(':');
		var	sDateSplit = sDateSplit[0].split('-');
		var	sTime = sTimeSplit[0] +":" +sTimeSplit[1];				
		var	sDate =  sDateSplit[2]+"/"+sDateSplit[1]+"/"+ sDateSplit[0];
        
        return(sDate +" (" +sTime +")" );
	}
	
	function renderCalendar(){
		//console.log("renderCalendar");
	
		// ********  render the calendar ************
		$('#calendar').fullCalendar({
			height:500,	
			firstDay:1,
			editable:false,
			viewDisplay: function(view) {
				// $("#jumpTool").appendTo("td.fc-header-center");
				applySettingsToCalendar();
			},
	
			header:{
				left:   'today prevYear,prev,next,nextYear',
				center: 'title',
				right:  ''
			},
	
			
	
			eventClick: function(event) {
				if (event.url) {
					window.open(event.url);
					return false;
				}
			}
	
		});
	
	}

	function addDates(dStart,dEnd){  
		
		var thisItem =  new CalendarItem(),
			tmpStr = "",
			aTmp = [],
			sReportStartDate = dStart.getFullYear() +'-' + (dStart.getMonth()+1) +'-' + dStart.getDate(),
			sReportEndDate = dEnd.getFullYear() +'-' + (dEnd.getMonth()+1) +'-' + dEnd.getDate();			

		$().SPServices({
		    operation: "GetListItems",
		    async: false,
			cacheXML:true,
		    listName: "clinical_date",
			CAMLQuery: '<Query><Where><And><Geq><FieldRef Name="EndDate" /><Value Type="DateTime">'+sReportStartDate +'</Value></Geq><Leq><FieldRef Name="StartDate" /><Value Type="DateTime">'+sReportEndDate +'</Value></Leq></And></Where></Query>',
		    CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='Title' /><FieldRef Name='Region' /><FieldRef Name='Location' /></ViewFields>",
		    completefunc: function (xData, Status) {

		     $(xData.responseXML).SPFilterNode("z:row").each(function() { 
				
				thisItem = new CalendarItem();
				thisItem.id = $(this).attr("ows_ID");
				thisItem.title = $(this).attr("ows_Title");
				thisItem.source = "dates";			

				thisItem.sort = 1;
				thisItem.region = formatOWSItem($(this).attr("ows_Region"),0);					
				thisItem.location = formatOWSItem($(this).attr("ows_Location"),0);				
				thisItem.url = "/Training/TrainingTeam/Lists/OtherDates/DispForm.aspx?ID="+$(this).attr("ows_ID");
				
				thisItem.start =  $(this).attr("ows_StartDate");
				thisItem.end = $(this).attr("ows_EndDate");
				
				thisItem.className = "item_" + thisItem.source;
									

				aTmp.push(thisItem); 				
					
		      });

		    }
	  	});
	  	  	
	  	return aTmp;

	}



function addAvailability(dStart,dEnd){
	   

		var thisItem =  new CalendarItem();
		var tmpStr = "";
		var aTmp = [];
		var sReportStartDate = dStart.getFullYear() +'-' + (dStart.getMonth()+1) +'-' + dStart.getDate();		

		var sReportEndDate = dEnd.getFullYear() +'-' + (dEnd.getMonth()+1) +'-' + dEnd.getDate();
		//console.log('<Query><Where><And><Geq><FieldRef Name="End_x0020_date" /><Value Type="DateTime">'+sReportStartDate +'</Value></Geq><Leq><FieldRef Name="Start_x0020_date" /><Value Type="DateTime">'+sReportEndDate +'</Value></Leq></And></Where>');

		$().SPServices({
		    operation: "GetListItems",
		    async: false,
			cacheXML:true,
		    listName: "clinical_availability",
			CAMLQuery: '<Query><Where><And><Geq><FieldRef Name="EndDate" /><Value Type="DateTime">'+sReportStartDate +'</Value></Geq><Leq><FieldRef Name="StartDate" /><Value Type="DateTime">'+sReportEndDate +'</Value></Leq></And></Where></Query>',

		    CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='Title' /><FieldRef Name='Region' /><FieldRef Name='Location' /></ViewFields>",
		    completefunc: function (xData, Status) {

		     $(xData.responseXML).SPFilterNode("z:row").each(function() { 
				
				thisItem = new CalendarItem();
				thisItem.id = $(this).attr("ows_ID");
				thisItem.title = $(this).attr("ows_Title");
				thisItem.source = "availability";	
				thisItem.tutor =formatOWSItem($(this).attr("ows_Tutor"),0);

				thisItem.sort = 2;						
				thisItem.url = "/Training/TrainingTeam/Lists/OtherDates/DispForm.aspx?ID="+$(this).attr("ows_ID");

				thisItem.start =  $(this).attr("ows_StartDate");
				thisItem.end = $(this).attr("ows_EndDate");					
				
				thisItem.className = "item_" + thisItem.source;

				aTmp.push(thisItem); 				
					
		      });

		    }
	  	});
	  	  	
	  	return aTmp;

	}

function addResources(dStart,dEnd){
	   

		var thisItem =  new CalendarItem();
		var tmpStr = "";
		var aTmp = [];
		cacheXML:true,
		var sReportStartDate = dStart.getFullYear() +'-' + (dStart.getMonth()+1) +'-' + dStart.getDate();		

		var sReportEndDate = dEnd.getFullYear() +'-' + (dEnd.getMonth()+1) +'-' + dEnd.getDate();
		//console.log('<Query><Where><And><Geq><FieldRef Name="End_x0020_date" /><Value Type="DateTime">'+sReportStartDate +'</Value></Geq><Leq><FieldRef Name="Start_x0020_date" /><Value Type="DateTime">'+sReportEndDate +'</Value></Leq></And></Where>');

		$().SPServices({
		    operation: "GetListItems",
		    async: false,
		    listName: "clinical_resource",
			CAMLQuery: '<Query><Where><And><Geq><FieldRef Name="EndDate" /><Value Type="DateTime">'+sReportStartDate +'</Value></Geq><Leq><FieldRef Name="StartDate" /><Value Type="DateTime">'+sReportEndDate +'</Value></Leq></And></Where></Query>',

		    CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='Title' /><FieldRef Name='Region' /><FieldRef Name='Location' /></ViewFields>",
		    completefunc: function (xData, Status) {

		     $(xData.responseXML).SPFilterNode("z:row").each(function() { 
				
				thisItem = new CalendarItem();
				thisItem.id = $(this).attr("ows_ID");
				thisItem.title = $(this).attr("ows_Title");
				thisItem.source = "resources";			

				thisItem.sort = 4;						
				thisItem.url = "/Training/TrainingTeam/Lists/OtherDates/DispForm.aspx?ID="+$(this).attr("ows_ID");

				thisItem.start =  $(this).attr("ows_StartDate");
				thisItem.end = $(this).attr("ows_EndDate");					
				
				thisItem.className = "item_" + thisItem.source;

				aTmp.push(thisItem); 				
					
		      });

		    }
	  	});
	  	  	
	  	return aTmp;

	}




function addCourses(dStart,dEnd){	   

		var thisItem =  new CalendarItem();
		var tmpStr = "";
		var aTmp = {};
		var sReportStartDate = dStart.getFullYear() +'-' + (dStart.getMonth()+1) +'-' + dStart.getDate();		

		var sReportEndDate = dEnd.getFullYear() +'-' + (dEnd.getMonth()+1) +'-' + dEnd.getDate();
		//console.log('<Query><Where><And><Geq><FieldRef Name="End_x0020_date" /><Value Type="DateTime">'+sReportStartDate +'</Value></Geq><Leq><FieldRef Name="Start_x0020_date" /><Value Type="DateTime">'+sReportEndDate +'</Value></Leq></And></Where>');

		for (var i = 0; i < oFilters.region.dictionary.length; i++){	
			aTmp["region_" + oFilters.region.dictionary[i].id ] = [];
		}	

		$().SPServices({
		    operation: "GetListItems",
		    async: false,
			cacheXML:true,
		    listName: "clinical_course",
			CAMLQuery: '<Query><Where><And><Geq><FieldRef Name="EndDate" /><Value Type="DateTime">'+sReportStartDate +'</Value></Geq><Leq><FieldRef Name="StartDate" /><Value Type="DateTime">'+sReportEndDate +'</Value></Leq></And></Where></Query>',

		    CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='Title' /><FieldRef Name='Region' /><FieldRef Name='Tutors' /><FieldRef Name='CourseType' /><FieldRef Name='Status' /><FieldRef Name='Location' /></ViewFields>",
		    completefunc: function (xData, Status) {

		     $(xData.responseXML).SPFilterNode("z:row").each(function() { 
				
				thisItem = new CalendarItem();
				thisItem.id = $(this).attr("ows_ID");
				thisItem.title = $(this).attr("ows_Title");							
				thisItem.source = "courses";
				thisItem.type = formatOWSItem($(this).attr("ows_CourseType"),0);
				thisItem.status = $(this).attr("ows_Status");
				thisItem.region = formatOWSItem($(this).attr("ows_Region"),0);
				thisItem.location = formatOWSItem($(this).attr("ows_Location"),0);
				thisItem.tutor =  formatOWSItem($(this).attr("ows_Tutors"),0);
				
				thisItem.sort = 3;						
				thisItem.url = "/Training/TrainingTeam/Lists/OtherDates/DispForm.aspx?ID="+$(this).attr("ows_ID");

				thisItem.start =  $(this).attr("ows_StartDate");
				thisItem.end = $(this).attr("ows_EndDate");					
				
				thisItem.className = "item_" + thisItem.source + " item_" + thisItem.status;

				aTmp["region_" + thisItem.region].push(thisItem); 	


					
		      });

		    }
	  	});
	  	  	
	  	return aTmp;

	}
	
	
	function getRegionsArrayFromSP(){
	    console.log("getRegionsArrayFromSP");

		var thisItem = new Object();
		var aRet = new Array();

		$().SPServices({
		    operation: "GetListItems",
		    async: false,		   	    
		    listName: "clinical_region",		   
		    completefunc: function (xData, Status) {
		      $(xData.responseXML).SPFilterNode("z:row").each(function() {			
				thisItem = {
					id:$(this).attr("ows_ID"),
					title:$(this).attr("ows_Title"),					
				};	
				aRet.push(thisItem);
		      });
		    }
		    
	  	});
	  	
	  	return aRet;
	}// end buildFilterDataArray function


	function getLocationsArrayFromSP(){
		console.log("getLocationsArrayFromSP");

		var thisItem = new Object();	
		var aRet = new Array();

		$().SPServices({
		    operation: "GetListItems",
		    async: false,
		    listName: "clinical_location",
		    CAMLQuery: '<Query><OrderBy><FieldRef Name="Title" /></OrderBy></Query>',
		    CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='Title' /><FieldRef Name='Region' /></ViewFields>",
		    completefunc: function (xData, Status) {
		      console.log(xData.responseXML);
		      $(xData.responseXML).SPFilterNode("z:row").each(function() {					thisItem = {
					id:$(this).attr("ows_ID"),
					title:$(this).attr("ows_Title"),
					regionID:formatOWSItem($(this).attr("ows_Region"),0)

				};
				aRet.push(thisItem);
		      });
		    }
	  	});
	  	return aRet;

	}



	function getTutorsArrayFromSP(){
		console.log("getTutorsArrayFromSP");

		var thisItem = new Object();	
		var aRet = new Array();
	
		var sQuery = '<Query><OrderBy><FieldRef Name="Title" /></OrderBy></Query>';
		//console.log("getTutorsArrayFromSP");
		
		
		thisItem = {
			id:"0",
			value:"_unassigned_",
			title:"_unassigned_",					
			regionID:"",
			districtID:""			
		};
		
		//aRet.push(thisItem);	
	
	
		$().SPServices({
		    operation: "GetListItems",
		    async: false,
		    listName: "clinical_tutor",
		    CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='Title' /></ViewFields>",
		    CAMLQuery: sQuery ,
		    completefunc: function (xData, Status) {
		      $(xData.responseXML).SPFilterNode("z:row").each(function() {					
				thisItem = {
					id:$(this).attr("ows_ID"),					
					title:$(this).attr("ows_Title")
				};
								
				aRet.push(thisItem);				
		     
 				});
		    }
	  	});	
		return aRet;
  	}

	function getTypesArrayFromSP(){
	    console.log("getTypesArrayFromSP");
		var thisItem = new Object();
		var aRet = new Array();
			
		$().SPServices({
		    operation: "GetListItems",
		    async: false,
		    listName: "clinical_course_type",
		    CAMLQuery: '<Query><OrderBy><FieldRef Name="Title" /></OrderBy></Query>',
		    CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='Title' /></ViewFields>",
		    completefunc: function (xData, Status) {
		      $(xData.responseXML).SPFilterNode("z:row").each(function() {					
				thisItem = {
					id:$(this).attr("ows_ID"),
					title:$(this).attr("ows_Title")
				};
				aRet.push(thisItem);
		      });
		    }
	  	});
	  	return aRet;

	}	
	
*/	
	