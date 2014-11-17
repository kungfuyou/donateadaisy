/* A simple timer Animation */
var app =  {};
app.textSlides =  {};
app.modal = {};
app.intro = {};
app.helpers = {};
app.pieTimer = {};
app.daisyChain = {};
app.loading = {};
app.fb = {};

// -------- Helpers ---------  //
(function(){
	var obj = this;
}).apply(app.helpers);

// ------- Intro Screen --------//
(function(){

	var obj = this;
	obj.templateId = {};
	obj.templateContainer = {};
	obj.container = $();
	obj.flower = {};
	obj.shadow = {};
	obj.textDonate = {};
	obj.textCC = {};
	obj.cleanUpTime = 6000

	app.intro.init = function(){
		//initial cache
		obj.cacheSelectors(false);
		//Load template
		obj.loadTemplate();
		//cache loaded objects
		obj.cacheSelectors(true);
		obj.startAnimation();
	},

	app.intro.cacheSelectors = function(loaded){
		
		if(loaded){

			obj.container = $('#intro');
			obj.flower = $('#introFlower');
			obj.shadow = $('#introShadow');
			obj.textDonate = $('#introDonate');
			obj.textCC = $('#introCC');

		} else {

			obj.templateContainer = $('#introBG');
			obj.templateId = $('#introTemplate');
		}
	},

	app.intro.loadTemplate = function(){

		var templateSource = obj.templateId.html();
		var template = Handlebars.compile(templateSource);
		obj.templateContainer.append(template);
	},

	app.intro.startAnimation = function(){

		obj.container.fadeIn(100, function(){

			$(this).removeClass('is-hidden').addClass('is-visible');

			var startAnim = setTimeout(function(){
				obj.container.removeClass('is-visible');
				clearTimeout(startAnim);
			}, 500);

			var endAnim = setTimeout(function(){
				obj.cleanUpTime();
				clearTimeout(endAnim);
			}, 3500);
		});
	}

	app.intro.cleanUpTime = function(){
		obj.templateContainer.addClass('clean-up');
		//start the slides after the transition (see css) - 500ms
		var startSlideshow = setTimeout(function(){
			app.textSlides.startSlideshow();
			obj.templateContainer.remove();
			clearTimeout(startSlideshow);
		}, 500);
	}
}).apply(app.intro);

// -------- Slides nonsense --------- //
(function(){

	var obj = this;
	obj.slides = [];
	obj.templateId = {};
	textSlidesClass = {};

	app.textSlides.init = function(){
		obj.cacheSelectors();
		obj.dependecies();
		obj.createView();
	},
	app.textSlides.dependecies = function(){
	},
	app.textSlides.cacheSelectors = function() {

		obj.templateId = $('#textSlidesTemplate');
		obj.textSlidesClass = $('.textSlides');
		obj.slideIndicator = $('#slideIndicator');
	},
	app.textSlides.createView = function(){

		//add template to the modal BG DOM
		var templateSource = obj.templateId.html();
		var template = Handlebars.compile(templateSource);
		var templateContent = template({textSlides : obj.slides});
		//Add the modal BG //render to the DOM
		app.modal.addModalContainer();
		app.modal.setModalContent(templateContent);
		app.modal.showModal();
	},
	app.textSlides.startSlideshow = function(){
		var slides = $('.textSlides li');
		var numSlides = slides.length;
		var slideSequence = [];
		var slideDuration = 1000;
		var slideInDuration = 750;
		var slideOutDuration = 500;
		var timerDuration = slideInDuration + slideDuration + slideOutDuration;

		//initialise the timer
		slides.each(function(index){

			var slide = $(this);

			var slideAminIn = 
			{
				elements : slide ,
				properties : 'transition.shrinkIn',
				options : {
					duration : slideInDuration , 
					display: 'block', 
					begin : function(){
						app.pieTimer.init(timerDuration, index);
						obj.setSlideIndicator(numSlides - index);
					}
				}
			};

			var slideAminOut = 
			{
				elements : slide ,
				properties : 'transition.expandOut',
				options : {
					duration : slideOutDuration  , 
					display: 'none' , 
					delay: slideDuration,
					complete : function(){
						if(index == (numSlides - 1)){
							obj.closeSlides();
						}
					}
				}
			};


			slideSequence.push(slideAminIn, slideAminOut);
		});

		$.Velocity.RunSequence(slideSequence);
	},
	app.textSlides.setSlideIndicator = function(slidesLeft){

		$('#slideIndicator').html(slidesLeft);
	},
	app.textSlides.closeSlides = function(){

			app.modal.removeModalContainer();
	}
}).apply(app.textSlides);

// -------- Slides Pie Timer --------- //
(function(){

	var obj = this;
	var duration;
	obj.colours = ['#fff' , '#ffc708'];
	obj.t1 = {};
	obj.t2 = {};
	obj.tr = {};
	obj.startColourIndex = 0;
	obj.endColourIndex = 1;

	app.pieTimer.init = function(duration, index){

		//cache selectors and set the initial state
		obj.cacheSelectors();
		obj.setInitialState(index);
		var duration = duration;
		//Start the animation
		obj.t2
		.velocity({
			rotateZ : ['180deg' , '0deg']
		} , {
			duration : duration/2,
			easing : 'linear',
			complete : function(){
				obj.t1.css({'z-index' : 1 });
				obj.t2.css({'z-index' : 2 });
				obj.tr.children('.mask').css({'border-color' : obj.colours[1]})
			}
		})
		.velocity({
			rotateZ : ['360deg' , '180deg']
		} , {
			duration : duration/2,
			easing : 'linear'
		})
	},

	app.pieTimer.cacheSelectors = function(){

		obj.t1 = $('.t1');
		obj.t2 = $('.t2');
		obj.tr = $('.timer-right');
	},

	app.pieTimer.setInitialState = function(index){
		if(index > 0){
			obj.colours.reverse();
		}
		// initial state
		obj.t1.css({'z-index' : 2});
		obj.t2.css({'z-index' : 1});
		obj.t1.children('.mask').css({'border-color' : obj.colours[0]});
		obj.t2.children('.mask').css({'border-color' : obj.colours[1]})
		obj.tr.children('.mask').css({'border-color' : obj.colours[0]});

		console.log
	}
}).apply(app.pieTimer);

// -------- Modal preparation --------- //
(function(){

	var obj = this;
	obj.modalID = 'modalBG';
	obj.modalIDSelector = '#' + obj.modalID;
	obj.closeButtonSelector = '.button-close';
	obj.contentId = {};
	obj.modalContainer = {};
	obj.modalContentChildren = {};

	app.modal.init = function(){

		obj.cacheSelectors();
	},

	app.modal.cacheSelectors = function(){
		
		obj.contentId = $('#content');
	},

	app.modal.addDependencies = function(){

		$(obj.closeButtonSelector).on('click', function(){
			obj.removeModalContainer();
		})
	}

	app.modal.addModalContainer = function(){
		obj.contentId.append('<div id=' + obj.modalID + '></div>');
		obj.hideModal();
	},

	app.modal.setModalContent = function(modalContent) {
		
		$(obj.modalIDSelector).append(modalContent);
		obj.modalContentChildren = $(obj.modalIDSelector).children();
		obj.hideModalContent();
		obj.addDependencies();
	},

	app.modal.removeModalContainer = function(){

		$(obj.modalIDSelector).velocity({opacity:0},{
			duration: 500,
			complete: function(){
				$(this).remove();
			}
		});
	},

	app.modal.hideModal = function(){

		//$(obj.modalIDSelector).hide();
	},

	app.modal.hideModalContent = function(){

		$.each(obj.modalContentChildren, function(){
			$(this).hide();
		})	
	},

	app.modal.showModal = function(){
		//pop the modal first
		var modal = obj.modalIDSelector;
		var modalTarget = $(obj.modalIDSelector)[0];
		
		$(modal).show().velocity({
			properties : {opacity : 1},
			options : {
				duration: 500,
				complete : function(){
					obj.showModalContent();
				}
			},

		});
	},

	app.modal.showModalContent  = function(){
		//Create an array for the content children
		var childrenSequence = [];

		$.each(obj.modalContentChildren, function(){
			//set the opacity to 0
			$(this).css({
				'margin-top' : '-100px' ,
				opacity : 0
			});
			//get the current top position
			
			var childSequence = {
				elements: $(this), 
				properties : {'margin-top' : 0, opacity: 1}, 
				options : {duration: 300 , display: 'block'}
			};
			childrenSequence.push(childSequence);
		});

		$.Velocity.RunSequence(childrenSequence);
	},

	app.modal.modal = function(content){

		app.modal.addModalContainer();
		app.modal.setModalContent(content);
		app.modal.showModal();
	};
}).apply(app.modal);

// --------- Loading -------------//
(function(){

	var obj = this;
	loadingTemplate = "#loadingChain";
	loadingID = '#loading';

	obj.init = function(){

		obj.addLoader();
	};

	obj.addLoader = function(){

		var templateSource = $(loadingTemplate).html();
		var template = Handlebars.compile(templateSource);
		var templateContent = template({});
		$(app.contentId).append(templateContent);
	}

	obj.removeLoader = function(){

		$(loadingID).velocity({
			opacity : 0 , 
			top : '-50px'
		}, {
			duraion : 400,
			complete : function(){

				$(loadingID).remove();
			}
		});
	}
}).apply(app.loading);

// -------- Daisy Chain --------- //
(function(){

	var obj = this;
	var daisyWrapper = '#daisyChainContainer';
	var rearChain = '#rearChainContainer';
	var daisyChain = '#daisyChain';
	var messageTemplate = '#messageModal';
	var daisyContainerTemplate = '#daisyChainTemplate';
	var socialPopupClass = '.socialPopup';
	var windowWidth;
	var daisyWidth; // adjust for the negative margin
	var startHeightPercent;
	var endHeightPercent;
	var midHeightPercent;
	var diffHeightPercent;
	/* Width */
	var startWidthPercent;
	var endWidthPercent ;
	var midWidthPercent;
	var diffWidthPercent;
	var totalRaised;
	var daisyData = [];

	var isScrolling;

	obj.daisyScroll = {}

	obj.init = function(){

		app.loading.init();
		obj.getDaisyChainJSON();
		obj.getTotalRaised();
	}

	obj.getDaisyChainJSON = function(){

		var getDonationJSON = $.ajax({

			url : 'php/getdonations.php',
			contentType : 'application/json',
			error : function(result){
				console.log(result.status + " : " + result.data);
				//need some error handling here
			},
			success : function(result){
				result = jQuery.parseJSON(result);

				if(result.status = "success") {

					app.loading.removeLoader();

					daisyData = result.data
					// Add the Daisy Chain Container to the DOM
					var templateSource = $(daisyContainerTemplate).html();
					var template = Handlebars.compile(templateSource);
					var templateContent = template({daisies : daisyData});
					$(app.contentId).append(templateContent);


					$('#daisyChain').velocity(
						{ opacity: 1, left: 0 }, 
						{ duration : 1000, easing : "easeOutSine", delay : 500 }
					);

					$('#rearChainContainer').velocity(
						{ opacity: 1, left: 0 },
						{ duration : 1000, easing : "easeOutSine"}
					);

					obj.initDaisyOnScroll();


				} else {

					console.log('the data did not return in the correct format');
				}	
			}
		});
	}

	obj.getTotalRaised = function(){

		var getTotalRaised = $.ajax({

			url : 'php/getTotal.php',
			contentType : 'application/json',
			error : function(result){
				console.log(result.status + " : " + result.data);
				//need some error handling here
			},
			success : function(result){
				result = jQuery.parseJSON(result);

				if(result.status = "success") {
					totalRaised = result.data;
					obj.setRaisedAmount(totalRaised);

				} else {

					console.log('the data did not return in the correct format');
				}	
			}
		});
	}

	obj.initDaisyOnScroll = function(){

		daisyWidth = 320 - 130; // adjust for the negative margin
		/* Height */
		startHeightPercent = 0.5;
		endHeightPercent =  0.9;
		midHeightPercent = (startHeightPercent + endHeightPercent)/2;
		diffHeightPercent = endHeightPercent - midHeightPercent;
		/* Width */
		startWidthPercent = 0.8;
		endWidthPercent =  1;
		midWidthPercent = (startWidthPercent + endWidthPercent)/2;
		diffWidthPercent = endWidthPercent - midWidthPercent;

		// Define the Scroller Object
		obj.daisyScroll = new IScroll(daisyWrapper , {
			
			click: false,
			deceleration: 0.05,
			disableMouse: false,
			disablePointer: false,
			disableTouch: false,
			invertWheelDirection: false,
			keyBindings: false,
			momentum: true, 
			mouseWheel : true,
			probeType: 3,
			scrollbars: false,
			scrollX: true,
			scrollY: false,

			indicators : [{

				el: rearChain,
				fade: false,
				ignoreBoundaries: true,
				interactive: false,
				listenX: true,
				listenY: false,
				resize: false,
				shrink: false,
				speedRatioX: 0.05,
			}]
		});

		obj.resetDaisySize();
		obj.resizeDaisyOnScroll();
		obj.addDaisyDependencies();
	}

	obj.resizeDaisyOnScroll = function(){

		windowWidth = $(window).innerWidth();

		var scrollWidth = -obj.daisyScroll.x;
		var viewCentre = scrollWidth + (windowWidth/2);
		var currentCentre = (viewCentre + (daisyWidth/2) - 70) / daisyWidth; // subtract the offset in padd/margin
		var currentIndex = Math.round(currentCentre);
		var currentZeroIndex = currentIndex - 1;
		var leftRange = currentIndex - 0.5;
		var rightRange = currentIndex + 0.5;
		

		if( currentCentre < currentIndex ){
			var percentFromEdge = (currentCentre - leftRange) * 2 ;
		} else {
			var percentFromEdge =  (rightRange - currentCentre) * 2 ;
		}

		var rightNeighbourPercentFromCentre = (currentCentre - leftRange);
		var leftNeighbourPercentFromCentre = (rightRange - currentCentre );
		
		var newHeight = midHeightPercent + (percentFromEdge * diffHeightPercent);
		var newWidth = midWidthPercent + (percentFromEdge * diffWidthPercent);

		var newRightNeighbourHeight = startHeightPercent + (rightNeighbourPercentFromCentre * diffHeightPercent);
		var newRightNeighbourWidth = startWidthPercent + (rightNeighbourPercentFromCentre * diffWidthPercent);

		var newLeftNeighbourHeight = startHeightPercent + (leftNeighbourPercentFromCentre * diffHeightPercent);
		var newLeftNeighbourWidth = startWidthPercent + (leftNeighbourPercentFromCentre * diffWidthPercent);
		

		$('#daisyChain > li:eq(' + currentZeroIndex + ') .daisy').css({ 'transform' : 'scale(' + newWidth + ',' + newHeight + ')' });
		$('#daisyChain > li:eq(' + (currentZeroIndex + 1) + ') .daisy').css({ 'transform' : 'scale(' + newRightNeighbourWidth + ',' + newRightNeighbourHeight + ')' });
		$('#daisyChain > li:eq(' + (currentZeroIndex - 1) + ') .daisy').css({ 'transform' : 'scale(' + newLeftNeighbourWidth + ',' + newLeftNeighbourHeight + ')' });
	}

	obj.resetDaisySize = function(){

		$('li .daisy', daisyChain).css({ 'transform' : 'scale(' + startWidthPercent + ',' + startHeightPercent + ')' });
	}

	obj.addDaisyDependencies = function(){
		
		var resizeId;

		obj.daisyScroll.on('scroll' , function(){

			obj.resizeDaisyOnScroll();
		});

		obj.daisyScroll.on('scrollStart', function(){
			$(daisyChain).addClass('scrolling');
			isScrolling = true;
		});

		obj.daisyScroll.on('scrollEnd' , function(){
			$(daisyChain).removeClass('scrolling');
			isScrolling = false;
		});

		$(window).on('resize' , function(){
			clearTimeout(resizeId);
			resizeId = setTimeout(obj.resizeDaisyOnScroll, 500);
		});

		$("#daisyChain").on('click' , '.daisy-message , .info .message' , function(){
			
			if(!isScrolling){
				obj.closeShareBubble();
				obj.showDaisyMessage(this);
			}
		});

		$("#daisyChain").on('click' , '.social' , function(){
			
			var clicked = $(this);
			var appendTo = clicked.parent('li');

			if( clicked.hasClass('open') ){
				
				obj.closeShareBubble();

			} else {

				obj.closeShareBubble();
				obj.loadShareBubble(clicked, appendTo);
				obj.daisyChainShareBubbleAnim(clicked);
			}
		});
	}

	obj.addMessageDependencies = function(){
		/* Message Close Button Behaviour */
		$("#messageContainer").on('click' , '.messageButtons .close' , function(){
			app.modal.removeModalContainer();
		});
		/* Message Add Button Behaviour */
		$("#messageContainer").on('click' , '.messageButtons .add' , function(){
			console.log('add');
		});
		/* Message Share Button Behaviour */
		$("#messageContainer").on('click' , '.messageButtons .social' , function(){

			var clicked = $(this);

			if(clicked.hasClass('open') ){
				
				obj.closeShareBubble();

			} else {

				obj.closeShareBubble();
				obj.loadShareBubble(clicked , null);
				obj.messageShareBubbleAnim(clicked);
			}
		});
	}

	obj.addShareDependencies = function(){
		
		

		$('.fb').on("click" , function(e){
			e.stopPropagation();
			console.log('facecook');
			//var fbLoginStatus = app.fb.shareDaisy();
		});

		//Create Twitter Button
		var twitterSelector = document.getElementById('twitterButton');
		twttr.widgets.load(twitterSelector);

		$('.messageButtons li ul li a').on("click" , function(e){
			e.stopPropagation()
			console.log('nightmare too');
			
		});

		
	}

	obj.setRaisedAmount = function(totalRaised){
	
		$('#raisedAmount').html(totalRaised);
	}

	obj.loadShareBubble = function(clicked, appendTo){
		
		appendTo = appendTo || clicked;

		var daisyIndex = obj.getDaisyIndex(appendTo);
		var donationID = obj.getDonationId(daisyIndex);
		var donorDisplayName = obj.getDonorDisplayName(donationID);
		var twitterMessage = donorDisplayName  + " added daisy no." + daisyIndex + " to Cancer Connections daisy chain. Donate a Daisy!"
		var twitterUrl = "http://donateadaisy.org";
		var templateSource = $(socialPopupTemplate).html();
		var template = Handlebars.compile(templateSource);
		var templateContent = template({
			message : encodeURI(twitterMessage),
			url : encodeURIComponent(twitterUrl)
		});

		appendTo.append(templateContent);
		clicked.addClass('open');
	}

	obj.daisyChainShareBubbleAnim = function(clicked){
		
		clicked.siblings(socialPopupClass).velocity({

			opacity : [1 , 0],
			scale: [1, 0]	
		},{
			duration: 300,
			easing: "easeOutQuart",
			complete: function(el){
				//Show the :after arrow
				$(el).css({'overflow' : 'visible'}).delay(1).queue(function(){
					$(this).addClass('visible').dequeue();
				});
				// add button dependencies
				obj.addShareDependencies();
			}
		});
	}

	obj.messageShareBubbleAnim = function(clicked){

		clicked.children(socialPopupClass).velocity(

			"slideDown",
			
			{
				duration: 300,
				easing: "easeOutQuart",
				complete: function(el){
					// add button dependencies
					obj.addShareDependencies();
				}
			}
		)
	};

	obj.closeShareBubble = function(){

		$('.social').removeClass('open');
		$(socialPopupClass).remove();
	}

	obj.showDaisyMessage = function(daisy){

		var daisyIndex = $(daisy).parents('li.daisyContainer').index() - 1;
		var message = daisyData[daisyIndex].message;
		var donationDate = daisyData[daisyIndex].donationDate;
		var donorDisplayName = obj.getDonorDisplayName(daisyIndex);
		var donationID = obj.getDonationId(daisyIndex);
		//add template to the modal BG DOM
		var templateSource = $(messageTemplate).html();
		var template = Handlebars.compile(templateSource);
		var templateContent = template({
			message : message,
			name : donorDisplayName,
			date : donationDate,
			daisyIndex : donationID
		});
		//Fire the modal
		app.modal.modal(templateContent);
		obj.addMessageDependencies();
	}

	obj.getDaisyIndex = function(elem){

		var daisyIndex = elem.attr('data-daisyindex');
		return daisyIndex;
	}

	obj.getDonationId = function(daisyIndex){

		return daisyData.length - daisyIndex;
	}

	obj.getDonorDisplayName = function(index){

		return daisyData[index].donorDisplayName;
	}

}).apply(app.daisyChain);

// -------- FaceBook API --------//
(function(){

	var obj = this;
	var status;
	var accessToken;
	var signedRequest;
	var userID;

	obj.init = function(){

		window.fbAsyncInit = function() {
		   
		   FB.init({
			  appId      : '309471525924684',
			  status 	: true,
			  xfbml      : true,
			  version    : 'v2.2'
			});
		  };

		  (function(d, s, id){
			 var js, fjs = d.getElementsByTagName(s)[0];
			 if (d.getElementById(id)) {return;}
			 js = d.createElement(s); js.id = id;
			 js.src = "//connect.facebook.net/en_US/sdk.js";
			 fjs.parentNode.insertBefore(js, fjs);
		   }(document, 'script', 'facebook-jssdk'));
	}

	obj.shareDaisy = function(){

		FB.getLoginStatus(function(response) {
			obj.checkStatus(response);
		});
	}

	obj.checkStatus = function(response) {

		status = response.status //connected , not_authorized, unknown.
		console.log(status); 

		if(status == 'connected'){

			//Get the auth Response
			authResponse = response.authResponse;
			accessToken = authResponse.accessToken;
			signedRequest = authResponse.signedRequest;
			userID = authResponse.userID;

			console.log('accessToken : ' + accessToken);
			console.log('signedRequest : ' + signedRequest);
			console.log('userID : ' + userID);

			FB.ui({
				method : 'share_open_graph',
				action_type : 'donateadaisy:share',
				action_properties : JSON.stringify({
					//daisy : 'http://samples.ogp.me/309472862591217',
					daisy : 'http://kungfuyou.com/donateadaisy',
					image : 'http://kungfuyou.com/donateadaisy/img/daisy-head.png' ,
					daisy_id : 4,
					message : 'the daisy message goes here',
					title : 'Use this as a title'
				})
			});

			/* FB.api(
				'me/objects/donateadaisy:daisy',
				'post',
				{
					object : {'fb:app_id'	: 309471525924684, 'og:url' : 'http://donateadaisy.dev',
					'og:title' : 'Dasiy Number Whatever',
					'og:type'	: 'donateadaisy:daisy',
					'og:image'	: 'https://fbstatic-a.akamaihd.net/images/devsite/attachment_blank.png',
					'og:description'	: 'my description'}
					
					
				},
				function(response) {
					console.log(response);
				} 
			);*/
		
		} else {

			//prompt login
			FB.login(function(response){

			  console.log(response);
			  
			});
		}

	}
}).apply(app.fb);

// --------  The main app controller --------- //
(function(){

	var obj = this;
	obj.contentId = {};

	obj.init = function(){

		obj.cacheSelectors();
	},

	obj.cacheSelectors = function(){

		obj.contentId = $('#content');
	},

	//A console ticker to help with timing
	obj.consoleTicker = function(){
		var i = 0;
		var ticker = setInterval(function(){
			i = i + 0.5;
			console.log (i);
		}, 500); 
	}
}).apply(app);

// --------  The main app controller Stuff to sort --------- //
$(document).ready( function(){
	//Start the app
	app.init();
	app.modal.init();
	//Set up the intro text slides

	app.textSlides.slides = [
		{id: 1, content : 'Donate a Daisy to Cancer Connections'},
		{id: 2, content : 'Add a Daisy to Our Daisy Chain'},
		{id: 3, content : 'To Support Family of Friends Affected by Cancer'},
		{id: 4, content : 'Or in Memory of a Loved One'},
		{id: 5, content : 'And connect to our Daisy Chain'}
	];

	//Prepare the modal object

	//Start the intro & text Slides
	app.intro.init();
	app.textSlides.init();

	 
	 /* var test = setTimeout(function(){
		app.textSlides.startSlideshow();
	},1000); */


	//Initialise the daisy chain
	app.daisyChain.init();
	app.fb.init();
});

