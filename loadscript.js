$(document).ready(function(){

			var aFilters = loadFilters(); //TODO <- this
			
			$('#filters').fui({	
				filters:aFilters,
				onFilterClick: function(){
					console.log('onFilterCLick');
					var view = $('#scheduler').fullCalendar('getView');
					$('#scheduler').fcman("applyFiltersToView",view,false);
				}
			});
			$('#filters').hide();
			
			
			
			$('#scheduler').fcman({
			
				afterInit: function($this){
				console.log('afterInit');
				/*
					var x = new Date();
					$(this).fcman("prefetchMonth",x,'month');
				*/
				},	
				
				afterFilter: function($this,aFiltered){					
					$('#scheduler').fullCalendar('removeEvents');
					$('#scheduler').fullCalendar('addEventSource', {events: aFiltered });					
					return false;
				},			
			
				retrieveSourceArrays: function(visibleStart,visibleEnd){
					//TODO: this function
					console.log('retrieveSources')
					var oSources = {};
					oSources.courses = [];
					oSources.events = [];
					oSources.dates = [],
					newDate = new Date();					
					
					
					for (i = 0; i < 30; ++i) {
						newDate = new Date();
						newDate.setDate(1+i);
						thisItem = new CalendarItem();
						thisItem.id = 'a'+i;
						thisItem.title = 'a'+i;
						thisItem.code = 'a'+i;
						
						thisItem.sourceID = 'courses';
						thisItem.region = ['1'];
						thisItem.location = ['akl'];
						thisItem.category = ['23'];

						
						thisItem.start = newDate;
						thisItem.end = newDate;
						
						console.log('thisItem',thisItem)
					
						oSources.courses.push(thisItem);
					}
					
					return oSources;
				},		
				
				retrieveFilterObjects: function($this){		
					console.log('retrieveFilterObjects');
					var aFilters = $('#filters').fui('getFilterValues'),
						i=0,
						obj = {},
						len = aFilters.length,
						oParsedFilters = {};
					
					for (i = 0; i < len; i++){
						obj = aFilters[i];
						oParsedFilters[obj.id] = obj;
					}
					console.log(oParsedFilters);
					return oParsedFilters;
				}	
			
			});
			
			
			$('#scheduler').fullCalendar({
				height:500,	
				firstDay:1,
				editable:false,
				//year: getCalYear(),
				//month:getCalMonth(),
				//date:getCalDate(),
				viewDisplay: function(view) {
					// $("#jumpTool").appendTo("td.fc-header-center");
					console.log('viewDisplay');
					$('#scheduler').fcman("applyFiltersToView",view,false);
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
			

			

$('#scheduler .fc-header-right').append('<span class="fc-button fc-button-filter fc-state-default fc-corner-left fc-corner-right fc-state-disabled" style="">Filters</span>');			

$('#filters .fuiTitle').append('<div class="fuiCloseButton"><i class="icon-chevron-up"> Hide</i></div>');
			
			
$('.fc-button-filter').click(function(){
	$('#filters').slideToggle('fast');
});

$(".fuiCloseButton").click(function(){			
	$('#filters').slideToggle('fast');
});	
			
			

});

	