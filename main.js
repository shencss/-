//报单状态传0 维修明细同级 类设备类型传值 不要设备状态
//01电脑 02电视 03冰箱 04空调 05洗衣机 06配件 07其他

//初始化存储对象和渲染对象
var model = Model(),
	render = Render();

//数据初始化
//localStorage.s_equipment = '[{"equipmentId":322,"owner":456,"type":0,"name":"联想笔记本","equipmentTypeId":2,"components":[{"name":"内存条","partId":3221,"startTime":"2018-01-01 00:00:00","endTime":"2018-07-01 00:00:00","status":1},{"name":"显示屏","partId":3222,"startTime":"2018-03-01 00:00:00","endTime":"2018-12-07 00:00:00","status":0}],"history":[{"equipmentId":322,"repairId":8900,"repairingTime":"2018-07-05 10:58:00","companyName":"广州飞元维修公司","cost":"78.00元","description":"无法正常开机"},{"equipmentId":322,"repairId":8901,"repairingTime":"2018-07-06 10:00:00","companyName":"广州飞元维修公司","cost":"102.00元","description":"屏幕闪屏"}]}]';
//	localStorage.s_repair = '[{"userId":456,"repairId":8900,"repairTime":"2018-07-05 10:51:00","repairStatus":4,"equipmentId": 322,"equipmentTypeId":2,"equipmentName":"联想笔记本","description":"无法正常开机","reserveTime":"2018-07-07 17:00:00","companyName":"广州飞元维修公司","phone":"1300000000","address":"华南理工大学B8学院楼101","repairNote":"曾经维修过一次","report":{"completionId":1212,"reportTime":"2018-7-12 14:00:00","repairerId":"4450","equipmentId":"322","description":"主板局部短路，导致无法正常开机","cost":"78元"}},{"userId":457,"repairId":8905,"repairTime":"2018-07-05 10:54:00","repairStatus":0,"equipmentId": 0,"equipmentTypeId":2,"equipmentName":"戴尔笔记本","description":"音响失灵，无法正常播音","reserveTime":"2018-07-08 14:30:00","companyName":"广州飞元维修公司","phone":"13011111111","address":"华南理工大学B8学院楼201","repairNote":"无","report":{}},{"userId":458,"repairId":8907,"repairTime":"2018-07-05 10:58:00","repairStatus":0,"equipmentId": 0,"equipmentTypeId":6,"equipmentName":"惠普显示屏","description":"颜色无法正常显示","reserveTime":"2018-07-06 13:00:00","companyName":"广州葆力维修公司","phone":"13022222222","address":"华南理工大学B8学院楼102","repairNote":"请尽快上门维修","report":{}}]';
//console.log(localStorage.s_equipment);
console.log(JSON.parse(localStorage.s_equipment));

//初始化页面
render.init('.repair-list');

//页面呼出函数
var PageFunc = function (type) {
	if(type == 'repair'){		
		$('.title').text('我的报单');
		$('#nav-repair').css('color','#2196F3').siblings().css('color','#999');
		$('#scan-add-btn').css('visibility','visible').html('<i class="iconfont" id="scan-btn">&#xe722;</i>');	
		render.init('.repair-list');
		$('#take-repair-now').css('bottom','50px');

	}else if(type == 'equipment'){
		$('.title').text('我的设备');
		$('#nav-equipment').css('color','#2196F3').siblings().css('color','#999');
		$('#scan-add-btn').css('visibility','visible').html('<i class="iconfont" id="add-btn">&#xe6df;</i>');
		render.init('.equipment-list');
		$('#take-repair-now').css('bottom','50px');

	}else if(type == 'contact') {
		$('.title').text('联系我们');
		$('#nav-contact').css('color','#2196F3').siblings().css('color','#999');
		$('#scan-add-btn').css('visibility','hidden');
		render.init('.contact');
		$('#take-repair-now').css('bottom','-50px');
	}
};
//初始显示报单页
PageFunc('repair');

//菜单选项切换页面
$('.nav-item').click(function(event) {
	var data = $(this).attr('id');

	switch(data) {
		case 'nav-repair':
			PageFunc('repair');
			break;
		case 'nav-equipment':
			PageFunc('equipment');
			break;
		case 'nav-contact':
			PageFunc('contact');
			break;
		default:
			console.log('no data');
	}
});

//报修单、设备列表渲染器
function Render() {
	var items,item;
	var status = ['受理中','派单中','接单中','维修中','已维修','已取消'];
	var init = function(el) {
		//清空列表
		$(el).html('');	
		//渲染报修单列表
		if(el == '.repair-list'){
			$('#page').html('<ul class="repair-list"><div class="repair-detail"></ul></div>');
			if(localStorage.s_repair) {
				items = getJSONArray('s_repair');
				for(var i=0,len=items.length;i<len;i++){
					item = items[i];
					if(item.repairStatus === 4) {
						$(el).prepend('<li class="repair-item"><span class="item-title" >'+item.repairId+'</span><span class="item-status">'+status[item.repairStatus]+'</span><br><span class="item-time">'+item.equipmentName+' '+item.repairTime.substr(5,11)+'</span><span class="repair-control" data="'+i+'"><button id="checkrepair" >查看</button></span></li>');
					}else {
						$(el).prepend('<li class="repair-item"><span class="item-title" >'+item.repairId+'</span><span class="item-status">'+status[item.repairStatus]+'</span><br><span class="item-time">'+item.equipmentName+' '+item.repairTime.substr(5,11)+'</span><span class="repair-control" data="'+i+'"><button id="checkrepair" >查看</button><button id="cancelrepair">撤销</button></span></li>');
					}
				}
				//渲染后绑定点击事件(避免新渲染的item没有监听事件)
				$('.repair-list').on('click','button',repairControl);							
			}			
		//渲染设备列表		
		}else if(el == '.equipment-list'){
			$('#page').html('<ul class="equipment-list"></ul> <div class="equipment-detail"></div>');			
			if(localStorage.s_equipment) {	
				items = getJSONArray('s_equipment');					
				for(var i=0; i<items.length; i++) {	
					item = items[i]
					$(el).prepend('<li class="equipment-item"><span class="item-title" >'+item.name+'</span><span class="item-status">'+' '+'</span><br><span class="item-time">设备编号:'+item.equipmentId+'</span><span class="equipment-control" data="'+i+'"><button id="checkequipment" >查看</button></span></li>');			
				}
				//渲染后绑定点击事件(避免新渲染的item没有监听事件)
				$('.equipment-list').on('click','button',equipmentControl);
			}	
		//渲染出联系我们页面	
		} else if(el == '.contact') {
			$('#page').html('<div class="contact"><div id="service"><i class="iconfont">&#xe6f0;</i><span>联系客服</span></div><div id="company"><i class="iconfont">&#xe6f0;</i><span>查看维修机构</span></div><div id="complaints"><i class="iconfont">&#xe6e5;</i><span>投诉与建议</span></div><form action="" id="complaints-form" target="frameFile"><i class="iconfont" id="close-btn">&#xe6df;</i><span class="form-title">感谢您的投诉与建议</span><hr><label for="complaints">投诉建议:</label><textarea name="complaints" cols="23" rows="4" placeholder="请输入投诉与建议"></textarea><br><input type="submit" id="complaints-submit" value="提交"></form></div>');
			$('.contact').on('click','div',contactControl);
		} 
	}
	return {
		init: init
	};
}



//数据存储
function Model() {
	//添加报修单
	var addItem = function(type,data) {
		if(localStorage[type]){
			var arr = JSON.parse(localStorage[type]);
			arr.push(data);
			localStorage[type] = JSON.stringify(arr);	
		}
		else{
			localStorage[type] = [data];
		}
		if(type == 's_repair') {	
			render.init('.repair-list');
		}else if(type == 's_equipment') {
			render.init('.equipment-list');
		}
	};
	//删除
	var clearItem = function(type, index) {
		var arr = JSON.parse(localStorage[type]);
		arr.splice(index,1);
		localStorage[type] = JSON.stringify(arr);
		if(type == 's_repair') {	
			render.init('.repair-list');
		}else if(type == 's_equipment') {
			render.init('.equipment-list');
		}
	};
	return {
		addItem:addItem,
		clearItem: clearItem
	};
}

//形成自己的详细信息
var setItemDetail = function(listName,index){
	var status = ['受理中','派单中','接单中','维修中','已维修','已取消'];
	var type = ['家电','电脑','电视','冰箱','空调','配件','其他'];
	var detailItem;
	if(listName == 'repair'){
		if(localStorage.s_repair) {
			detailItem = getJSONArray('s_repair')[index];
		}
		$('.repair-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">订单详细信息</span><hr><div class="table-container"><table><tr><th>订单编号</th><td id="repairId">'+detailItem.repairId+'</td></tr><tr><th>订单时间</th><td id="repairTime">'+detailItem.repairTime+'</td></tr><tr><th>订单状态</th><td id="repairStatus">'+status[detailItem.repairStatus]+'</td></tr><tr><th>设备名称</th><td id="equipmentName">'+detailItem.equipmentName+'</td></tr><tr><th>设备类型</th><td id="equipmentType">'+type[detailItem.equipmentTypeId-1]+'</td><tr><th>维修机构</th><td id="companyName">'+detailItem.companyName+'</td></tr><tr><th>预约时间</th><td id="reserveTime">'+detailItem.reserveTime+'</td></tr><tr><th>维修地址</th><td id="address">'+detailItem.address+'</td></tr><tr><th>联系电话</th><td id="phone">'+detailItem.phone+'</td></tr><tr><th>故障描述</th><td id="description">'+detailItem.description+'</td></tr><tr><th id="repairNote">备注信息</th><td>'+detailItem.repairNote+'</td></tr></table></div><hr><div class="detail-btns"><button id="contactService">联系客服</button></div>');
		if(detailItem.repairStatus != 4){
			$('.detail-btns').append('<button id="cancelrepair">撤销订单</button>');
		}else {
			$('.detail-btns').prepend('<button id="repairAgain">再次报修</button>')
			$('.detail-btns').append('<button id="checkFinish">完工报告</button>');
		}
	}else if(listName == 'equipment'){
		if(localStorage.s_equipment) {
			detailItem = getJSONArray('s_equipment')[index];
		}
		if(detailItem.history !== undefined && detailItem.history.length != 0){
			var history = '';
			for (var i = 0, len = detailItem.history.length; i < len; i++ ) {
				history += '<table id="repair-history"><tr><th>报单编号</th><td>'+detailItem.history[i].repairId+'</td></tr><tr><th>维修时间</th><td>'+detailItem.history[i].repairingTime+'</td></tr><tr><th>维修机构</th><td>'+detailItem.history[i].companyName+'</td></tr><tr><th>故障描述</th><td>'+detailItem.history[i].description+'</td></tr><tr><th>维修费用</th><td>'+detailItem.history[i].cost+'</td></tr></table>'
			}
			$('.equipment-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">设备详细信息</span><hr><div class="table-container"><table><tr><th>设备编号</th><td>'+detailItem.equipmentId+'</td></tr><tr><th>设备名称</th><td>'+detailItem.name+'</td></tr><tr><th>设备类型</th><td>'+type[detailItem.equipmentTypeId - 1]+'</td></tr><tr><th>维修历史</th><td>∨</td></tr></table><div>'+history+'</div></div><hr><div class="detail-btns"><button id="checkWarranty">保修状况</button><button id="repairNow">立即报修</button></div>');
		}else {
			$('.equipment-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">设备详细信息</span><hr><div class="table-container"><table><tr><th>设备编号</th><td>'+detailItem.equipmentId+'</td></tr><tr><th>设备名称</th><td>'+detailItem.name+'</td></tr><tr><th>设备类型</th><td>'+type[detailItem.equipmentTypeId - 1]+'</td></tr><tr><th>维修历史</th><td>无</td></tr></table></div><hr><div class="detail-btns"><button id="checkWarranty">保修状况</button><button id="repairNow">立即报修</button></div>');
		}
	}
}

//在我的订单列表的item中点击control按钮
function repairControl(event){
	event.stopPropagation();
	var repairIndex = $(this).parent().attr('data');
	switch($(this).attr('id'))
	{	//点击查看
		case 'checkrepair':
			setItemDetail('repair',repairIndex);
			$('.cover').fadeIn(100).click(function() {
				$('.cover').unbind().fadeOut(100);
				$('.repair-detail').unbind().fadeOut(100);
				$('.feedback-form').unbind().fadeOut(100);
			});
			$('.repair-detail').fadeIn(100).on('click',function(e){
				e.stopPropagation();
				//捕获以及处理在详细信息上的点击事件
				switch($(e.target).attr('id'))
				{		
					case 'close-btn':
						$('.cover').unbind().fadeOut(100);
						$('.repair-detail').unbind().fadeOut(100);
						break;
					//点击再次报修
					case 'repairAgain':
						$('.cover').unbind();
						$('.repair-detail').unbind().fadeOut(100);
						var item = getJSONArray('s_repair')[repairIndex];
						console.log(item)
						takerepair(e,item.equipmentName,item.equipmentTypeId,item.description,item.companyName,item.phone,item.address,item.repairNote,item.userId,item.equipmentId);
					break;
					//点击撤销报单
					case 'cancelrepair':
						$('.cover').unbind();
						$('.repair-detail').unbind().fadeOut(100);
						$('.prompt').css('bottom','50px').on('click',function(e){
							switch($(e.target).attr('id'))
							{
								case 'cover':
								case 'no':
									$('.prompt').unbind().css('bottom','-150px');
									$('.cover').unbind().fadeOut(100);
									break;
								case 'ok':
								//删除一条报修单
									model.clearItem('s_repair',repairIndex);
									$('.prompt').css('bottom','-150px');
									$('.cover').unbind().fadeOut(200);
									break;
							}					
						});
						break;
					//点击联系客服
					case 'contactService':						
						break;
					//点击查看完工报告
					case 'checkFinish':
						var detailItem = getJSONArray('s_repair')[repairIndex];
						console.log(detailItem)
						$('.repair-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">完工报告信息</span><hr><div class="table-container"><table><tr><th>完工时间</th><td id="repairTime">'+detailItem.report.reportTime+'</td></tr><tr><th>维修机构</th><td id="companyName">'+detailItem.companyName+'</td></tr><tr><th>维修人员</th><td id="repairerIdIdIdIdId">'+detailItem.report.repairerId+'</td></tr><tr><th>维修明细</th><td id="">∨</td><tr></table><div><table id="repair-detail"><tr><th>报单编号</th><td>'+detailItem.repairId+'</td></tr><tr><th>设备编号</th><td>'+detailItem.report.equipmentId+'</td></tr><tr><th>设备故障</th><td>'+detailItem.report.description+'</td></tr><tr><th>维修费用</th><td>'+detailItem.report.cost+'</td></tr></table></div></div><hr><div class="detail-btns"><button id="feedback">我要反馈</button></div>');
						$('.repair-detail').on('click',function(e) {
							switch($(e.target).attr('id'))
							{
								case 'cover':
								case 'close-btn':
									$('.repair-detail').unbind().fadeOut(100);
									$('.cover').unbind().fadeOut(100);
									break;
								//填写反馈
								case 'feedback':
									$('.repair-detail').unbind().fadeOut(100);
									$('.feedback-form').fadeIn(100).on('click',function(e) {
										switch($(e.target).attr('id'))
										{
											case 'close-btn':
												$('.cover').unbind().fadeOut(100);
												$('.feedback-form').unbind().fadeOut(100);
												break;
											case 'feedback-submit':
												//上交反馈
												$('.cover').unbind().fadeOut(100);
												$('.feedback-form').unbind().fadeOut(100);
												break;
										}
									})

									break;
							}
						})
						break;
				}	
			});
			break;
		//点击撤销
		case 'cancelrepair':
			$('.cover').fadeIn(200).click(function() {
				$('.cover').unbind().fadeOut(200);
				$('.prompt').unbind().css('bottom','-150px');
			});
			$('.prompt').css('bottom','50px').on('click',function(e){
				switch($(e.target).attr('id'))
				{
					case 'no':
						$('.cover').unbind().fadeOut(200);
						$('.prompt').unbind().css('bottom','-150px');
						break;
					case 'ok':
					//删除一条报修单
						model.clearItem('s_repair',repairIndex);
						$('.cover').unbind().fadeOut(200);
						$('.prompt').unbind().css('bottom','-150px');
						break;
				}					
			});
			break;		
	}
};

//在我的设备列表的item中点击control按钮
function equipmentControl(event){
	event.stopPropagation();
	var equipmentIndex = $(this).parent().attr('data');
	switch($(this).attr('id'))
	{
		case 'checkequipment':
			setItemDetail('equipment',equipmentIndex);
			$('.cover').fadeIn(100).click(function() {
				$('.cover').unbind().fadeOut(100);
				$('.equipment-detail').unbind().fadeOut(100);
			});
			$('.equipment-detail').fadeIn(100).on('click',function(e){
				e.stopPropagation();
				//捕获以及处理在详细信息上的点击事件
				switch($(e.target).attr('id'))
				{	
					case 'close-btn':
						$('.cover').unbind().fadeOut(100);
						$('.equipment-detail').unbind().fadeOut(100);
						break;
					//立即报修
					case 'repairNow':
						$('.cover').unbind();
						$('.equipment-detail').unbind().fadeOut(100);
						var item = getJSONArray('s_equipment')[equipmentIndex];
						takerepair(undefined,item.name,item.equipmentTypeId);
						break;
					//查看报修状况
					case 'checkWarranty':
						var detailItem = getJSONArray('s_equipment')[equipmentIndex];
						var components = '';
						if (detailItem.components.length > 0) {
							for (var i = 0, len = detailItem.components.length; i < len; i++ ) {
								components += '<table id="equipment-guaranteed"><tr><th>零件名称</th><td>'+detailItem.components[i].name+'</td></tr><tr><th>开始时间</th><td>'+detailItem.components[i].startTime.substr(0,10)+'</td></tr><tr><th>结束时间</th><td>'+detailItem.components[i].endTime.substr(0,10)+'</td></tr><tr><th>保修状态</th><td>'+(detailItem.components[i].status === 0 ? '保修中' : '已过保')+'</td></tr></table>'
							}
						} else {
							components = '无';
						}
						$('.equipment-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">零件保修信息</span><hr><div class="table-container">'+components+'</div><hr></div>');
						break;
				}	
			});
			break;			
	}
};

//在联系我们点击按钮
function contactControl(event) {
	event.stopPropagation();
	switch($(this).attr('id'))
	{
		case 'service':
			break;
		case 'companyName':
			break;
		case 'complaints':
			$('.cover').fadeIn(100).click(function() {
				$('.cover').unbind().fadeOut(100);
				$('.complaints-form').unbind().fadeOut(100);
			  });
			$('.complaints-form').fadeIn(100).on('click',function(e){
				e.stopPropagation();
				//捕获以及处理在详细信息上的点击事件
				switch($(e.target).attr('id'))
				{	
					case 'cover':
					case 'close-btn':
						$('.cover').unbind().fadeOut(100);
						$('.complaints-form').unbind().fadeOut(100);
						break;
					case 'complaints-submit':
						$('.cover').unbind().fadeOut(100);
						$('.complaints-form').unbind().fadeOut(100);
						break;
						
				}	
			});
			break;			
	}
}


//获得repair数据的JSON对象数组函数
function getJSONArray(type) {
	var items = JSON.parse(localStorage[type]);
	return items;
}
//生成唯一单号
function getID() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1).toUpperCase()+(((1+Math.random())*0x10000)|0).toString(16).substring(1).toUpperCase();
}

//生成格式化时间
function formatTime(newDate) {
	var year = newDate.getFullYear();
	var month = (newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1) : (newDate.getMonth() + 1);
	var day = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
	var hours = newDate.getHours() < 10 ? "0" + newDate.getHours() : newDate.getHours();
	var minuts = newDate.getMinutes() < 10 ? "0" + newDate.getMinutes() : newDate.getMinutes();
	var seconds = newDate.getSeconds() < 10 ? "0" + newDate.getSeconds() : newDate.getSeconds();
	return year+"-"+month+"-"+day+" "+hours+":"+minuts+":"+seconds;
}
//报修函数
function takerepair(e,name,type,description,company,phone,address,note,userId,equipmentId,) {
	if (name) {
		$('#repair-form input[name="equipmentName"]').val(name);
		$('#repair-form select[name="equipmentTypeId"]').val(type);
		$('#repair-form textarea[name="description"]').val(description);
		$('#repair-form select[name="companyName"]').val(company);
		$('#repair-form input[name="phone"]').val(phone);
		$('#repair-form input[name="address"]').val(address);
		$('#repair-form textarea[name="repairNote"]').val(note);
	} else {
		$('#repair-form input[name="equipmentName"]').val('');
		$('#repair-form select[name="equipmentTypeId"]').val(1);
		$('#repair-form textarea[name="description"]').val('');
		$('#repair-form select[name="companyName"]').val('广州飞元维修公司');
		$('#repair-form input[name="phone"]').val('');
		$('#repair-form input[name="address"]').val('');
		$('#repair-form textarea[name="repairNote"]').val('');
	}
	$('.cover').fadeIn(100).click(function () {
		$('.cover').unbind().fadeOut(100);
		$('#repair-form').unbind().fadeOut(100);
	});
	$('#repair-form').fadeIn(100).on('click',function(e){
		e.stopPropagation();
		//捕获以及处理在详细信息上的点击事件
		switch($(e.target).attr('id'))
		{	
			case 'cover':
			case 'close-btn':
				$('.cover').unbind().fadeOut(100);
				$('#repair-form').unbind().fadeOut(100);
				break;
			//点击提交报修单
			case 'repair-submit':
				var repairData = {};
				var t = $('#repair-form').serializeArray();
				$.each(t, function () {
			        repairData[this.name] = this.value;
				});
				console.log(repairData);
				//userId是固定的？？？？
				repairData.userId = userId;
				repairData.equipmentId = equipmentId;
			    repairData.repairId = 9999;
				repairData.repairTime = formatTime(new Date());
			    repairData.repairStatus = 0;
				//设置预约时间的格式
				if (repairData.reserveTime !== "") {
					repairData.reserveTime = t[3].value.replace(/T/,' ') + ':00';
				}
				repairData.equipmentTypeId = +repairData.equipmentTypeId;
				repairData.report = {};
			    model.addItem('s_repair',repairData);
			    $('.cover').unbind().fadeOut(100);
				$('#repair-form').unbind().fadeOut(100);
				PageFunc('repair');
				break;
		}	
	});
}
//点击悬浮圆圈报修
$('#take-repair-now').click(takerepair);
//点击添加设备以及扫码
$('#scan-add-btn').click(function(e){
	switch($(this).children().attr('id')){
		case 'add-btn':
			$('.cover').fadeIn(100).click(function() {
				$('.cover').unbind().fadeOut(100);
				$('#equipment-form').unbind().fadeOut(100);
			});
			$('#equipment-form').fadeIn(100).on('click',function(e){
				e.stopPropagation();
				//捕获以及处理在详细信息上的点击事件
				switch($(e.target).attr('id'))
				{	
					case 'cover':
					case 'close-btn':
						$('.cover').unbind().fadeOut(100);
						$('#equipment-form').unbind().fadeOut(100);
						break;
					//点击提交设备
					case 'equipment-submit':
						var equipmentData = {};
						var t = $('#equipment-form').serializeArray();
						$.each(t, function () {
					        equipmentData[this.name] = this.value;
						});
						equipmentData.owner = 456;
						equipmentData.equipmentTypeId = +equipmentData.equipmentTypeId;
						equipmentData.equipmentId = 323;
						equipmentData.type = 0;
						equipmentData.components = [];
					    equipmentData.history = [];
					    model.addItem('s_equipment',equipmentData);
					    $('.cover').unbind().fadeOut(100);
					    $('#equipment-form').unbind().fadeOut(100);
						break;
				}	
			});
			break;
		case 'scan-btn':
	}
});

