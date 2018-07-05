
//初始化存储对象和渲染对象
var model = Model(),
	render = Render();

//清空数据



//初始化
render.init('.bill-list');
render.init('.device-list');
//上升报修按钮



//点击提交报修单
var submitBtn = $('#submit');
submitBtn.click(function(){
	var billData = {};
	var deviceData = {};
    var t = $('form').serializeArray();
    billData.billId = getID();
    billData.billTime = getTime();
    billData.billStatus = '受理中';
    deviceData.deviceId = getID();
    deviceData.deviceTime = getTime();
    deviceData.deviceStatus = '报单受理中';
    $.each(t, function () {
        billData[this.name] = this.value;
    });
    deviceData.deviceName = t[0].value;
    deviceData.deviceType = t[1].value;
    deviceData.deviceStaff = 'No.001';
    deviceData.description = t[2].value;
    model.addBill(JSON.stringify(billData));
    model.addDevice(JSON.stringify(deviceData));

});



//导航呼出页面种类
var MenuItemFunc = (function () {
	var listPage = function(type) {
		if(type=='bills'){		
			$('.title').text('我的报单');
			$('#scan-add-btn').html('<i class="iconfont" id="scan-btn">&#xe722;</i>');
			$('form').fadeOut(100);
			$('.back-btn').fadeOut(10);
			$('.device-list').fadeOut(10);
			$('.contact').fadeOut(10);
			$('.bill-list').fadeIn(10);
			$('.take-bill').css('bottom','50px');

		}else if(type=='devices'){
			$('.title').text('我的设备');
			$('#scan-add-btn').html('<i class="iconfont" id="scan-btn">&#xe6df;</i>');
			$('form').fadeOut(100);
			$('.back-btn').fadeOut(10);
			$('.bill-list').fadeOut(10);
			$('.device-list').fadeIn(10);
			$('.contact').fadeOut(10);
			$('.take-bill').css('bottom','50px');
		}
	};

	var contact = function() {
		$('.title').text('联系我们');
		$('#scan-add-btn').html('<i class="iconfont" id="scan-btn">&#xe722;</i>');
		$('form').fadeOut(100);
		$('.back-btn').fadeOut(10);
		$('.device-list').fadeOut(10);
		$('.bill-list').fadeOut(10);
		$('.contact').fadeIn(10);
		$('.take-bill').css('bottom','-50px');
	};
	return {
		listPage: listPage,
		contact:contact
	};
})();

//菜单选项调用页面
$('.nav-item').click(function(event) {
	var data = $(this).attr('id');
	$(this).siblings().css('color','#999');
	$(this).css('color','#2196F3');
	switch(data) {
		case 'bills':
			MenuItemFunc.listPage('bills');
			break;
		case 'devices':
			MenuItemFunc.listPage('devices');
			break;
		case 'contact':
			MenuItemFunc.contact();
			break;
		default:
			console.log('no data');
	}
});

//报修单、设备列表渲染器
function Render() {
	var items,
		itemTitle,
		itemHTML='';
	var init = function(el) {
		//清空列表
		$(el).html('');	
		//渲染报修单列表
		if(el=='.bill-list'){
			if(localStorage.s_bills) {
				items = localStorage.s_bills.split('$$');
				for(var i=0,len=items.length;i<len;i++){
					item = JSON.parse(items[i]);			
					$(el).prepend('<li class="bill-item"><span class="item-title" >'+item.billId+'</span><span class="item-status">'+item.billStatus+'</span><br><span class="item-time">'+item.deviceName+' '+item.billTime.substr(5)+'</span><span class="bill-control" data="'+i+'"><button id="checkBill" >查看</button><button id="cancelBill">撤销</button></span></li>');
				}				
			}			
		//渲染设备列表		
		}else if(el=='.device-list'){			
			if(localStorage['s_devices']) {	
				items = localStorage.s_devices.split('$$');						
				for(var i=1; i<items.length; i++) {	
					item = JSON.parse(items[i]);		
					$(el).prepend('<li class="device-item"><span class="item-title" >'+item.deviceName+'</span><span class="item-status">'+item.deviceStatus+'</span><br><span class="item-time">设备编号:'+item.deviceId+'</span><span class="bill-control" data="'+i+'"><button id="checkBill" >查看</button></span></li>');
				}

			}
			
		}
	}
	return {
		init: init
	};
}

//数据存储
function Model() {
	//添加报修单
	var addBill = function(b) {
		
		if(localStorage.s_bills){
			var arr = [localStorage.s_bills];
			arr.push(b);
			localStorage.s_bills = arr.join('$$');	
		}
		else{
			localStorage.s_bills = [b];
		}		
		render.init('.bill-list');
	};
	var addDevice = function(b) {
		alert(localStorage.s_devices);
		if(localStorage.s_devices){
			var arr = [localStorage.s_devices];
			arr.push(b);
			localStorage.s_devices = arr.join('$$');	
		}else{
			alert(b);
			localStorage.s_devices = [b];
			alert(localStorage.s_devices);

		}		
		render.init('.device-list');	
	};
	//删除
	var clearItem = function(list, i) {
		var arr;
		if(list == 'bills') {
			arr = localStorage.s_bills.split('$$');
			arr.splice(i,1);
			localStorage.s_bills = arr.join('$$');
			render.init('.bill-list');
		}else if(list == 'devices') {
			arr = localStorage.s_devices.split('$$');
			arr.splice(i,1);
			localStorage.s_devices = arr.join('$$');
			render.init('.device-list');
		}

	};
	return {
		addBill: addBill,
		addDevice: addDevice,
		clearItem: clearItem
	};
}

//形成自己的订单详细信息
var setItemDetail = function(listName,index){
	var detailItem;
	if(listName == 'bills'){
		if(localStorage.s_bills) {
			detailItem = JSON.parse(localStorage.s_bills.split('$$')[index]);
		}
		$('.bill-detail').html('<span>订单详细信息</span><hr><table><tr><th>订单编号</th><td id="billId">'+detailItem.billId+'</td></tr><tr><th>订单时间</th><td id="billTime">'+detailItem.billTime+'</td></tr><tr><th>订单状态</th><td id="billStatus">'+detailItem.billStatus+'</td></tr><tr><th>设备名称</th><td id="deviceName">'+detailItem.deviceName+'</td></tr><tr><th>设备类型</th><td id="deviceType">'+detailItem.deviceType+'<tr><th>维修机</th><td id="organization">'+detailItem.organization+'</td></tr><tr><th>预约时间</th><td id="Appointment">'+detailItem.Appointment+'</td></tr><tr><th>维修地址</th><td id="address">'+detailItem.address+'</td></tr><tr><th>联系电话</th><td id="phone">'+detailItem.phone+'</td></tr><tr><th>故障描述</th><td id="description">'+detailItem.description+'</td></tr></table><hr><div class="detail-btns"><button id="contactStaff">联系维修员</button><button id="checkFinish">查看完工单</button><button id="billAgain">再次报修</button></div>');
		if(detailItem.billStatus != '已完成'){
		$('.detail-btns').prepend('<button id="cancelBill">取消订单</button>');
		}
	}else if(listName == 'devices'){
		if(localStorage.s_devices) {
			detailItem = JSON.parse(localStorage.s_devices.split('$$')[index]);
		}
		$('.device-detail').html('<span>订单详细信息</span><hr><table><tr><th>订单编号</th><td id="billId">'+detailItem.billId+'</td></tr><tr><th>订单时间</th><td id="billTime">'+detailItem.billTime+'</td></tr><tr><th>订单状态</th><td id="billStatus">'+detailItem.billStatus+'</td></tr><tr><th>设备名称</th><td id="deviceName">'+detailItem.deviceName+'</td></tr><tr><th>设备类型</th><td id="deviceType">'+detailItem.deviceType+'<tr><th>维修机</th><td id="organization">'+detailItem.organization+'</td></tr><tr><th>预约时间</th><td id="Appointment">'+detailItem.Appointment+'</td></tr><tr><th>维修地址</th><td id="address">'+detailItem.address+'</td></tr><tr><th>联系电话</th><td id="phone">'+detailItem.phone+'</td></tr><tr><th>故障描述</th><td id="description">'+detailItem.description+'</td></tr></table><hr><div class="detail-btns"><button id="contactStaff">联系维修员</button><button id="checkFinish">查看完工单</button><button id="billAgain">再次报修</button></div>');
		if(detailItem.billStatus != '已完成'){
		$('.detail-btns').prepend('<button id="cancelBill">取消订单</button>');
		}	
	}
}

//在item中点击control按钮
$('.bill-list').on('click','button',function(event){
	event.stopPropagation();
	var billIndex = $(this).parent().attr('data');
	switch($(this).attr('id'))
	{
		case 'checkBill':
			setItemDetail(billIndex);
			$('.cover').fadeIn(200);
			$('.bill-detail').fadeIn(200);
			$('#app').one('click',function(e){
				e.stopPropagation();
				switch($(e.target).attr('id'))
				{	
					case 'cover':
						$('.cover').fadeOut(200);
						$('.bill-detail').fadeOut(200);
						break;
					default:
						console.log($(e.target).attr('id'));
				}	
			});
			break;
		case 'cancelBill':
			$('#back-btn').css('visibility','visible');
			$('.cover').fadeIn();
			$('.prompt').css('bottom','50px');
			$('#app').one('click',function(e){
				switch($(e.target).attr('id'))
				{
					case 'back-btn':
					case 'cover':
					case 'no':
						$('#back-btn').css('visibility','hidden');
						$('.cover').fadeOut();
						$('.prompt').css('bottom','-150px');
						break;
					case 'ok':
					//删除一条报修单
					model.clearItem('bills',billIndex);
					$('#back-btn').css('visibility','hidden');
					$('.cover').fadeOut();
					$('.prompt').css('bottom','-150px');
					break;
				}					
			});
			
	}
});


//点击查看设备详细信息
$('#checkDevice').click(function(){
	$('.back-btn').fadeIn(	);
	$('.cover').fadeIn();
	$('.device-detail').fadeIn();
	$('.back-btn').one('click',function(){
		$('.device-detail').fadeOut();
		$('.back-btn').fadeOut(	);
		$('.cover').fadeOut();
	})
});


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


$('#take-bill-now').click(function(){
	$('.title').text('报修');
	$('form').fadeIn();
	$('#back-btn').css('visibility','visible').one('click',function(){
		$('#back-btn').css('visibility','hidden');		
		$('form').fadeOut(100);
		$('.bill-list').fadeIn(100)
		$('.device-list').fadeOut(100);
		$('.title').text('我的报单');
	});

});