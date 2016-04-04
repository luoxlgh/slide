;(function($){
	var Carousel = function(poster,settings){
		var _this=this;
		_this.poster=poster;
		_this.settings=settings;
		_this.ul=_this.poster.find("#photos");
		_this.lis=_this.ul.find(".item");
		_this.preBtn=_this.poster.find("#preBtn");
		_this.nextBtn=_this.poster.find("#nextBtn");

		//------------------布局
		//如果是偶数，要加上一个让他成为奇数
		if(_this.lis.size()%2==0){
			_this.ul.append(_this.lis.eq(_this.lis.size()/2).clone());
			_this.lis=_this.ul.children();
		}
		//console.log(_this);
		_this.init();
		
	};
	//初始化位置，按钮事件，自动播放
	Carousel.prototype.init=function(){
		//0 1 2 3 4 5 6 。3为中间
		var len=this.lis.size();
		var middleI=Math.floor(len/2);
		var middleH=this.settings.height;
		var middleW=this.settings.mainW;
		var containerW=this.settings.width;
		//----------container初始化
		this.poster.css({"width":containerW,"height":middleH});
		//两个之间的差值
		var wd=(containerW-middleW)/(len-1);

		var middleZ=middleI*2+1;
		var middlel=(containerW-middleW)/2;
		this.lis.eq(0).css({"z-index":middleZ,"left":middlel+"px","width":middleW+"px","height":middleH+"px"});
		//比上一个图的缩小比例
		var tempr=0.9;
		var align=this.settings.align;
		for(var i=1;i<=middleI;++i){
			var leftItem=this.lis.eq(this.lis.size()-i);
			var rightItem=this.lis.eq(i);
			tempr=tempr*0.9;
			var tempw=tempr*middleW;
			var temph=tempr*middleH;
			if(align==="bottom"){
				var temptop=middleH-temph;
			}
			else if(align==="top"){
				temptop=0;
			}
			else {//默认中间对齐
				temptop=(middleH-temph)/2;
			}

			var templ=middlel-i*wd;
			var opac=1/(i+1);
			leftItem.css({"z-index":middleZ-i,"width":tempw+"px","height":temph+"px","top":temptop+"px","left":templ+"px","opacity":opac});
			rightItem.css({"z-index":middleZ-i,"width":tempw+"px","height":temph+"px","top":temptop+"px","left":middleW+middlel+wd*i-tempw+"px","opacity":opac});
			//console.log(tempw+","+temph+","+temptop+","+templ+",");
		}

		//按钮位置
		this.preBtn.css({"z-index":middleZ+1,"height":middleH/4+"px","width":middleH/8+"px","top":3*middleH/8+"px"});
		this.nextBtn.css({"z-index":middleZ+1,"height":middleH/4+"px","width":middleH/8+"px","top":3*middleH/8+"px"});

		this.canClick=true;//当前按钮可按，动画结束后才可按下一次

		var _this=this;
		//鼠标按了以后，可能改变自动播放的方向
		this.autoDir=this.settings.autoDir;
		this.autoPlay();
		//如果鼠标放在container上，则不自动播放，否则，自动播放
		this.poster.hover(function(){
			window.clearInterval(_this.autoTimer);
		},function(){
			_this.autoPlay();
		});

		//绑定左右按钮事件
		this.preBtn.click(function(){
			if(_this.canClick){
				_this.canClick=false;
				_this.rotate("right");
				_this.autoDir="right";
			}
		});
		this.nextBtn.click(function(){
			if(_this.canClick){
				_this.canClick=false;
				_this.rotate("left");
				_this.autoDir="left";
			}
		});
	};
	Carousel.prototype.autoPlay=function(){
		var _this=this;
		if(this.autoDir==="right"){
			this.autoTimer=window.setInterval(function(){
				_this.preBtn.click();
			},this.settings.autoTime);
		}
		else if(this.autoDir==="left"){
			this.autoTimer=window.setInterval(function(){
				_this.nextBtn.click();
			},this.settings.autoTime);
		}
	};
	Carousel.prototype.rotate=function(dir){
		var _this=this;
		//往左转（每个图片往左一次）
		if(dir==="left"){
			var zIndexArr=[];
			var lastli=this.lis.last();
			this.lis.each(function(){
				var self=$(this);
				//如果是第一个 则前一个是最后一个
				var prev=self.prev().get(0)?self.prev():lastli;
				var width = prev.width();
				var height =prev.height();
				var zIndex = prev.css("zIndex");
				var opacity = prev.css("opacity");
				var left = prev.css("left");
				var top = prev.css("top");
				zIndexArr.push(zIndex);	
				self.animate({
   					width:width,
					height:height,
					opacity:opacity,
					left:left,
					top:top
					},500,function(){
						_this.canClick = true;}
				);
			});
			//zindex的值不要和动画一起赋值，不然中间的页面不会很快显示出来，而回等前一个过去了再显示，很不好看
			this.lis.each(function(i){
				$(this).css("zIndex",zIndexArr[i]);
			});
		}
		else if(dir==="right"){
			var zIndexArr=[];
			
			var firstli=this.lis.first();
			//console.log(this.lis);
			this.lis.each(function(){
				var self=$(this);
				var next=self.next().get(0)?self.next():firstli;
				var width = next.width();
				var height =next.height();
				var zIndex = next.css("zIndex");
				var opacity = next.css("opacity");
				var left = next.css("left");
				var top = next.css("top");
				zIndexArr.push(zIndex);	
				//self.css("z-index",zIndex);
				self.animate({
   					width:width,
					height:height,
					//zIndex:zIndex,
					opacity:opacity,
					left:left,
					top:top
					},500,function(){
						_this.canClick = true;}
				);
			});
			this.lis.each(function(i){
				$(this).css("zIndex",zIndexArr[i]);
			});
		}
	};

	//因为写在闭包里，外面无法访问，所以添加到window下
	window["Carousel"] = Carousel;
})(jQuery);