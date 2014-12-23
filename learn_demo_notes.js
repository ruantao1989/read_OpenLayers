
一: Map操作:
1.设置中心点及zoom
	map.zoomToMaxExtent();
	//或
	var lon = 9,lat = 49,zoom = 5;
	map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);
2.获取中心点
	var center = this.map.getCenter();
3.获得分辨率
	var resolution = this.map.getResolution();//经纬度和像素坐标转换用的
4.根据url的传参定位地图(可以逆向生成url)
	//true时候url会跟着地图的变化而动态生成, false只会在点击固定连接时才生成一次
	map.addControl(new OpenLayers.Control.Permalink({anchor: true}));
5.设置缩放级别
	var options = {
		scales: [50000000, 30000000, 10000000, 5000000] 
		resolutions: [1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125]
	};
	map = new OpenLayers.Map('map' , options);



二:Layer图层
1.添加/删除图层
	//按OpenLayers的封装, 估计还会有".Layer.WFS"一类的子类(后查得WFS在)
	map.addLayer(new OpenLayers.Layer.WMS(...));
	map.removeLayer(this.layer);
2.自定义图层
	this.layer = new OpenLayers.Layer.Vector("Editable");
	this.map.addLayer(this.layer);
3.json数据图层
	map = new OpenLayers.Map({
	    div: "map",
	    allOverlays: true,//这种图层必须allOverlays: true
	    maxExtent: new OpenLayers.Bounds(
	        1549471.9221, 6403610.94, 1550001.32545, 6404015.8
	    )
	});
	var vectors = new OpenLayers.Layer.Vector("Lines", {
	    strategies: [new OpenLayers.Strategy.Fixed()],                
	    protocol: new OpenLayers.Protocol.HTTP({
	        url: "data/roads.json",//Ajax请求本地的json文件,chrome默认不允许 需要修改下
	        format: new OpenLayers.Format.GeoJSON()//格式是GeoJSON
	    }),
	    //styleMap: styles 可以单独制定线的样式等等,默认是黄的
	});
	map.addLayer(vectors);//json图层
	map.zoomToMaxExtent();
4.多个图层及切换
	var osm = new OpenLayers.Layer.OSM();
	var gmap = new OpenLayers.Layer.Google("Google Streets", {visibility: false});//默认不显示
	map.addLayers([osm, gmap]);//添加多个图层(倒序添加,第0层会盖住第1层)
	map.addControl(new OpenLayers.Control.LayerSwitcher());//切换器
5.ArcGIS服务的图层
	layer = new OpenLayers.Layer.ArcGIS93Rest
	cacheLayer = new OpenLayers.Layer.ArcGISCache
		new OpenLayers.Layer.ArcIMS
6.图层描述
	//配合map.addControl(new OpenLayers.Control.Attribution());
	new OpenLayers.Layer.WMS(...,{attribution:"描述信息!@#$"});		
7.Bing图层
	new OpenLayers.Layer.Bing({
	    name: "Road",
	    key: apiKey,
	    type: "Road"
	});
8.缩放级别限制
	//bing地图的级别, 一般都是在new Map时候传入参数
    maxResolution: 76.43702827453613,
    numZoomLevels: 3



三:Control控制
1.添加控制操作
	//此Control是new OpenLayers.Map的第二个参数,和公司的封装不同
	new OpenLayers.Control.KeyboardDefaults({...})
2.创建地图后添加Control
	map.addControl(new OpenLayers.Control.KeyboardClick({...}));
3.自定义Control控件
	//这个就比较有意思了, 回头把demo过完, 首先要看OpenLayers.Class是怎么实现的
	OpenLayers.Control.KeyboardClick = OpenLayers.Class(OpenLayers.Control, {
	    initialize:function(options) {
	    	//使用原型apply,类似jQuery里的extend
	    	OpenLayers.Control.prototype.initialize.apply(this, [options]);
	    	this.handler = ...
	    };
	    onClick: function(geometry) {};
	    ...
	}
4.自定义Panel容器
	//第一个控件zoomBox
	zoomBox = new OpenLayers.Control.ZoomBox({
	    title: "Zoom box: zoom clicking and dragging",
	    text: "Zoom"
	});
	//第二个控件draw
	vlayer = new OpenLayers.Layer.Vector( "Editable" );//需要绘制在Layer.Vector上
	map.addLayer(vlayer);
	drawBox = new OpenLayers.Control.DrawFeature(vlayer, OpenLayers.Handler.Path, {
		title: 'Draw a feature',
		text: 'Draw'
	});
	//控件容器panel
	var panel = new OpenLayers.Control.Panel({
	    defaultControl: zoomBox,
	    createControlMarkup: function(control) {
	        var button = document.createElement('button'),
	            iconSpan = document.createElement('span'),
	            textSpan = document.createElement('span');
	        iconSpan.innerHTML = '&nbsp;';
	        button.appendChild(iconSpan);
	        if (control.text) {
	            textSpan.innerHTML = control.text;
	        }
	        button.appendChild(textSpan);
	        return button;
	    }
	});
	//panel添加俩控件
	panel.addControls([zoomBox,drawBox]);
	//地图添加
	map.addControl(panel);
5.zoomBox缩放,DrawFeature画线,NavigationHistory历史
	new OpenLayers.Control.ZoomBox
	new OpenLayers.Control.DrawFeature
	new OpenLayers.Control.NavigationHistory
6.鹰眼图
	map.addControl(new OpenLayers.Control.OverviewMap());
7.更换中心点
	var lonlat = new OpenLayers.LonLat(lon, lat);
	map.panTo(lonlat);
8.获取鼠标当前位置
	new OpenLayers.Control.MousePosition()	
9.图层描述
	//配合每个图层Layer.WMS(...,{attribution:"描述信息!@#$"});	
	map.addControl(new OpenLayers.Control.Attribution())
10.骨头棒
	new OpenLayers.Control.PanZoomBar()	



四:Event事件
1.自定义Handler
	//事件这块有时间也得好好看看,貌似文档里有"过滤器",看看怎么拿事件实现的
	OpenLayers.Handler.KeyboardPoint = OpenLayers.Class(OpenLayers.Handler,
2.事件监听
	OpenLayers.Function.bindAsEventListener(
	    this.handleKeyEvent, this
	);
	//或
	OpenLayers.Event.observe(
	    observeElement,
	    "keydown",
	    OpenLayers.Function.bindAsEventListener(
	        function(evt) {



五:Feature要素
1.创建"点"要素(在Layer.Vector上)
	var vectorLayer = new OpenLayers.Layer.Vector();
	map.addLayer(vectorLayer);
	var center = map.getCenter();
	var geometry = new OpenLayers.Geometry.Point(
	    center.lon, center.lat
	);
	var point = new OpenLayers.Feature.Vector(geometry);
	point.geometry.clearBounds();
	vectorLayer.addFeatures([point], {silent: true});//addFeatures()仅仅是Layer.Vector的方法,也就说要画在Layer.Vector上
	vectorLayer.drawFeature(point, this.style);//Layer.Vector图层上绘制



六:Protocol协议
1.jsonp图层
	var jsonp = new OpenLayers.Protocol.Script();
	jsonp.createRequest(layerURL, {
	    f: 'json', 
	    pretty: 'true'
	}, initMap);//initMap是回调函数
       


七:Strategy策略
1.加载形状时不请求底图
	new OpenLayers.Layer.Vector("GML", {
	strategies: [new OpenLayers.Strategy.Fixed()],//数据加载前图层是否可见. 



八:LonLat坐标
1.坐标转换
	//把"EPSG:4326"转换成map.getProjectionObject()类型的坐标
	new OpenLayers.LonLat(-71.147, 42.472).transform(
	    new OpenLayers.Projection("EPSG:4326"),
	    map.getProjectionObject()
	)	