;(function($){
	//也可以加setting 但是这里懒得写了
	var oneSlide=function(poster){
		var _this=this;
		this.poster=poster;
		this.ul=this.poster.find("#photos");
		this.subs=this.poster.find("#subs");
		this.lis=this.ul.find(".item");
		this.preBtn=this.poster.find("#preBtn");
		this.nextBtn=this.poster.find("#nextBtn");
		this.len=this.lis.size();
		this.curLeft=0;
		this.autoDir="left";//左移

		this.ul.css({"width":this.len*800+"px"});


		this.canLeft=false;
		this.canRight= (this.len>1)?true:false;
		this.Animating=false;

		this.curi=0;//当前图片的下标

		//生成与图片个数相同的圆形图标
		this.generateSubs();
		this.subss.each(function(i){
			$(this).click(function(){
				if(_this.Animating===false){
					_this.moveTo(i);
				}
			});
		});

		//按钮事件
		
		this.preBtn.click(function(){
			if(_this.canLeft===true && _this.Animating===false){
				_this.autoDir="right";
				_this.moveTo(_this.curi-1);
				_this.canLeft= (_this.curi>0)?true:false;
				//到头了 改变方向
				if(_this.canLeft===false){
					window.clearInterval(_this.autoTimer);
					_this.autoDir="left";
					_this.autoPlay();
				}
				_this.canRight=true;
			}
		});
		this.nextBtn.click(function(){
			if(_this.canRight===true && _this.Animating===false){
				_this.autoDir="left";
				_this.Animating=true;
				_this.moveTo(_this.curi+1);
				_this.canRight= (_this.curi<(_this.len-1))?true:false;
				//到头了 改变方向
				if(_this.canRight===false){
					window.clearInterval(_this.autoTimer);
					_this.autoDir="right";
					_this.autoPlay();
				}
				_this.canLeft=true;
			}
		});

		//与animate差不多，在完成后，回调函数
		this.ul.bind("transitionend",function(){
			_this.Animating=false;
		});

		this.autoPlay();
		//如果鼠标放在container上，则不自动播放，否则，自动播放
		this.poster.hover(function(){
			window.clearInterval(_this.autoTimer);
		},function(){
			_this.autoPlay();
		});

	};
	oneSlide.prototype.autoPlay=function(){
		var _this=this;
		if(this.autoDir==="right"){
			this.autoTimer=window.setInterval(function(){
				_this.preBtn.click();
			},3000);
		}
		else if(this.autoDir==="left"){
			this.autoTimer=window.setInterval(function(){
				_this.nextBtn.click();
			},3000);
		}
	};
	oneSlide.prototype.generateSubs=function(){
		for(var i=0;i<this.len;++i){
			this.subs.append("<li class='sub'></li>");
		}
		this.subss=this.subs.children();
		this.subss.eq(this.curi).addClass("cur");
	};
	//从当前页面移动到desi的动画 一副画间隔800px;
	oneSlide.prototype.moveTo=function(desi){
		if(this.curi===desi){
			return;
		}
		else {
			this.Animating=true;
			console.log(desi);
			var gap=(desi-this.curi)*800;
			this.curLeft-=gap;

			//在css里设置transition:left 1s ease-in-out; 然后改变left值效果同
			this.ul.css({"transition":'transform 0.5s linear',"transform":'translate3d(' + this.curLeft + 'px, 0, 0)'});

			// this.ul.css({"left":this.curLeft+"px"});
			this.subAnimation(desi);
		}
	};
	//该函数的curi肯定和desi不同
	oneSlide.prototype.subAnimation=function(desi){
		this.subss.each(function(){
			$(this).removeClass("cur");
		});
		this.subss.eq(desi).addClass("cur");
		this.curi=desi;//将curi改为当前节点
	};
	window["oneSlide"]=oneSlide;
})(jQuery);