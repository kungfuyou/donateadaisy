/* A simple timer Animation */
var app =  {};
app.textSlides =  {};
app.modal = {};
app.intro = {};
app.helpers = {};
app.pieTimer = {};
app.daisyChain = {};
app.loading = {};
app.donate = {};
app.social = {};
app.fb = {};
app.donateintro = {};
app.footer = {};
app.tooltip = {};
app.total = {};
app.aboutus = {};
app.bgimages = {};

// -------- Helpers ---------  //
(function(){

	var obj = this;

	//Get value of a url parameter
	obj.getURLParameter = function(sParam){

		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');

		for (var i = 0; i < sURLVariables.length; i++)
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam)
			{
				return sParameterName[1];
			}
		}
	};

	//A console ticker to help with timing
	obj.consoleTicker = function(){
		var i = 0;
		var ticker = setInterval(function(){
			i = i + 0.5;
			console.log (i);
		}, 500); 
	};
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
		obj.templateContainer.append(template).css({ 'display' : 'block'});
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

	obj.init = function(container){

		obj.addLoader(container);
	};

	obj.addLoader = function(container){

		var templateSource = $(loadingTemplate).html();
		var template = Handlebars.compile(templateSource);
		var templateContent = template({});
		$(container).append(templateContent);
	}

	obj.removeLoader = function(container){

		$(loadingID, container).velocity({
			opacity : 0 , 
			top : '-50px'
		}, {
			duraion : 400,
			complete : function(){

				$(loadingID, container).remove();
			}
		});
	}
}).apply(app.loading);

// ------- Total Raised --------- //
(function(){
	var obj = this;

	obj.init = function(){

		obj.getTotalRaised();
	};

	obj.getTotalRaised = function(){

		var getTotalRaised = $.ajax({

			url : 'php/getTotal.php',
			contentType : 'application/json',
			error : function(result){
				console.log(result.status + " : " + result.data);
				obj.setRaisedAmount('error');
			},
			success : function(result){
				result = jQuery.parseJSON(result);
				console.log(result.status);
				if(result.status = "success") {
					totalRaised = result.data;
					obj.setRaisedAmount(totalRaised);

				} else {
					console.log('the data did not return in the correct format');
					obj.setRaisedAmount('error');
				}	
			}
		});
	}

	obj.setRaisedAmount = function(totalRaised){
		console.log(totalRaised);
		$('#raisedAmount').html(totalRaised);
	}
}).apply(app.total);

// -------- Daisy Chain --------- //
(function(){

	var obj = this;
	var daisyWrapper = '#daisyChainContainer';
	var rearChain = '#rearChainContainer';
	var daisyChain = '#daisyChain';
	var messageTemplate = '#messageModal';
	var daisyContainerTemplate = '#daisyChainTemplate';
	//var socialPopupClass = '.socialPopup'; // moved
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
	var twitterMessage;

	obj.daisyScroll = {}

	obj.init = function(){

		app.loading.init(app.contentId);
		obj.getDaisyChainJSON();
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
						{ 
							duration : 1000, 
							easing : "easeOutSine", 
							delay : 500,
							complete : function(){

								app.footer.showFooter();
								app.bgimages.init();
							}
						}
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
				speedRatioX: 0.025,
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
		var currentCentre = (viewCentre + (daisyWidth/2) - 130) / daisyWidth; // subtract the offset in padd 452 less the 130px width
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
				app.social.closeShareBubble();
				obj.showDaisyMessage(this);
			}
		});

		$("#daisyChain").on('click' , '.social' , function(){
			
			var clicked = $(this);
			var appendTo = clicked.parent('li');

			if( clicked.hasClass('open') ){
				
				app.social.closeShareBubble();

			} else {

				app.social.closeShareBubble();
				twitterMessage = obj.setTwitterMessage(appendTo);
				app.social.loadShareBubble(clicked, appendTo, twitterMessage);
				app.social.daisyChainShareBubbleAnim(clicked);
			}
		});

		$(".daisy-add-icon , .add .pill").on('click' , function(e){
			e.preventDefault();
			//app.donate.goToDonateUrl();
			if(!app.donate.redirecting){

				app.donate.init();
			}
		})
	}

	obj.addMessageDependencies = function(){
		/* Message Close Button Behaviour */
		$("#messageContainer").on('click' , '.messageButtons .close' , function(){
			app.modal.removeModalContainer();
		});
		/* Message Add Button Behaviour */
		$("#messageContainer").on('click' , '.messageButtons .add' , function(){
			
			app.donate.goToDonateUrl();
		});
		/* Message Share Button Behaviour */
		$("#messageContainer").on('click' , '.messageButtons .social' , function(){

			var clicked = $(this);

			if(clicked.hasClass('open') ){
				
				app.social.closeShareBubble();

			} else {

				app.social.closeShareBubble();
				twitterMessage = obj.setTwitterMessage(clicked);
				app.social.loadShareBubble(clicked , null, twitterMessage);
				app.social.messageShareBubbleAnim(clicked);
			}
		});
	}

	obj.setTwitterMessage = function(appendTo){

		var daisyIndex = obj.getDaisyIndex(appendTo);
		var donationID = obj.getDonationId(daisyIndex);
		var donorDisplayName = obj.getDonorDisplayName(donationID);
		var twitterMessage = donorDisplayName  + " added daisy no." + daisyIndex + " to Cancer Connections daisy chain. Donate a Daisy!"
		return encodeURI(twitterMessage);
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

// -------- Sun and Clouds ------- //
(function(){

	var obj = this;

	obj.init = function(){

		obj.showSun();
		obj.showClouds();
		obj.popDaisies();
	};

	obj.showSun = function(){

		$('#sun').velocity({
			top : 10
		},{
			delay: 500,
			easing : [500, 20]
		});

	}

	obj.showClouds = function(){

		$('#clouds').velocity({
			top : 33
		},{
			delay: 1000,
			easing : [400, 15]
		});

	}

	obj.popDaisies = function(){

		$('#dg1').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] });
		$('#dg2').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 50 });
		$('#dg3').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 100 });
		$('#dg4').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 150 });
		$('#dg5').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 200 });

		$('#dg6').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 250 });
		$('#dg7').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 300 });
		$('#dg8').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 350 });
		$('#dg9').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 400 });
		$('#dg10').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 450 });

		$('#dg11').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 500});
		$('#dg12').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 550 });
		$('#dg13').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 600 });
		$('#dg14').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 650 });
		$('#dg15').velocity({scale: [1, 0]},{ duration: 300 , easing: [100, 10] , delay: 700 });

		
	}
}).apply(app.bgimages);

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

// -------- Simple Donations Integration --------//
(function(){

	var obj = this;
	var appUrl = 'http://donateadaisy.dev';
	var jgUrl = 'http://v3-sandbox.justgiving.com/';
	var shortUrl = 'donateadaisy/';
	var suggestedAmount = 20;
	var currency = 'GBP';
	var exitUrl = encodeURI(appUrl + '?donationId=JUSTGIVING-DONATION-ID');
	var redirectMessage = 'You will now be taken to JustGiving to make your donation';
	var redirecting;
	var timerVal = 5;

	obj.init = function(){

		obj.redirecting = true;
		obj.cacheSelectors();
		obj.setRedirectMessage();
		obj.changeDaisyImage();
		obj.startCountdown();
	}

	obj.cacheSelectors = function(){

		obj.addDaisy = $('#daisyChain li.add');
	}

	obj.setRedirectMessage = function(){

		obj.addDaisy.children('.pill').attr('data-content' , timerVal).addClass('redirect').text('redirect in');
		obj.addDaisy.append("<div id='redirectMessage'>" + redirectMessage + "</div>");
		$('#redirectMessage').velocity('fadeIn' , { duration : 500});
	}

	obj.changeDaisyImage = function(){

		obj.addDaisy.children('.daisy-add-icon').remove().end().children('.daisy').attr({
			'src' : '../img/daisy-head-closed.png' ,
			'style' : 'transform : scale(1)'
		}).css({
			'top' : '-15px',
			'left' : '28px'
		}).end().css({'background-image' : 'url(../img/daisy-stem-r.png)'});

		obj.addDaisy.velocity({opacity : [1 , 0]} , {duration : 400});
	}

	obj.startCountdown = function(){

		var timerVal = $('.redirect').attr('data-content');

		var redirectInterval = setInterval( function(){
			timerVal = timerVal - 1;
			$('.redirect').attr('data-content' , timerVal);
			if (timerVal == 0){
				clearInterval(redirectInterval);
				obj.goToDonateUrl();
			}
		}, 1000);
	}

	obj.goToDonateUrl = function(){

		window.location.href = jgUrl + shortUrl + "4w350m3/donate/?amount=" + suggestedAmount + "&currency=" + currency + "&exitUrl=" + exitUrl;
	}
}).apply(app.donate);

// -------- Donations Intro --------//
(function(){

	var obj = this;
	var donationIntroTemplate = "#donationIntro";
	var templateContainer = "#introBG";
	var twitterMessage = encodeURI("I have just added a daisy to Cancer Connections Daisy Chain! Read my message and add your own");
	obj.container = {};
	obj.addDaisy;

	obj.init = function(donationId){

		obj.getDonationStatus(donationId);
		obj.addDependencies();
	}

	obj.cacheSelectors = function(){

		obj.container = $('#donateAnimation');
	}

	obj.getDonationStatus = function(donationId){

		$(templateContainer).css({'display' : 'block'});
		app.loading.init(templateContainer);

		var donationStatus = $.ajax({

			url : 'php/getDonationStatus.php',
			contentType : 'application/json',
			data : {donationId : donationId},

			error : function(result){

				console.log(result.status + " : " + result.data);
				//need some error handling here
			},

			success : function(result){

				result = jQuery.parseJSON(result);

				if(result.status = "success") {

					console.log(result);
					obj.loadDonationIntro(result.data);

				} else {

					console.log('the data did not return in the correct format');
				}	
			},

			complete : function(){

				app.loading.removeLoader(templateContainer);
			}
		});
	}

	obj.loadDonationIntro = function(donationData) {

		var templateSource = $(donationIntroTemplate).html();
		var template = Handlebars.compile(templateSource);
		var templateContent = template({donation : donationData});
		$(templateContainer).append(templateContent);

		obj.cacheSelectors();
		obj.startDonationIntro();
	}

	obj.startDonationIntro = function(){
		
		obj.container.fadeIn(1000, function(){
			
			$('#donateFlower').velocity({

				backgroundPositionY : '-480px'

			} , {

				easing : [4],
				duration : 1200,
				loop : false,
				delay: 400
			});
			//$(templateContainer).remove();
		});

		$('#donorThanks').velocity({
			translateY : [0 , -50],
			opacity : [1, 0]
		} , {
			delay : 500,
			duration : 1000
		});

		$('#donorMessage').velocity({
			translateY : [0 , -50],
			opacity : [1, 0]
		} , {

			duration : 1000
		});

		$('#butterfly').velocity({
			rotateZ : 30
		}).velocity({
			opacity : [1,0],
			translateY : [0, -20],
			translateX : [0, -10],
			backgroundPositionY : 0
		}, {
			delay : 1600,
			easing : [3],
			duration : 900,
			loop : false
		})
	}

	obj.addDependencies = function(){

		$(templateContainer).on("click" , ".social" , function(e){
			e.preventDefault();
			
			var clicked = $(this);
			var appendTo = clicked.parent();

			if( clicked.hasClass('open') ){
				
				app.social.closeShareBubble();

			} else {

				app.social.closeShareBubble();
				app.social.loadShareBubble(clicked, appendTo, twitterMessage);
				app.social.daisyChainShareBubbleAnim(clicked);
			}
		});

		$(templateContainer).on('click' , "#donate-continue" , function(e){

			e.preventDefault();

			$('#butterfly').velocity({

				backgroundPositionY : -3000,
				top: '-=300px',
				left: '+=100px',
				rotateZ : 0,
				opacity: 0
			},{
				duration: 2000,
				easing: [30],	
			})
			
			var flyButterfly = setTimeout(function(){
				$(templateContainer).addClass('clean-up');
				obj.cleanUp();
				//$(templateContainer).remove();
				clearTimeout(flyButterfly);
			}, 2100);
		});
	}

	obj.cleanUp = function(){

		var byebyeButterfly = setTimeout(function(){
				$(templateContainer).remove();
				clearTimeout(byebyeButterfly);
			}, 500);
	}
}).apply(app.donateintro);

// -------- Social ------------ //
(function(){

	var obj = this;
	var socialPopupClass = '.socialPopup';
	var twitterUrl = encodeURIComponent("http://donateadaisy.org");

	obj.closeShareBubble = function(){

		$('.social').removeClass('open');
		$(socialPopupClass).remove();
	}

	obj.loadShareBubble = function(clicked, appendTo, twitterMessage){
		
		appendTo = appendTo || clicked;
		
		// This moved - needs message sending through
		var templateSource = $(socialPopupTemplate).html();
		var template = Handlebars.compile(templateSource);
		var templateContent = template({
			message : twitterMessage,
			url : twitterUrl
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
	}

	obj.addShareDependencies = function(){
		
		$('.fb').on("click" , function(e){
			console.log('facecook');
			//var fbLoginStatus = app.fb.shareDaisy();
		});

		//Create Twitter Button
		var twitterSelector = document.getElementById('twitterButton');
		twttr.widgets.load(twitterSelector);
	}
}).apply(app.social);

// -------- About Us ----------- //
(function(){

	var obj = this;
	obj.story;

	obj.init = function(){

		obj.getStory();
	};

	obj.getStory = function(){

		var getStory = $.ajax({

			url : 'php/getStory.php',
			contentType : 'application/json',
			error : function(result){
				console.log(result.status + " : " + result.data);
				obj.story = 'ERROR : unable to retrieve data from server';
			},
			success : function(result){

				result = JSON.parse(result);
				console.log(result);

				if(result.status = "success") {

					obj.story = result.data;

				} else {
					console.log('the data did not return in the correct format');
					obj.story = 'ERROR : unable to retrieve data from server';
				}	
			}
		});
	}
}).apply(app.aboutus);

// -------- Footer ------------ //
(function(){

	var obj = this;
	var templateContainer;
	var addClicked;
	var infoContainerWrapper = '#infoContainerWrapper';
	var infoContainer = '#infoContainer';
	var socialContainer = '#socialContainer';
	var infoOpen = false;
	var infoOpenId;
	var socialOpen = false;
	var messageHeight;
	var twitterMessage = encodeURI("Add a daisy to Cancer Connections Daisy Chain in memory of a loved one!");
	var socialContainerHTML = "<div id='socialContainer'></div>";

	obj.init = function() {

		obj.addFooterTemplate();
		obj.addDependencies();

		//remove
		//obj.showFooter();
	};

	obj.cacheSelectors = function(){
	};

	obj.addDependencies = function(){

		$(app.contentId).on("click", "#footerNav li" , function(e){

			var clickedId = $(this).attr('id');
			var callback;
			$('#footerNav li').removeClass('open');
			
			if(infoOpen) {

				$('#footerNav li').removeClass('open');
				if(clickedId != infoOpenId) {

					callback = obj.getCallback(clickedId);
					$(this).addClass('open');
				}

				obj.closeMessage(this, callback);

			} else {
				
				callback = obj.getCallback(clickedId);
				callback();
				$(this).addClass('open');
			}

			infoOpenId = clickedId;
		});

		$(app.contentId).on('click' , '#footerNav .add' , function(){
			//scroll back to start
			if(!addClicked){

				addClicked = true;
				currentX = app.daisyChain.daisyScroll.x;

				$("#daisyChain").velocity({

					translateX : [0, currentX]
				},{
					duration : 750,
					ease : "easeOutQuad",
					complete : function(){

						app.daisyChain.daisyScroll.x = 0;
						app.donate.init();
					}
				});
			}
		});

		$(app.contentId).on('click' , '#infoContainerWrapper .close' , function(){

			obj.closeMessage();
			$('#footerNav li').removeClass('open');
		});
	};

	obj.getCallback = function(clickedId){

		switch (clickedId) {

			case 'footerAdd' :
				callback = obj.addDaisyCallback;
			break;

			case 'footerAbout' :
				callback = obj.addMessageCallback;
			break;

			case 'footerSocial' :
				callback = obj.addSocialCallback;
			break;
		}

		return callback;
	}

	obj.addMessageCallback = function(){

		var templateContainer = $(infoContainer);
		var templateSource = $(aboutUsTemplate).html();
		var template = Handlebars.compile(templateSource);
		var templateContent = template({info : app.aboutus.story});
		$(templateContainer).append(templateContent);
		//app.tooltip.removeToolTip(this);
		messageHeight = 395;
		obj.showMessage();	
	}

	obj.addDaisyCallback = function(){

		console.log('add the daisy stuff');
	}

	obj.addSocialCallback = function(){
		
		var clicked = $('#footerSocial');
		var templateContainer = $(infoContainer);
		messageHeight = 123;

		app.social.loadShareBubble(clicked, templateContainer, twitterMessage);	
		app.social.addShareDependencies();
		obj.showMessage();
	}

	obj.closeSocialContainer = function(){

		$('#footerNav .social').removeClass('open');
		$(socialContainer).velocity(
			{ 
				height : 0,
			},{

				duration: 400,
				complete : function(){
					$(socialContainer).remove();
					socialOpen = false;
				}
			}
		);
	}

	obj.showMessage = function(){

		//$(clicked).addClass('open');
		$(infoContainerWrapper).velocity(
			{ 
				height : [messageHeight, 0],
		
			},{

				duration: 400
			}
		);

		infoOpen = true;
	};

	obj.closeMessage = function(clicked, callback){
		
		$(infoContainerWrapper).velocity(
			{ 
				height : 0,
			},{

				duration: 400,
				complete : function(){

					$(infoContainer).empty();
					if(callback){

						callback();
					}
				}
			}
		);	

		infoOpen = false;
	}

	obj.addFooterTemplate = function(){

		var templateContainer = app.contentId;
		var templateSource = $(footerBarTemplate).html();
		var template = Handlebars.compile(templateSource);
		var templateContent = template();
		$(templateContainer).append(templateContent);	
	};

	obj.showFooter = function(){

		$('#footerBar').velocity({

			height : [80, 0],
			opacity: 1
		},{
			duration: 600,
			complete : function(){

				$('#footerBar').css({overflow : 'visible'});
			}
		});
	};
}).apply(app.footer);

// -------- Tooltips ------------ //
(function(){

	var obj = this;
	var showToolTip;
	var hasToolTip = ".hastooltip";
	var tooltipClear = 5;

	obj.init = function(){

		obj.addDependencies();
	}

	obj.addDependencies = function(){
	
		$(app.contentId).on("mouseenter" , hasToolTip , function(){
			
			if(!$(this).hasClass('open')){
				obj.addToolTip(this);
			}
		});

		$(app.contentId).on("mouseleave click" , hasToolTip , function(){
			
			clearTimeout(showToolTip);
			obj.removeToolTip(this);
			
		});
	}

	obj.addToolTip = function(ele){

		var toolTipText = $(ele).attr('data-tooltip');
		showToolTip = setTimeout(function(){

			templateContainer = ele;
			var templateSource = $(tooltipTemplate).html();
			var template = Handlebars.compile(templateSource);
			var templateContent = template({toolTipText : toolTipText});
			$(templateContainer).append(templateContent);
			clearTimeout(showToolTip);
			obj.showToolTip(ele);
			
		}, 500);	
	}

	obj.showToolTip = function(ele){

		var toolTip = $(ele).children('.tooltip');
		var height = toolTip.outerHeight();


		toolTip.css({'top' : 0 - (height + tooltipClear) + "px"}).velocity({

			opacity : [1, 0],
			scale : [1,0]
		},{
			duration : 200,
			easing : [100, 15]
		});

	}

	obj.removeToolTip = function(ele){

		var toolTip = $(ele).children('.tooltip');

		toolTip.velocity({

			opacity : [0, 1],
			scale : [0,1]
		},{
			duration : 200,
			easing : "easeInQuad",
			complete : function(){
				toolTip.remove();
			}
		});

	}
}).apply(app.tooltip);

// --------  The main app controller --------- //
(function(){

	var obj = this;
	obj.contentId = {};

	obj.init = function(){

		var donationId = app.helpers.getURLParameter('donationId');

		app.textSlides.slides = [
			{id: 1, content : 'Donate a Daisy to Cancer Connections'},
			{id: 2, content : 'Add a Daisy to Our Daisy Chain'},
			{id: 3, content : 'To Support Family of Friends Affected by Cancer'},
			{id: 4, content : 'Or in Memory of a Loved One'},
			{id: 5, content : 'And connect to our Daisy Chain'}
		];

		obj.cacheSelectors();
		app.modal.init();

		if(donationId && donationId != ''){
			//check the status of the donation
			app.donateintro.init(donationId);
			//start the thank you animation
		} else {
			//Start the intro & text Slides
			app.intro.init();
			app.textSlides.init();
		}

		app.daisyChain.init();
		app.total.getTotalRaised();
		app.aboutus.init();
		app.fb.init();
		app.footer.init();
		app.tooltip.init();
	},

	obj.cacheSelectors = function(){

		obj.contentId = $('#content');
	}
}).apply(app);

// --------  The main app controller Stuff to sort --------- //
$(document).ready( function(){

	app.init();
});
