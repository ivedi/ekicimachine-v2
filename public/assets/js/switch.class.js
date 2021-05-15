				jQuery(function($){
			
				if($.cookie("css")!=null)
				{
					$("#style-schem").attr("href",$.cookie("css"));
				}			
				$("#color-skin a").click(function() {
					$("link#style-schem").attr("href","assets/css/layouts/"+$(this).data('rel')+".css");
					$.cookie("css","assets/css/layouts/"+$(this).data('rel')+".css", {expires: 365});
					
					return false;
				});
				$("#dark-skin a").click(function() {
					$("link#style-schem").attr("href","assets/css/layouts/"+$(this).data('rel')+".css")
					$.cookie("css","assets/css/layouts/"+$(this).data('rel')+".css", {expires: 365});
					
					return false;
				});
				$("a.bg-change").click(function(){
					if($("div#wrapper").css("width")=="1230px")
					{
						$("body").removeClass();
						$("body").addClass($(this).data('rel'));
						
						$.cookie("css-bg",$(this).data('rel'), {expires: 365});
					}
					return false;
				});				
				$("#reset").click(function(){
					$.cookie("css", null);
					$.cookie("css-width", "100");
					$.cookie("css-bg", null);
					setTimeout(function(){
						window.location.reload(true);								
					}, 10);
				});
			});