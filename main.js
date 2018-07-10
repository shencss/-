
//初始化存储对象和渲染对象
var model = Model(),
	render = Render();

//数据初始化
//localStorage.s_devices = '{"deviceId":"85FG30UI","deviceStatus":"已维修","deviceName":"联想笔记本","deviceType":"电脑","histroy":[{"time":"2018年7月5日10:58","organization":"A公司","money":"78.00元","description":"无法正常开机"}]}';
//localStorage.s_bills = '{"billId":"EBE7344E","billTime":"2018年7月5日10:51","billStatus":"已完成","deviceName":"联想笔记本","deviceType":"电脑","description":"无法正常开机","Appointment":"2018-07-07","organization":"B公司","phone":"1300000000","address":"华南理工大学B8学院楼101"}$${"billId":"F6C7F2FA","billTime":"2018年7月5日10:53","billStatus":"受理中","deviceName":"惠普显示屏","deviceType":"配件","description":"颜色无法正常显示","Appointment":"2018-07-06","organization":"A公司","phone":"10010","address":"华南理工大学B8学院楼102"}$${"billId":"266852B1","billTime":"2018年7月5日10:54","billStatus":"受理中","deviceName":"戴尔笔记本","deviceType":"电脑","description":"音响失灵，无法正常播音","Appointment":"2018-07-08","organization":"C公司","phone":"10010","address":"华南理工大学B8学院楼201"}'
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
		if(el=='.bill-list'){
			$('#page').html('<ul class="bill-list"></ul><div class="bill-detail"></div>');
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
				//渲染后绑定点击事件
				$('.bill-list').on('click','button',billControl);				
			}			
		//渲染设备列表		
		}else if(el=='.device-list'){
			$('#page').html('<ul class="device-list"></ul> <div class="device-detail"></div>');			
			if(localStorage['s_devices']) {	
				items = getJSONArray('s_devices');					
				for(var i=0; i<items.length; i++) {	
					item = items[i]
					$(el).prepend('<li class="device-item"><span class="item-title" >'+item.deviceName+'</span><span class="item-status">'+item.deviceStatus+'</span><br><span class="item-time">设备编号:'+item.deviceId+'</span><span class="device-control" data="'+i+'"><button id="checkDevice" >查看</button></span></li>');			
				}
				//渲染后绑定点击事件
				$('.device-list').on('click','button',deviceControl);
			}		
		} else if(el== '.contact') {
			$('#page').html('<div class="contact"><div class="service"><i class="iconfont">&#xe6f0;</i><span>联系客服</span></div><div class="company"><i class="iconfont">&#xe6f0;</i><span>查看维修机构</span></div><div class="complaints"><i class="iconfont">&#xe6e5;</i><span>投诉与建议</span></div></div>');
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

//形成自己的订单详细信息
var setItemDetail = function(listName,index){
	var detailItem;
	if(listName == 'bills'){
		if(localStorage.s_bills) {
			detailItem = getJSONArray('s_bills')[index];
		}
		$('.bill-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">订单详细信息</span><hr><div class="table-container"><table><tr><th>订单编号</th><td id="billId">'+detailItem.billId+'</td></tr><tr><th>订单时间</th><td id="billTime">'+detailItem.billTime+'</td></tr><tr><th>订单状态</th><td id="billStatus">'+detailItem.billStatus+'</td></tr><tr><th>设备名称</th><td id="deviceName">'+detailItem.deviceName+'</td></tr><tr><th>设备类型</th><td id="deviceType">'+detailItem.deviceType+'<tr><th>维修机构</th><td id="organization">'+detailItem.organization+'</td></tr><tr><th>预约时间</th><td id="Appointment">'+detailItem.Appointment+'</td></tr><tr><th>维修地址</th><td id="address">'+detailItem.address+'</td></tr><tr><th>联系电话</th><td id="phone">'+detailItem.phone+'</td></tr><tr><th>故障描述</th><td id="description">'+detailItem.description+'</td></tr></table></div><hr><div class="detail-btns"><button id="billAgain">再次报修</button><button id="checkFinish">查看完工单</button><button id="contactService">联系客服</button></div>');
		if(detailItem.billStatus != '已完成'){
		$('.detail-btns').append('<button id="cancelBill">撤销订单</button>');
		}
	}else if(listName == 'devices'){
		if(localStorage.s_devices) {
			detailItem = getJSONArray('s_devices')[index];
		}
		if(detailItem.histroy !== undefined && detailItem.histroy.length != 0){
			$('.device-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">设备详细信息</span><hr><div class="table-container"><table><tr><th>设备编号</th><td>'+detailItem.deviceId+'</td></tr><tr><th>设备名称</th><td>'+detailItem.deviceName+'</td></tr><tr><th>设备类型</th><td>'+detailItem.deviceType+'</td></tr><tr><th>维修历史</th><td>∨</td></tr></table><div id="histroy"><table id="device-histroy"><tr><th>维修时间</th><td>'+detailItem.histroy[0].time+'</td></tr><tr><th>维修机构</th><td>'+detailItem.histroy[0].organization+'</td></tr><tr><th>故障描述</th><td>'+detailItem.histroy[0].description+'</td></tr><tr><th>维修费用</th><td>'+detailItem.histroy[0].money+'</td></tr></table><table id="device-histroy"><tr><th>维修时间</th><td>'+detailItem.histroy[0].time+'</td></tr><tr><th>维修机构</th><td>'+detailItem.histroy[0].organization+'</td></tr><tr><th>故障描述</th><td>'+detailItem.histroy[0].description+'</td></tr><tr><th>维修费用</th><td>'+detailItem.histroy[0].money+'</td></tr></table><table id="device-histroy"><tr><th>维修时间</th><td>'+detailItem.histroy[0].time+'</td></tr><tr><th>维修机构</th><td>'+detailItem.histroy[0].organization+'</td></tr><tr><th>故障描述</th><td>'+detailItem.histroy[0].description+'</td></tr><tr><th>维修费用</th><td>'+detailItem.histroy[0].money	+'</td></tr></table><table id="device-histroy"><tr><th>维修时间</th><td>'+detailItem.histroy[0].time+'</td></tr><tr><th>维修机构</th><td>'+detailItem.histroy[0].organization+'</td></tr><tr><th>故障描述</th><td>'+detailItem.histroy[0].description+'</td></tr><tr><th>维修费用</th><td>'+detailItem.histroy[0].money	+'</td></tr></table><table id="device-histroy"><tr><th>维修时间</th><td>'+detailItem.histroy[0].time+'</td></tr><tr><th>维修机构</th><td>'+detailItem.histroy[0].organization+'</td></tr><tr><th>故障描述</th><td>'+detailItem.histroy[0].description+'</td></tr><tr><th>维修费用</th><td>'+detailItem.histroy[0].money+'</td></tr></table><table id="device-histroy"><tr><th>维修时间</th><td>'+detailItem.histroy[0].time+'</td></tr><tr><th>维修机构</th><td>'+detailItem.histroy[0].organization+'</td></tr><tr><th>故障描述</th><td>'+detailItem.histroy[0].description+'</td></tr><tr><th>维修费用</th><td>'+detailItem.histroy[0].money+'</td></tr></table></div></div><hr><div class="detail-btns"><button id="checkWarranty">查看保修状况</button><button id="billNow">立即报修</button></div>');
		}else {
			$('.device-detail').html('<i class="iconfont" id="close-btn">&#xe6df;</i><span class="table-title">设备详细信息</span><hr><div class="table-container"><table><tr><th>设备编号</th><td>'+detailItem.deviceId+'</td></tr><tr><th>设备名称</th><td>'+detailItem.deviceName+'</td></tr><tr><th>设备类型</th><td>'+detailItem.deviceType+'</td></tr><tr><th>维修历史</th><td>无</td></tr></table></div><hr><div class="detail-btns"><button id="checkWarranty">查看保修状况</button><button id="billNow">立即报修</button></div>');
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
			$('.cover').fadeIn(100);
			$('.bill-detail').fadeIn(100);
			console.log($('.bill-list').html());	
			$('#app').on('click',function(e){
				e.stopPropagation();
				//捕获以及处理在详细信息上的点击事件
				switch($(e.target).attr('id'))
				{	
					case 'cover':
					case 'close-btn':
						$('.cover').fadeOut(100);
						$('.bill-detail').fadeOut(100);
						$('#app').unbind();
						break;
					//点击再次报修
					case 'billAgain':
						var item = getJSONArray('s_bills')[billIndex];
						$('.bill-detail').fadeOut(100);
						takeBill(undefined,item.deviceName,item.deviceType,item.description,item.organization,item.phone,item.address);
						break;
					//点击撤销报单
					case 'cancelBill':
						$('.bill-detail').fadeOut(100);
						$('.cover').fadeIn(100);
						$('.prompt').css('bottom','50px');
						$('#app').on('click',function(e){
							switch($(e.target).attr('id'))
							{
								case 'cover':
								case 'no':
									$('.cover').fadeOut(100);
									$('.prompt').css('bottom','-150px');
									$('#app').unbind();
									break;
								case 'ok':
								//删除一条报修单
									model.clearItem('s_bills',billIndex);
									$('.cover').fadeOut(100);
									$('.prompt').css('bottom','-150px');
									$('#app').unbind();
									break;
							}					
						});
						break;
					//点击联系客服
					case contactService:
						break;
					//点击查看完工单
					case checkFinish:
						break;
				}	
			});
			break;
		//点击撤销
		case 'cancelBill':
			$('.cover').fadeIn(100);
			$('.prompt').css('bottom','50px');
			$('#app').on('click',function(e){
				switch($(e.target).attr('id'))
				{
					case 'cover':
					case 'no':
						$('.cover').fadeOut(100);
						$('.prompt').css('bottom','-150px');
						$('#app').unbind();
						break;
					case 'ok':
					//删除一条报修单
						model.clearItem('s_bills',billIndex);
						$('.cover').fadeOut(100);
						$('.prompt').css('bottom','-150px');
						$('#app').unbind();
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
			$('.cover').fadeIn(100);
			$('.device-detail').fadeIn(100);
			$('#app').on('click',function(e){
				e.stopPropagation();
				//捕获以及处理在详细信息上的点击事件
				switch($(e.target).attr('id'))
				{	
					case 'cover':
					case 'close-btn':
						$('.cover').fadeOut(100);
						$('.device-detail').fadeOut(100);
						$('#app').unbind();
						break;
					case 'billNow':
						var item = getJSONArray('s_devices')[deviceIndex];
						$('.cover').fadeOut(100);
						$('.device-detail').fadeOut(100);
						takeBill(undefined,item.deviceName,item.deviceType);
						break;
				}	
			});
			break;			
	}
};


//获得bill数据的JSON对象数组函数
function getJSONArray(type) {
	var items = localStorage[type].split('$$').map(function(item) {
		return JSON.parse(item);
	});
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
	$('#bill-form').fadeIn(100);
	$('.cover').fadeIn(100);
	$('#app').on('click',function(e){
		e.stopPropagation();
		//捕获以及处理在详细信息上的点击事件
		switch($(e.target).attr('id'))
		{	
			case 'cover':
			case 'close-btn':
				$('.cover').fadeOut(100);
				$('#bill-form').fadeOut(100);
				$('#app').unbind();
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
			    $('.cover').fadeOut(100);
			    $('#bill-form').fadeOut(100);
			    $('#app').unbind();
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
			$('.cover').fadeIn(100);
			$('#device-form').fadeIn(100);
			$('#app').on('click',function(e){
				e.stopPropagation();
				//捕获以及处理在详细信息上的点击事件
				switch($(e.target).attr('id'))
				{	
					case 'cover':
					case 'close-btn':
						$('.cover').fadeOut(100);
						$('#device-form').fadeOut(100);
						$('#app').unbind();
						break;
					//点击提交设备
					case 'device-submit':
						var deviceData = {};
					    var t = $('#device-form').serializeArray();
					    deviceData.deviceId = getID();
					    deviceData.deviceStatus = '未报修';
					    deviceData.histroy = [];
					    $.each(t, function () {
					        deviceData[this.name] = this.value;
					    });
					    model.addItem('s_devices',JSON.stringify(deviceData));
					    $('.cover').fadeOut(100);
					    $('#device-form').fadeOut(100);
					    $('#app').unbind();
						break;
				}	
			});
			break;
		case 'scan-btn':
	}
});

