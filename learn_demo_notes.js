
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
5.限制缩放级别
	var options = {
		scales: [50000000, 30000000, 10000000, 5000000] 
		resolutions: [1.40625,0.703125,0.3515625,0.17578125,0.087890625,0.0439453125]
	};
	map = new OpenLayers.Map('map' , options);
	//或
	map = new OpenLayers.Map({
        div: "map",
        projection: "EPSG:900913",
        controls: [],
        fractionalZoom: true//限制级别,这个需要在Layer中设置zoom级别
    });
6.鼠标拾取事件
	var size = map.getSize();
	map.events.on({
	    mousemove: function(event) {...}
7.比例尺
	new OpenLayers.Control.ScaleLine()
	//中文
	OpenLayers.INCHES_PER_UNIT["公里"] = OpenLayers.INCHES_PER_UNIT["km"]
	OpenLayers.INCHES_PER_UNIT["米"] = OpenLayers.INCHES_PER_UNIT["m"]
	new OpenLayers.Control.ScaleLine({
		topOutUnits:"公里",
		bottomOutUnits:"米"
	});
8.骨头棒zoom范围
	map = new OpenLayers.Map('map', {
        controls: [],
        numZoomLevels: 6//六级
    });
9.添加删除气泡
	//添加气泡
	map.addPopup(popup, true);
	//删除
	map.removePopup(feature.popup);//地图上删掉feature中的popup
    feature.popup.destroy();//析构



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
9.Layer.Boxes绘制矩形线框
	//绘图图层
	var boxes  = new OpenLayers.Layer.Boxes( "Boxes" );
	//边界
	var box_extents = [
		[-10, 50, 5, 60],
		[-75, 41, -71, 44],
		[-122.6, 37.6, -122.3, 37.9],
		[10, 10, 20, 20]
	];
	//根据边界画矩形
	for (var i = 0; i < box_extents.length; i++) {
	    ext = box_extents[i];
	    bounds = OpenLayers.Bounds.fromArray(ext);
	    box = new OpenLayers.Marker.Box(bounds);
	    box.events.register("click", box, function (e) {
	        this.setBorder("yellow");
	    });
	    boxes.addMarker(box);
	}
	map.addLayers([ol_wms, boxes]);
10.Layer.Vector绘制矩形要素
	var boxes  = new OpenLayers.Layer.Vector( "Boxes" );
	for (var i = 0; i < box_extents.length; i++) {
	    ext = box_extents[i];
	    bounds = OpenLayers.Bounds.fromArray(ext);
	    box = new OpenLayers.Feature.Vector(bounds.toGeometry());
	    boxes.addFeatures(box);
	}
	map.addLayers([ol_wms, boxes]);
	//选择Vector工具
	var sf = new OpenLayers.Control.SelectFeature(boxes);
	map.addControl(sf);
	sf.activate();//激活选择器, 可点选激活
11.缓存瓦片数
	//设置缓存的瓦片数(包括视野外的)默认是0
	new OpenLayers.Layer.WMS( ..., {'buffer':4})
12.利用localStorage做缓存
	//1.写
	cacheWrite = new OpenLayers.Control.CacheWrite({
	    autoActivate: true,
	    imageFormat: "image/jpeg",
	    eventListeners: {
	        cachefull: function() { status.innerHTML = "Cache full."; }
	    }
	});
	map.addControl(cacheWrite);
	//写事件
	map.layers[0].events.on({'tileloaded': updateStatus});
	//2.读
	cacheRead = new OpenLayers.Control.CacheRead();
	map.addControl(cacheRead);
	//读事件
	new OpenLayers.Layer.WMS({...
	    eventListeners: {
	        tileloaded: updateHits
	    }
	})
13.canvas绘图元素
	



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
11.自定义点击显示经纬度控件
	//自定义控件
	OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
        },
        //初始化接口
        initialize: function(options) {
        	//扩展Options
            this.handlerOptions = OpenLayers.Util.extend(
                {}, this.defaultHandlerOptions
            );
            OpenLayers.Control.prototype.initialize.apply(
                this, arguments
            ); 
            //initialize中要指定this.handler , 对于单击当然是OpenLayers.Handler.Click
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.trigger//本control的trigger接口,
                }, this.handlerOptions//参数,策略 在最开始
            );
        }, 
        //触发接口
        trigger: function(e) {
            var lonlat = map.getLonLatFromPixel(e.xy);
            alert("You clicked near " + lonlat.lat + " N, " +
                                      + lonlat.lon + " E");
        }
    });
	//添加进map 还得激活一下
	var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();
12.双击拖动等自定义Control
	//自定义控件中
	this.handler = new OpenLayers.Handler.Click(
        this, {
            'click': this.onClick,
            'dblclick': this.onDblclick //this.handler和接口可以一对多
        }, this.handlerOptions
    );
    ...
    onDblclick: function(evt) {  
        var msg = "dblclick " + evt.xy;
    }  
    //单独定义control
    "drag": new OpenLayers.Control.Click({
        handlerOptions: {
            "single": true,
            "pixelTolerance": null
        }
    })
13.shift画框之前alert
	var control = new OpenLayers.Control();
	//这次用的Util.extend扩展control
    OpenLayers.Util.extend(control, {
        draw: function () {
            this.box = new OpenLayers.Handler.Box( control,
                {"done": this.notice},
                {keyMask: OpenLayers.Handler.MOD_SHIFT});
            this.box.activate();
        },
        notice: function (bounds) {
            var ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom)); 
            var ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top)); 
            alert(ll.lon.toFixed(4) + ", " + 
                  ll.lat.toFixed(4) + ", " + 
                  ur.lon.toFixed(4) + ", " + 
                  ur.lat.toFixed(4));
        }
    });
14.自定义MousePosition的Css样式
	p {
        width: 500px;
    }
    div.olControlMousePosition {
        font-family: Verdana;
        font-size: 2em;
        color: red;
    }
	map.addControl(new OpenLayers.Control.MousePosition());
15.地图div范围外拖动
	new OpenLayers.Control.Navigation({documentDrag: true})
16.画面工具
	var draw = new OpenLayers.Control.DrawFeature(
	    map.layers[1],//是Layer.Vector
	    OpenLayers.Handler.Polygon,//面
	    {handlerOptions: {holeModifier: "altKey"}}//alt以后可以在已经存在的面里画出一个洞
	);
	map.addControl(draw);
17.激活/关闭工具
	//点击某元素后的事件
	if (element.value === "polygon" && element.checked) {
        draw.activate();
    } else {
        draw.deactivate();
    }
18.拾取获得面元素的id
	function updateOutput(event) {
	    window.setTimeout(function() {
	        outputDOM.innerHTML = event.type + " " + event.feature.id;
	    }, 100);
	}
	map.layers[1].events.on({//layers[1]是Layer.Vector
	    sketchmodified: updateOutput,
	    sketchcomplete: updateOutput
	});
19.画点,线,面,矩形
	//分别画在不同的
	drawControls = {
        point: new OpenLayers.Control.DrawFeature(pointLayer,//new OpenLayers.Layer.Vector("Point Layer");
            OpenLayers.Handler.Point),
        line: new OpenLayers.Control.DrawFeature(lineLayer,
            OpenLayers.Handler.Path),
        polygon: new OpenLayers.Control.DrawFeature(polygonLayer,
            OpenLayers.Handler.Polygon),
        box: new OpenLayers.Control.DrawFeature(boxLayer,//new OpenLayers.Layer.Vector("Box layer");
            OpenLayers.Handler.RegularPolygon, {
                handlerOptions: {
                    sides: 4,
                    irregular: true
                }
            }
        )
    };
    //遍历添加
    for(var key in drawControls) {
        map.addControl(drawControls[key]);
    }
20.中断绘制点线面
	var stop = !element.checked;//某dom点击事件
    for(var key in drawControls) {
        drawControls[key].handler.stopDown = stop;//停止绘制
        drawControls[key].handler.stopUp = stop;
    }
21.拖动要素
	drag: new OpenLayers.Control.DragFeature(vectors)
22.根据的值输入绘制
	var draw = new OpenLayers.Control.DrawFeature(
	    map.layers[1], OpenLayers.Handler.Path
	);
	map.addControl(draw);
	draw.activate();
	// 接收输入值
	draw.insertXY(values[0], values[1]);//插入位置
	draw.insertDeltaXY(values[0], values[1]);//和上一次的偏移量
	draw.insertDirectionLength(values[0], values[1]);//长度
	draw.insertDeflectionLength(values[0], values[1]);
	draw.cancel();//取消绘制
	draw.finishSketch();//完成绘制
23.工具栏toolbar
	//嵌在地图内
	vlayer = new OpenLayers.Layer.Vector( "Editable" );
	new OpenLayers.Control.EditingToolbar(vlayer)
	//放在地图外
	var container = document.getElementById("panel");
    var panel = new OpenLayers.Control.EditingToolbar(
        vlayer, /*Layer.Vector*/{div: container}
    );
    map.addControl(panel);
24.类型切换
	var blue = new OpenLayers.Control({
        type: OpenLayers.Control.TYPE_TOGGLE,
        eventListeners: toolListeners,
        displayClass: "blue"
    });
    //事件处理
    var toolListeners = {
        "activate": toolActivate,
        "deactivate": toolDeactivate
    };
    function toolActivate(event) {
        log("activate " + event.object.displayClass);
    }


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
3.绘制过程中Ctrl-Z 和 Ctrl-Y
	OpenLayers.Event.observe(document, "keydown", function(evt) {
	    var handled = false;
	    switch (evt.keyCode) {
	        case 90: // z
	            if (evt.metaKey || evt.ctrlKey) {
	                draw.undo();
	                handled = true;
	            }
	            break;
	        case 89: // y
	            if (evt.metaKey || evt.ctrlKey) {
	                draw.redo();
	                handled = true;
	            }
	            break;
	        case 27: // esc
	            draw.cancel();
	            handled = true;
	            break;
	    }
	    if (handled) {
	        OpenLayers.Event.stop(evt);
	    }
	});
4.要素拾取
	selectControl = new OpenLayers.Control.SelectFeature(layer);
	map.addControl(selectControl);
	selectControl.activate();
	layer.events.on({
	    'featureselected': onFeatureSelect,//选中
	    'featureunselected': onFeatureUnselect//不选
	});
    function onFeatureSelect(evt) {
        feature = evt.feature;//event里有feature元素
        popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                                 feature.geometry.getBounds().getCenterLonLat(),
                                 new OpenLayers.Size(100,100),
                                 "<h2>"+feature.attributes.title + "</h2>" +
                                 feature.attributes.description,
                                 null, true, onPopupClose);//构造弹窗
        feature.popup = popup;//feature和popup相互持有
        popup.feature = feature;
        map.addPopup(popup, true);//添加气泡
    }
    function onFeatureUnselect(evt) {
        feature = evt.feature;
        if (feature.popup) {
            popup.feature = null;
            map.removePopup(feature.popup);//地图上删掉feature中的popup
            feature.popup.destroy();//析构
            feature.popup = null;
        }
    }
    // Needed only for interaction, not for the display.
    function onPopupClose(evt) {
        // 'this' is the popup.
        var feature = this.feature;
        if (feature.layer) { //要素存在
            selectControl.unselect(feature);
        } else { // After "moveend" or "refresh" events on POIs layer all features have been destroyed by the Strategy.BBOX
            this.destroy();
        }
    }
5.监听多个事件    
	map = new OpenLayers.Map('map', {
	    eventListeners: {
	        "moveend": mapEvent,
	        "zoomend": mapEvent,
	        "changelayer": mapLayerChanged,
	        "changebaselayer": mapBaseLayerChanged
	    }
	});
	//从event拿到事件源
	function mapEvent(event) {
	    log(event.type);
	}
	function mapBaseLayerChanged(event) {
	    log(event.type + " " + event.layer.name);
	}
	function mapLayerChanged(event) {
	    log(event.type + " " + event.layer.name + " " + event.property);
	}



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
2.



六:Popup气泡
1.构造气泡
	popup = new OpenLayers.Popup.FramedCloud("featurePopup",
	                                 feature.geometry.getBounds().getCenterLonLat(),
	                                 new OpenLayers.Size(100,100),
	                                 "<h2>"+feature.attributes.title + "</h2>" +
	                                 feature.attributes.description,
	                                 null, true, onPopupClose);//构造弹窗
	feature.popup = popup;//feature和popup相互持有
	popup.feature = feature;
2.析构气泡
	if (feature.popup) {
	    popup.feature = null;
	    map.removePopup(feature.popup);//地图上删掉feature中的popup
	    feature.popup.destroy();//析构
	    feature.popup = null;
	}        



七:Geometry几何
1.在Layer.Vector上绘制几何图形
	var Geometry = OpenLayers.Geometry;
	var features = [
	    new Feature(
	        new Geometry.Point(0, 45),
	        {cls: "one"}
	    ),
	    new Feature(
	        Geometry.fromWKT("POLYGON((20 -20, 110 -20, 110 -80, 20 -80, 20 -20), (40 -40, 90 -40, 90 -60, 40 -60, 40 -40))")
	    )    
	];
	//绘制几何图形
	var layer = new OpenLayers.Layer.Vector(... {
	    renderers: ["Canvas"]
	});
	layer.addFeatures(features);
	//点选
	var select = new OpenLayers.Control.SelectFeature(layer);
	map.addControl(select);
	select.activate();



八:Style样式
1.规则和样式的匹配
	var Rule = OpenLayers.Rule;
	var Filter = OpenLayers.Filter;
	var style = new OpenLayers.Style({
	    pointRadius: 10,
	    strokeWidth: 3,
	    strokeOpacity: 0.7,
	    strokeColor: "navy",
	    fillColor: "#ffcc66",
	    fillOpacity: 1
	}, {
	rules: [
	    new Rule({
	        filter: new Filter.Comparison({
	            type: "==",
	            property: "cls",
	            value: "one"//对应new Feature(new Geometry.Point(0, 45),{cls: "one"}
	        }),
	        symbolizer: {
	            externalGraphic: "../img/marker-blue.png"
	        }
	    }),



九:Protocol协议
1.jsonp图层
	var jsonp = new OpenLayers.Protocol.Script();
	jsonp.createRequest(layerURL, {
	    f: 'json', 
	    pretty: 'true'
	}, initMap);//initMap是回调函数
2.Script图层(感觉类似jsonp)
	new OpenLayers.Layer.Vector("Vectors", {
	    projection: new OpenLayers.Projection("EPSG:4326"),
	    strategies: [new OpenLayers.Strategy.Fixed()],
	    protocol: new OpenLayers.Protocol.Script({
	        url: "http://examples.cartodb.com/api/v2/sql",
	        params: {
			    q: "select * from costa_rica_pa LIMIT 50",
			    format: "geojson"
		    },
	        format: new OpenLayers.Format.GeoJSON({
	            ignoreExtraDims: true
	        }),
	        callbackKey: "callback"
	    }),
	    eventListeners: {
	        "featuresadded": function() {
	            this.map.zoomToExtent(this.getDataExtent());
	        }
	    }
	})
3.Protocol.Script调用跨域wfs
	 new OpenLayers.Layer.Vector("States", {
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: new OpenLayers.Protocol.Script({
                url: "http://suite.opengeo.org/geoserver/wfs",
                callbackKey: "format_options",
4.调用本地txt中的内容
	var layer = new OpenLayers.Layer.Vector("POIs", {
	    strategies: [new OpenLayers.Strategy.BBOX({resFactor: 1.1})],
	    protocol: new OpenLayers.Protocol.HTTP({
	        url: "textfile.txt",
	        format: new OpenLayers.Format.Text()
	    })
	});



十:Format格式
1.CQL
	//感觉这个放Protocol协议不完了么 过度设计了吧...
	var format = new OpenLayers.Format.CQL();
	filter = format.read(cql.value);
2.编码的Polyline
	var format = new OpenLayers.Format.EncodedPolyline({geometryType:"polygon"});
	vector_layer.addFeatures(format.read(encoded));//Layer.Vector



十一:Strategy策略
1.加载形状时不请求底图
	new OpenLayers.Layer.Vector("GML", {
	strategies: [new OpenLayers.Strategy.Fixed()],//数据加载前图层是否可见. 



十二:LonLat坐标
1.坐标转换
	//把"EPSG:4326"转换成map.getProjectionObject()类型的坐标
	new OpenLayers.LonLat(-71.147, 42.472).transform(
	    new OpenLayers.Projection("EPSG:4326"),
	    map.getProjectionObject()
	)



十三:Util工具
1.extend扩展(猜是遍历拷贝的,回头看源码)
	this.handlerOptions = OpenLayers.Util.extend(
	    {}, this.defaultHandlerOptions
	);
2.接收url传参
	//最后的.param是参数名, 如?param=XXXX
	OpenLayers.Util.getParameters(window.location.href).param



十四:Console控制台
1.使用Console
	//引入"/lib/Firebug/firebug.js", 回头得看看这个控制台怎么实现的
	OpenLayers.Console.log()
	OpenLayers.Console.warn()
	OpenLayers.Console.error()
	OpenLayers.Console.dir()
	OpenLayers.Console.dirxml()



其他
1.浏览器检测
    在examples/browser.js里, 这个一定得好好看看
    jQuery的检测没看明白, OpenLayers的感觉没有那么多模式, 简单得多
2.Jugl.js
	Jugl.js是一个模板库, 资料不多 用法如下:
	<table id="template">
        <tr jugl:repeat="row new Array(rows)">
            <td jugl:repeat="col new Array(cols)" 
                jugl:attributes="id 'c' + repeat.col.index + 'r' + repeat.row.index">
                &nbsp;
            </td>
        </tr>
    </table>
    var template = new jugl.Template("template");
	template.process({
	    clone: true,
	    parent: "inspector",
	    context: {
	        rows: rows,
	        cols: cols
	    }
	});
    相当nb啊, 在支持canvas的浏览器里都可以显示表格效果, 回头研究下怎么弄的
