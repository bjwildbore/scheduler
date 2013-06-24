;(function($){ 
	"use strict";		
	
	var methods = {
		init : function( options ){
			var $this = $(this);								
				$this.opts = $.extend({}, $.fn.fui.defaults, options);
			
			$this.data('filterConfig', $this.opts.filters);
			$this.addClass('fuiFilters');				
			buildFilters($this);
			configureEventHandlers($this);
			applyCookiesAndDefaults($this);
			changeFilterStatus($this);
				
		},		

		getFilterValues: function () {					
			return getCurrentFilterValues($(this));			
        }
		
	};


	function getCurrentFilterValues($this) {
		var aReturn = [],
			i=0,
			filter = {},				
			filters = $($this.data('filterConfig'));
			
		for (i = 0; i < filters.length; i++){	
			filter = filters[i];
			filter.numOptions = filter.options.length;
			
			filter.selectedString = $.cookie('fui_' + filter.id);					
			filter.selectedArray = filter.selectedString.split(',');
			filter.numSelected = filter.selectedArray.length;	
			if(filter.numSelected === filter.numOptions){
				filter.allSelected = true;
			} else {
				filter.allSelected = false;
			}				
			
			aReturn.push(filter);
		}		
		return aReturn;			
	}	
	
	
	function  configureEventHandlers($this){
		
		$this.on("click", "li", function(event){
			var isRequired = false,
			type='',
			items = [],			
			thisLi = $(this),
			filter = thisLi.closest('.fuiFilter');
			//todo add code for radio here
			if(filter.attr('data-multi') === 'true'){
				if (event.ctrlKey){				
					thisLi.removeClass('unselected');
					thisLi.siblings().addClass('unselected');				
				} else {
					isRequired = filter.attr('data-required');
					type = filter.attr('data-type');			
					items = $('.fuiFilter[data-type="'+type+'"] li:not(.unselected):not(.isHidden)').size();
									
					if(isRequired === 'true' && items <= 1 ){					
						thisLi.removeClass('unselected');					
					} else {
						thisLi.toggleClass('unselected');						
					}						
				}
			} else {
				thisLi.removeClass('unselected');
				thisLi.siblings().addClass('unselected');							
			}
			
			adjustFilters($this,thisLi,true);				

            if (typeof $this.opts.onFilterClick === "function") {
                if (!$this.opts.onFilterClick.call(this, $this)) {
                    return false;
                }
            }			
			
		});	

		$this.on("click", ".fuiFilter > div", function(){			
			var parent = $(this).parent();
			parent.children('ul').toggle('fast');
			parent.toggleClass('isOpen');
		});	

		$this.on("click", ".fuiStatusButton", function(){			
			$this.toggleClass('isEnabled');
		});	
		
	}

	function adjustChildrenFilters($this,type,value,parentSelectedValues){
		// loop over any children filters li's
				
		$('.fuiFilter[data-parentfilter="'+type+'"] li').each(function(){		
			var $thisLi = $(this),
			multi = $thisLi.closest('.fuiFilter').attr('data-multi'),
			parentvalue =  $thisLi.attr('data-parent');
			
			if($.inArray(parentvalue , parentSelectedValues ) === -1){ // if parent value not selected Hide Options
				$thisLi.removeClass('unselected');
				$thisLi.addClass('isHidden');				
			} else {
				if($thisLi.hasClass('isHidden')){
					$thisLi.removeClass('isHidden');
					if(multi === "false"){
						$thisLi.addClass('unselected');									
					} else {
						$thisLi.removeClass('unselected');					
					}
				}
				
			}			
			adjustFilters($this,$thisLi,false);
		});	
		
				
		$('.fuiFilter[data-parentfilter="'+type+'"][data-multi="false"] ul').each(function(){
			var thisChild = $(this);
			var unselectedChildren = [];
			var numSelected = thisChild.children('li:not(.isHidden):not(.unselected)').size();
			
			if (numSelected === 0){
				unselectedChildren = thisChild.children(':not(.isHidden)');
				if(unselectedChildren.size() !== 0){
					$(unselectedChildren[0]).removeClass('unselected');
				}
				
			}		
		});			
		
	}
	
	function adjustFilters($this,objLi,isRootLiItem){
		var filter = objLi.closest('.fuiFilter'),
		type = filter.attr('data-type'),		
		value = objLi.attr('data-value'),
		aFilterValues = getFilterListValues(type);				
		
		
		//store the values of selected options in the cookie
		$.cookie('fui_' + type, aFilterValues);		
		
		//filter/hide any children filters options		
		adjustChildrenFilters($this,type,value,aFilterValues);		
		
		//redo the filters status messages
		if(isRootLiItem){
			changeFilterStatus($this);
		}
	}
	
	function changeFilterStatus($this){	
				
		var filters = $this.opts.filters,			
			filter = {},
			unselectedItems = '',
			i = 0;
		
		for (i = 0; i < filters.length; i++){
			filter = filters[i];	
			if(filter.multi){			
				unselectedItems = $('.fuiFilter[data-type="'+filter.id+'"] li:not(.isHidden).unselected').size();
								
				if(unselectedItems > 0){
					$('.fuiFilter[data-type="'+filter.id+'"] span').text('('+ unselectedItems + ' unselected)');
				} else {
					$('.fuiFilter[data-type="'+filter.id+'"] span').text('');
				}
			}
		}
		
	}

	function getFilterListValues(dataType){		
		var aReturn = [],
		listItems = $('.fuiFilter[data-type="'+dataType+'"] li:not(.unselected)');
		
		listItems.each(function(){	
			aReturn.push($(this).attr('data-value'));					
		});	
		
		return aReturn;
	}
	
	function buildFilters($this){
		var sHtml = '',
			sFilters = '',
			i=0,
			j=0,			
			selectedIcon = '',
			unselectedIcon = '',		
			filters = $this.opts.filters,			
			filter = {},
			options = [],
			option = {};			
	
		sHtml += '<div class="fuiTitle"><span>'+$this.opts.title+'</span>';
		
		
		if($this.opts.enabled){
			$this.addClass(' isEnabled ');
		}
			
		
		if($this.opts.allowDisable){
			sHtml += '<div class="fuiStatusButton">';
			sHtml += '<i class="fuiIconEnabled ' + $this.opts.enabledClass+'"> Enabled</i>';
			sHtml += '<i class="fuiIconDisabled '+ $this.opts.disabledClass+'"> Disabled</i>';
			sHtml += '</div>';
		} 
		
		sHtml += '</div>';
		
		for (i = 0; i < filters.length; i++){			
			filter = filters[i];
			
			if(filter.multi){
				selectedIcon = $this.opts.checkSelectedClass;
				unselectedIcon = $this.opts.checkUnselectedClass;
			} else {
				selectedIcon = $this.opts.radioSelectedClass;
				unselectedIcon = $this.opts.radioUnselectedClass;
			}		
	
			sFilters += '<div class="fuiFilter isOpen" data-multi="' + filter.multi + '" data-required="' + filter.required + '" data-type="' + filter.id + '" data-parentfilter="'+filter.parent+'">';
			sFilters += '<div>' + filter.title + ' <span class="liStatus"></span>';
			
			sFilters +='<i class="fuiIconExpand '+$this.opts.expandClass+'"></i>';
			sFilters +='<i class="fuiIconCollapse '+$this.opts.collapseClass+'"></i>';	
			
			sFilters += '</div>';
			sFilters += '<ul>';			
			
			options = filter.options;	
				
			for (j = 0; j < options.length; j++){
				option = options[j];
				sFilters += '<li class=" unselected " ';
				sFilters +='" ';
				sFilters +='data-parent="'+ option.parent +'" ';
				sFilters +='data-value="'+option.value+'">';
				sFilters +='<i class="fuiIconSelected '+selectedIcon+'"></i>';
				sFilters +='<i class="fuiIconUnselected '+unselectedIcon+'"></i>';
				sFilters += option.label+'</li>'; 
			}			
			
			sFilters += '</ul></div>';
		}		
		
		$this.append(sHtml + sFilters);
			
	}// end buildFilters function
	
	function applyCookiesAndDefaults($this){	
		var i=0,			
			cookieKey = '',	
			cookieValues = '',			
			filters = $this.opts.filters,			
			filter = {};		
		
		
		for (i = 0; i < filters.length; i++){			
			filter = filters[i];
			cookieKey = 'fui_' + filter.id;
			cookieValues = $.cookie(cookieKey);	
						
			if(cookieValues === null){				
				setDefaults(filter,cookieKey);								
			} 
			
			cookieValues = $.cookie(cookieKey);					
			applyCookies(filter,cookieValues.split(','));			
		}
		
		checkRequiredFilters($this);
		
	}// end applyCookiesAndDefaults function	
	
	function checkRequiredFilters($this){
		var $requiredFilters = $('#"'+$this.attr('id')+'"][data-required="true"]') ;
		
		$requiredFilters.each(function(){
			var $thisFilter = $(this);
			var $selectedChildren = $thisFilter.find('li:not(.isHidden):not(.unselected)');
			var $unselectedVisibleChildren = $thisFilter.find('li.unselected');
			if($selectedChildren.size() === 0){
				
				if($unselectedVisibleChildren.size() !== 0){
					$($unselectedVisibleChildren[0]).removeClass('unselected');
				}
			}			
		});		
		
	}
	
	function setDefaults(filter,cookieKey){		
		var j=0,
			value = '',		
			tmpValues = [],			
			options = filter.options,
			option = {};	
	
		for (j = 0; j < options.length; j++){
			option = options[j];
			
			if(option.selected === true){				
				tmpValues.push(option.value);
			}
		}
		
		if(!filter.multi && tmpValues.length > 1){
			value = tmpValues[0];
			tmpValues = [];
			tmpValues.push(value);
		}
		
		if(filter.required && tmpValues.length === 0){			
			tmpValues.push(options[0].value);
		}
		
		$.cookie(cookieKey, tmpValues);
		
		
	}
	
	function applyCookies(filter,cookieValues){
		
		var j=0,
			type=filter.id,
			value = '',			
			options = filter.options,
			option = {};
			
		for (j = 0; j < options.length; j++){
			option = options[j];
			value = option.value;
			
			//if its in the array remove the unselected
			if( $.inArray('' + value , cookieValues ) !== -1   ){	
				
				$('.fuiFilter[data-type="'+type+'"] li[data-value="'+value+'"]').removeClass('unselected');					
			} else {
				//else hide any children
				$('.fuiFilter[data-parentfilter="'+type+'"] li[data-parent="'+value+'"]').addClass('isHidden');	
				
			}			
		}			
	}	
	

	$.fn.fui = function(method) { 
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
	};
	
	// plugin defaults - added as a property on our plugin function
	$.fn.fui.defaults = {		
		title: 'Filters',
		filters: [],
		autosetCookies: true,
		radioSelectedClass: 'icon-circle',
		radioUnselectedClass: 'icon-circle-blank',
		checkSelectedClass: 'icon-check-sign',
		checkUnselectedClass: 'icon-check-empty',
		expandClass: 'icon-angle-down',	
		collapseClass: 'icon-angle-up',	
		enabledClass:  'icon-circle',	
		disabledClass: 'icon-ban-circle',			
		status: true,
		allowDisable: true,
		enabled: true,
		onFilterClick: function(){
			return true;
		}		
	};	

})(jQuery);

function fuiFilter (id, title) {
		
		this.id = id;
		this.title = title;
		
		this.required = true;
		this.multi = true;
		this.options = [
			{value:1,label:'a',selected:true},
			{value:2,label:'b',selected:false},
			{value:3,label:'c',selected:false}
		];		
		this.parent = '';	
}


