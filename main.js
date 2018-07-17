
//初始化存储对象和渲染对象
var model = Model(),
	render = Render();

//数据初始化
localStorage.s_devices = '[{"deviceId":"85FG30UI","deviceName":"联想笔记本","deviceType":"电脑","guaranteed":[{"name":"内存条","startTime":"2018年1月1日","endTime":"2018年7月7日","status":1},{"name":"CPU","startTime":"2018.3.1","endTime":"2018年12月7日","status":0}],"history":[{"billId":"EBE7344E","time":"2018年7月5日10:58","organization":"A公司","money":"78.00元","description":"无法正常开机"},{"billId":"EBE7344E","time":"2018年7月5日10:58","organization":"A公司","money":"78.00元","description":"无法正常开机"}]}]';
localStorage.s_bills = '[{"billId":"EBE7344E","billTime":"2018年7月5日10:51","billStatus":"已完成","deviceName":"联想笔记本","deviceType":"电脑","description":"无法正常开机","Appointment":"2018-07-07","organization":"B公司","phone":"1300000000","address":"华南理工大学B8学院楼101","report":{"finishTime":"2018年7月12日14:00","organization":"B公司","reqairer":"No.001","result":"已完成","detail":{"deviceId":"85FG30UI","description":"主板局部短路，导致无法正常开机","money":"78元"}}},{"billId":"F6C7F2FA","billTime":"2018年7月5日10:53","billStatus":"受理中","deviceName":"惠普显示屏","deviceType":"配件","description":"颜色无法正常显示","Appointment":"2018-07-06","organization":"A公司","phone":"10010","address":"华南理工大学B8学院楼102","report":{}},{"billId":"266852B1","billTime":"2018年7月5日10:54","billStatus":"受理中","deviceName":"戴尔笔记本","deviceType":"电脑","description":"音响失灵，无法正常播音","Appointment":"2018-07-08","organization":"C公司","phone":"10010","address":"华南理工大学B8学院楼201","report":{}}]'
//console.log(localStorage.s_devices);
//console.log(localStorage.s_bills);

//初始化页面
render.init('.bill-list');



//页面呼出函数
var PageFunc = function (type) {
	if(type == 'bills'){		
		$('.title').text('我的报单');
		$('#nav-bills').css('color','#2196F3').siblings().css('color','#999');
		$('#scan-add-btn').css('visibility','visible').html('<i class="iconfont" id="scan-btn">&#xe722;</i>');	
		render.init('.bill-list');
		$('#take-bill-now').css('bottom','50px');

	}else if(type == 'devices'){
		$('.title').text('我的设备');
		$('#nav-devices').css('color','#2196F3').siblings().css('color','#999');
		$('#scan-add-btn').css('visibility','visible').html('<i class="iconfont" id="add-btn">&#xe6df;</i>');
		render.init('.device-list');
		$('#take-bill-now').css('bottom','50px');

	}else if(type == 'contact') {
		$('.title').text('联系我们');
		$('#nav-contact').css('color','#2196F3').siblings().css('color','#999');
		$('#scan-add-btn').css('visibility','hidden');
		render.init('.contact');
		$('#take-bill-now').css('bottom','-50px');
	}
};
//初始显示报单页
PageFunc('bills');

//菜单选项切换页面
$('.nav-item').click(function(event) {
	var data = $(this).attr('id');

	switch(data) {
		case 'nav-bills':
			PageFunc('bills');
			break;
		case 'nav-devices':
			PageFunc('devices');
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
	var init = function(el) {
		//清空列表
		$(el).html('');	
		//渲染报修单列表
		if(el == '.bill-list'){
			$('#page').html('<ul class="bill-list"><div class="bill-detail"></ul></div>');
			if(localStorage.s_bills) {
				items = getJSONArray('s_bills');
				for(var i=0,len=items.length;i<len;i++){
					item = items[i];
					if(item.billStatus === '已完成') {
						$(el).prepend('<li class="bill-item"><span class="item-title" >'+item.billId+'</span><span class="item-status">'+item.billStatus+'</span><br><span class="item-time">'+item.deviceName+' '+item.billTime.substr(5)+'</span><span class="bill-control" data="'+i+'"><button id="checkBill" >查看</button></span></li>');
					}else {
						$(el).prepend('<li class="bill-item"><span class="item-title" >'+item.billId+'</span><span class="item-status">'+item.billStatus+'</span><br><span class="item-time">'+item.deviceName+' '+item.billTime.substr(5)+'</span><span class="bill-control" data="'+i+'"><button id="checkBill" >查看</button><button id="cancelBill">撤销</button></span></li>');
					}
				}
				//渲染后绑定点击事件(避免新渲染的item没有监听事件)
				$('.bill-list').on('click','button',billControl);							
			}			
		//渲染设备列表		
		}else if(el == '.device-list'){
			$('#page').html('<ul class="device-list"></ul> <div class="device-detail"></div>');			
			if(localStorage['s_devices']) {	
				items = getJSONArray('s_devices');					
				for(var i=0; i<items.length; i++) {	
					item = items[i]
					$(el).prepend('<li class="device-item"><span class="item-title" >'+item.deviceName+'</span><span class="item-status">'+' '+'</span><br><span class="item-time">设备编号:'+item.deviceId+'</span><span class="device-control" data="'+i+'"><button id="checkDevice" >查看</button></span></li>');			
				}
				//渲染后绑定点击事件(避免新渲染的item没有监听事件)
				$('.device-list').on('click','button',deviceControl);
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
			var arr = [localStorage[type]];
			arr.push(data);
			localStorage[type] = arr.join('$$');	
		}
		else{
			localStorage[type] = [data];
		}
		if(type == 's_bills') {	
			render.init('.bill-list');
		}else if(type == 's_devices') {
			render.init('.device-list');
		}
	};
	//删除
	var clearItem = function(type, index) {
		var arr = localStorage[type].split('$$');
		arr.splice(index,1);
		localStorage[type] = arr.join('$$');
		if(type == 's_bills') {	
			render.init('.bill-list');
		}else if(type == 's_devices') {
			render.init('.device-list');
		}
	};
	return {
		addItem:addItem,
		clearItem: clearItem
	};
}

//形成自己的详细信息
var setItemDetail = function(listName,index){
	var detailItem;
	if(listName == 'bills'){
		if(localStorage.s_bills) {
			detailItem = getJSONArray('s_bills')[index];
		}
		$('.bill-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">订单详细信息</span><hr><div class="table-container"><table><tr><th>订单编号</th><td id="billId">'+detailItem.billId+'</td></tr><tr><th>订单时间</th><td id="billTime">'+detailItem.billTime+'</td></tr><tr><th>订单状态</th><td id="billStatus">'+detailItem.billStatus+'</td></tr><tr><th>设备名称</th><td id="deviceName">'+detailItem.deviceName+'</td></tr><tr><th>设备类型</th><td id="deviceType">'+detailItem.deviceType+'</td><tr><th>维修机构</th><td id="organization">'+detailItem.organization+'</td></tr><tr><th>预约时间</th><td id="Appointment">'+detailItem.Appointment+'</td></tr><tr><th>维修地址</th><td id="address">'+detailItem.address+'</td></tr><tr><th>联系电话</th><td id="phone">'+detailItem.phone+'</td></tr><tr><th>故障描述</th><td id="description">'+detailItem.description+'</td></tr></table></div><hr><div class="detail-btns"><button id="contactService">联系客服</button></div>');
		if(detailItem.billStatus != '已完成'){
			$('.detail-btns').append('<button id="cancelBill">撤销订单</button>');
		}else {
			$('.detail-btns').prepend('<button id="billAgain">再次报修</button>')
			$('.detail-btns').append('<button id="checkFinish">完工报告</button>');
		}
	}else if(listName == 'devices'){
		if(localStorage.s_devices) {
			detailItem = getJSONArray('s_devices')[index];
		}
		if(detailItem.history !== undefined && detailItem.history.length != 0){
			var history = '';
			for (var i = 0, len = detailItem.history.length; i < len; i++ ) {
				history += '<table id="repair-history"><tr><th>报单编号</th><td>'+detailItem.history[i].billId+'</td></tr><tr><th>维修时间</th><td>'+detailItem.history[i].time+'</td></tr><tr><th>维修机构</th><td>'+detailItem.history[i].organization+'</td></tr><tr><th>故障描述</th><td>'+detailItem.history[i].description+'</td></tr><tr><th>维修费用</th><td>'+detailItem.history[i].money+'</td></tr></table>'
			}
			$('.device-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">设备详细信息</span><hr><div class="table-container"><table><tr><th>设备编号</th><td>'+detailItem.deviceId+'</td></tr><tr><th>设备名称</th><td>'+detailItem.deviceName+'</td></tr><tr><th>设备类型</th><td>'+detailItem.deviceType+'</td></tr><tr><th>维修历史</th><td>∨</td></tr></table><div>'+history+'</div></div><hr><div class="detail-btns"><button id="checkWarranty">保修状况</button><button id="billNow">立即报修</button></div>');
		}else {
			$('.device-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">设备详细信息</span><hr><div class="table-container"><table><tr><th>设备编号</th><td>'+detailItem.deviceId+'</td></tr><tr><th>设备名称</th><td>'+detailItem.deviceName+'</td></tr><tr><th>设备类型</th><td>'+detailItem.deviceType+'</td></tr><tr><th>维修历史</th><td>无</td></tr></table></div><hr><div class="detail-btns"><button id="checkWarranty">保修状况</button><button id="billNow">立即报修</button></div>');
		}
	}
}

//在我的订单列表的item中点击control按钮
function billControl(event){
	event.stopPropagation();
	var billIndex = $(this).parent().attr('data');
	switch($(this).attr('id'))
	{	//点击查看
		case 'checkBill':
			setItemDetail('bills',billIndex);
			$('.cover').fadeIn(100).click(function() {
				$('.cover').unbind().fadeOut(100);
				$('.bill-detail').unbind().fadeOut(100);
				$('.feedback-form').unbind().fadeOut(100);
			});
			$('.bill-detail').fadeIn(100).on('click',function(e){
				e.stopPropagation();
				console.log($(e.target).attr('id'));
				//捕获以及处理在详细信息上的点击事件
				switch($(e.target).attr('id'))
				{		
					case 'close-btn':
						$('.cover').unbind().fadeOut(100);
						$('.bill-detail').unbind().fadeOut(100);
						break;
					//点击撤销报单
					case 'cancelBill':
						$('.cover').unbind();
						$('.bill-detail').unbind().fadeOut(100);
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
									model.clearItem('s_bills',billIndex);
									$('.prompt').css('bottom','-150px');
									$('.cover').unbind().fadeOut(200);
									break;
							}					
						});
						break;
					//点击联系客服
					case 'contactService':						
						break;
					//点击查看完工单
					case 'checkFinish':
						var detailItem = getJSONArray('s_bills')[billIndex];
						$('.bill-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">完工报告信息</span><hr><div class="table-container"><table><tr><th>完工时间</th><td id="repairTime">'+detailItem.report.finishTime+'</td></tr><tr><th>维修机构</th><td id="organization">'+detailItem.report.organization+'</td></tr><tr><th>维修人员</th><td id="repairer">'+detailItem.report.reqairer+'</td></tr><tr><th>维修结果</th><td id="result">'+detailItem.report.result+'</td></tr><tr><th>维修明细</th><td id="">∨</td><tr></table><div><table id="repair-detail"><tr><th>报单编号</th><td>'+detailItem.billId+'</td></tr><tr><th>设备编号</th><td>'+detailItem.report.detail.deviceId+'</td></tr><tr><th>故障描述</th><td>'+detailItem.report.detail.description+'</td></tr><tr><th>维修费用</th><td>'+detailItem.report.detail.money+'</td></tr></table></div></div><hr><div class="detail-btns"><button id="feedback">我要反馈</button></div>');
						$('.bill-detail').on('click',function(e) {
							switch($(e.target).attr('id'))
							{
								case 'cover':
								case 'close-btn':
									$('.bill-detail').unbind().fadeOut(100);
									$('.cover').unbind().fadeOut(100);
									break;
								//填写反馈
								case 'feedback':
									$('.bill-detail').unbind().fadeOut(100);
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
		case 'cancelBill':
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
						model.clearItem('s_bills',billIndex);
						$('.cover').unbind().fadeOut(200);
						$('.prompt').unbind().css('bottom','-150px');
						break;
				}					
			});
			break;		
	}
};

//在我的设备列表的item中点击control按钮
function deviceControl(event){
	event.stopPropagation();
	var deviceIndex = $(this).parent().attr('data');
	switch($(this).attr('id'))
	{
		case 'checkDevice':
			setItemDetail('devices',deviceIndex);
			$('.cover').fadeIn(100).click(function() {
				$('.cover').unbind().fadeOut(100);
				$('.device-detail').unbind().fadeOut(100);
			});
			$('.device-detail').fadeIn(100).on('click',function(e){
				e.stopPropagation();
				//捕获以及处理在详细信息上的点击事件
				switch($(e.target).attr('id'))
				{	
					case 'close-btn':
						$('.cover').unbind().fadeOut(100);
						$('.device-detail').unbind().fadeOut(100);
						break;
					case 'billNow':
						$('.cover').unbind();
						$('.device-detail').unbind().fadeOut(100);
						var item = getJSONArray('s_devices')[deviceIndex];
						takeBill(undefined,item.deviceName,item.deviceType);
						break;
					case 'checkWarranty':
						var detailItem = getJSONArray('s_devices')[deviceIndex];
						var guaranteed = '';
						for (var i = 0, len = detailItem.guaranteed.length; i < len; i++ ) {
							guaranteed += '<table id="device-guaranteed"><tr><th>零件名称</th><td>'+detailItem.guaranteed[i].name+'</td></tr><tr><th>开始时间</th><td>'+detailItem.guaranteed[i].startTime+'</td></tr><tr><th>结束时间</th><td>'+detailItem.guaranteed[i].endTime+'</td></tr><tr><th>保修状态</th><td>'+(detailItem.guaranteed[i].status === 0 ? '保修中' : '已过保')+'</td></tr></table>'
						}
						$('.device-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">零件保修信息</span><hr><div class="table-container">'+guaranteed+'</div><hr></div>');
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
		case 'company':
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


//获得bill数据的JSON对象数组函数
function getJSONArray(type) {
	var items = JSON.parse(localStorage[type]);
	return items;
}
//生成唯一单号
function getID() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1).toUpperCase()+(((1+Math.random())*0x10000)|0).toString(16).substring(1).toUpperCase();
}
//生成当前时间
function getTime() {
	var date = new Date();
	var year = date.getFullYear();
	var month = (date.getMonth()+1);
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	if(hour < 10){
		hour = '0'+hour;
	}
	return year+'年'+month+'月'+day+'日'+hour+':'+minute;
}
//报修函数
function takeBill(e,name,type,description,organization,phone,address) {
	$('#bill-form input[name="deviceName"]').val(name);
	$('#bill-form select[name="deviceType"]').val(type);
	$('#bill-form textarea[name="description"]').val(description);
	$('#bill-form select[name="organization"]').val(organization);
	$('#bill-form input[name="phone"]').val(phone);
	$('#bill-form input[name="address"]').val(address);
	$('.cover').fadeIn(100).click(function () {
		$('.cover').unbind().fadeOut(100);
		$('#bill-form').unbind().fadeOut(100);
	});
	$('#bill-form').fadeIn(100).on('click',function(e){
		e.stopPropagation();
		//捕获以及处理在详细信息上的点击事件
		switch($(e.target).attr('id'))
		{	
			case 'cover':
			case 'close-btn':
				$('.cover').unbind().fadeOut(100);
				$('#bill-form').unbind().fadeOut(100);
				break;
			//点击提交报修单
			case 'bill-submit':
				var billData = {};
			    var t = $('#bill-form').serializeArray();
			    billData.billId = getID();
			    billData.billTime = getTime();
			    billData.billStatus = '受理中';
			    $.each(t, function () {
			        billData[this.name] = this.value;
			    });
			    model.addItem('s_bills',JSON.stringify(billData));
			    $('.cover').unbind().fadeOut(100);
				$('#bill-form').unbind().fadeOut(100);
				PageFunc('bills');
				break;
		}	
	});
}
//点击悬浮圆圈报修
$('#take-bill-now').click(takeBill);
//点击添加设备以及扫码
$('#scan-add-btn').click(function(e){
	switch($(this).children().attr('id')){
		case 'add-btn':
			$('.cover').fadeIn(100).click(function() {
				$('.cover').unbind().fadeOut(100);
				$('#device-form').unbind().fadeOut(100);
			});
			$('#device-form').fadeIn(100).on('click',function(e){
				e.stopPropagation();
				//捕获以及处理在详细信息上的点击事件
				switch($(e.target).attr('id'))
				{	
					case 'cover':
					case 'close-btn':
						$('.cover').unbind().fadeOut(100);
						$('#device-form').unbind().fadeOut(100);
						break;
					//点击提交设备
					case 'device-submit':
						var deviceData = {};
					    var t = $('#device-form').serializeArray();
					    deviceData.deviceId = getID();
					    deviceData.deviceStatus = '未报修';
					    deviceData.history = [];
					    $.each(t, function () {
					        deviceData[this.name] = this.value;
					    });
					    model.addItem('s_devices',JSON.stringify(deviceData));
					    $('.cover').unbind().fadeOut(100);
					    $('#device-form').unbind().fadeOut(100);
						break;
				}	
			});
			break;
		case 'scan-btn':
	}
});

