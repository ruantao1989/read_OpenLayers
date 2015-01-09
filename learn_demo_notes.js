
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
10.声明事件监听
	var map = new OpenLayers.Map({
		... ...
	    eventListeners: {
	        featureover: function(e) {
	            e.feature.renderIntent = "select";
	            e.feature.layer.drawFeature(e.feature);
	            log("Map says: Pointer entered " + e.feature.id + " on " + e.feature.layer.name);
	        },
	        featureout: function(e) {
	            e.feature.renderIntent = "default";
	            e.feature.layer.drawFeature(e.feature);
	            log("Map says: Pointer left " + e.feature.id + " on " + e.feature.layer.name);
	        },
	        featureclick: function(e) {
	            log("Map says: " + e.feature.id + " clicked on " + e.feature.layer.name);
	        }
	    }
	});
11.zoom值取整
	map.zoomTo(Math.round(map.zoom));
12.全屏地图
	html, body, #map {
        margin: 0;
        width: 100%;
        height: 100%;
    }
13.Ajax跨域
	//这个回头得看看源码
	OpenLayers.ProxyHost = "/proxy/?url=";
14.添加气泡
	map.addPopup(new OpenLayers.Popup.FramedCloud(
        "chicken", 
        map.getLonLatFromPixel(event.xy),
        null,
        event.text,
        null,
        true
    ));
15.叠加全都图层
	//而不是按需显示
	new OpenLayers.Map('map', {allOverlays: true});
16.渲染在指定dom上
	map.render("container_id");
17.设置地图最大范围
	//拖动边界
	var extent = new OpenLayers.Bounds(8, 44.5, 19, 50);
	map.setOptions({restrictedExtent: extent});
	//map.setOptions({restrictedExtent: null});
18.左右俩图联动
	map.events.register('moveend', map, function(){
        map2.setCenter(map.getCenter(), map.getZoom());
    });
19.使用模版
	//${getSize}相当于context.getSize(feature)
	var context = {
        getColor: function(feature) {
            var region = parseInt((feature.geometry.x + 180) / 120);
            return colors[region];
        },
        getSize: function(feature) {
            return feature.attributes["type"] / map.getResolution() * .703125;
        }
    };
    var template = {
        pointRadius: "${getSize}", // using context.getSize(feature)
        fillColor: "${getColor}" // using context.getColor(feature)
    };
20.zoom值的计算
	minResolution: "auto",
    minExtent: new OpenLayers.Bounds(-1, -1, 1, 1),
    maxResolution: "auto",
    maxExtent: new OpenLayers.Bounds(-180, -90, 180, 90)



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
	var wfs = new OpenLayers.Layer.Vector("States", {
       	... ...
        renderers: ["Canvas", "SVG", "VML"]
    });
14.Vector上绘制GeoJSON
	var vector = new OpenLayers.Layer.Vector("GeoJSON", {
	    ...
	    protocol: new OpenLayers.Protocol.HTTP({
	        url: "geojson-reprojected.json",
	        format: new OpenLayers.Format.GeoJSON()
	    })
	});
15.xml加载GeoRSS图层
	var newl = new OpenLayers.Layer.GeoRSS(
16.自定义图片图标加在GeoRSS图层上
	var yelp = new OpenLayers.Icon("http://www.openlayers.org/images/OpenLayers.trac.png", new OpenLayers.Size(49,44));
    var newl = new OpenLayers.Layer.GeoRSS( 'Yelp GeoRSS', 'yelp-georss.xml', {'icon':yelp});
    map.addLayer(newl);
17.GML图层
	 map.addLayer(new OpenLayers.Layer.Vector("GML", {
	    protocol: new OpenLayers.Protocol.HTTP({
	        url: "gml/polygon.xml",
	        format: new OpenLayers.Format.GML()
	    }),
18.google图层
	var gphy = new OpenLayers.Layer.Google(
        "Google Physical",
        {type: G_PHYSICAL_MAP}
    );
19.静态网格图层
	//有点儿wmts的意思
	new OpenLayers.Layer.Grid(
        "Google Streets",
        "http://maps.googleapis.com/maps/api/staticmap?sensor=false&maptype=roadmap", 
        null, options
    ),
    var options = {
	    singleTile: true,
	    ratio: 1,
	    isBaseLayer: true,
	    wrapDateLine: true,
	    getURL: function() {
	        var center = this.map.getCenter().transform("EPSG:3857", "EPSG:4326"),
	            size = this.map.getSize();
	        return [
	            this.url, "&center=", center.lat, ",", center.lon,
	            "&zoom=", this.map.getZoom(), "&size=", size.w, "x", size.h
	        ].join("");
	    }
	};
20.gutter沟槽
	//这个不知道干嘛用的, 是个纯地质学的概念, 不太理解
	//查得gutter的值会影响imageSize和imageOffset
	new OpenLayers.Layer.WMS( "States (15px gutter)",
		  "http://suite.opengeo.org/geoserver/wms",
		  {layers: 'usa:states'},
		  {gutter: 15,
21.图像图层
	var graphic = new OpenLayers.Layer.Image(
        'City Lights',
        'data/4_m_citylights_lg.gif',
        new OpenLayers.Bounds(-180, -88.759, 180, 88.759),
        new OpenLayers.Size(580, 288),
        {numZoomLevels: 3}
    );
22.KaMap图层
	var jpl_wms = new OpenLayers.Layer.KaMap( "Satellite",
	    "http://www.openlayers.org/world/index.php", {g: "satellite", map: "world"});
23.绘制KML轨迹
	new OpenLayers.Map({
        div: "map",
        projection: mercator,
        layers: [
				... ...
                eventListeners: {
                    "beforefeaturesadded": function(e) {
                        // group the tracks by fid and create one track for
                        // every fid
                        var fid, points = [], feature;
                        for (var i=0, len=e.features.length; i<len; i++) {
                            feature = e.features[i];
                            if ((fid && feature.fid !== fid) || i === len-1) {
                                this.addNodes(points, {silent: true});
                                points = [];
                            } else {
                                points.push(feature);
                            }
                            fid = feature.fid;
                        }
                        return false;
                    }
                }
24.图层加载事件
	layer.events.register("loadstart", layer, function() {
        this.logEvent("Load Start");
    });
    layer.events.register("tileloaded", layer, function() {
        this.logEvent("Tile loaded. " + this.numLoadingTiles + " left.");
    });
25.WMS图层透明度
	shade.setOpacity(newOpacity);//shade是Layer.WMS
26.XYZ图层
	var earth = new OpenLayers.Layer.XYZ(
27.MapGuide图层
	var layer = new OpenLayers.Layer.MapGuide(
28.MapServer图层
	layer = new OpenLayers.Layer.MapServer(
29.文字图层
	new OpenLayers.Layer.Text( "text", { location:"./textfile.txt"} );
30.maker压盖顺序
	var layer = new OpenLayers.Layer.Vector(
        "Y-Order",
        {
 			...	...
            rendererOptions: {yOrdering: true},
            renderers: renderer
        }
    );
	var layer = new OpenLayers.Layer.Vector(
        "Drawing Order",
        {
            isBaseLayer: true,
            // enable the indexer by setting zIndexing to true
            rendererOptions: {zIndexing: true}
        }
    );
31.OSM在Canvas画布上的事件
    layer = new OpenLayers.Layer.OSM('Simple OSM Map', null, {
        eventListeners: {
            tileloaded: function(evt) {
                var ctx = evt.tile.getCanvasContext();
                if (ctx) {
                    var imgd = ctx.getImageData(0, 0, evt.tile.size.w, evt.tile.size.h);
                    var pix = imgd.data;
                    for (var i = 0, n = pix.length; i < n; i += 4) {
                        pix[i] = pix[i + 1] = pix[i + 2] = (3 * pix[i] + 4 * pix[i + 1] + pix[i + 2]) / 8;
                    }
                    ctx.putImageData(imgd, 0, 0);
32.点阵
	var points = new OpenLayers.Layer.PointGrid({
	    isBaseLayer: true, dx: 15, dy: 15
	});
33.GeoRSS
	rss = new OpenLayers.Layer.GeoRSS(parts[parts.length-1], value);
34.坐标系切换
	'EPSG:3574': {
        projection: new OpenLayers.Projection('EPSG:3574'),
        units: 'm',
        maxExtent: new OpenLayers.Bounds(-5505054, -5505054, 5505054, 5505054),
        maxResolution: 5505054 / 128,
        numZoomLevels: 18
    },
    //切换坐标系
    function setProjection() {
	    projCode = this.innerHTML;
	    var oldExtent = map.getExtent();
	    var oldCenter = map.getCenter();
	    var oldProjection = map.getProjectionObject();
	    // map projection is controlled by the base layer
	    map.baseLayer.addOptions(projectionOptions[projCode]);
	    // with the base layer updated, the map has the new projection now
	    var newProjection = map.getProjectionObject();
	    // transform the center of the old projection, not the extent
	    map.setCenter(
	        oldCenter.transform(oldProjection, newProjection,
	        map.getZoomForExtent(oldExtent.transform(oldProjection, newProjection))
	    ));
	    for (var i=map.layers.length-1; i>=0; --i) {
	        // update grid settings
	        map.layers[i].addOptions(projectionOptions[projCode]);
	        // redraw layer - just in case center and zoom are the same in old and
	        // new projection
	        map.layers[i].redraw();
	    }
	}
35.shift和ctrl画矩形
	polyOptions = {sides: 4};
    polygonControl = new OpenLayers.Control.DrawFeature(polygonLayer,
                                    OpenLayers.Handler.RegularPolygon,
                                    {handlerOptions: polyOptions});
    //配置,形状:shape==>"3" triangle ,"4"  square,"5" pentagon ,"6" hexagon "40" circle
    polygonControl.handler.setOptions(options);
    //
    var radius = fraction * map.getExtent().getHeight();
    polygonControl.handler.setOptions({radius: radius,angle: 0});
36.瓦片缓存图层
	layer = new OpenLayers.Layer.TileCache("TileCache Layer",
                ["http://c0.tilecache.osgeo.org/wms-c/cache/",
                 "http://c1.tilecache.osgeo.org/wms-c/cache/",
                 "http://c2.tilecache.osgeo.org/wms-c/cache/",
                 "http://c3.tilecache.osgeo.org/wms-c/cache/",
                 "http://c4.tilecache.osgeo.org/wms-c/cache/"],
37.瓦片原点的偏移
	tileOrigin: new OpenLayers.LonLat(-180, -90)
38.TMS查询
	layer = new OpenLayers.Layer.TMS( "TMS",
        "http://tilecache.osgeo.org/wms-c/Basic.py/", {layername: 'basic', type:'png'} );
39.图层zoom时的过渡效果
	transitionEffect:'resize' ; //null
40.UTFGrid
	//读对应位置的json
	var utfgrid = new OpenLayers.Layer.UTFGrid({
	    url: "utfgrid/world_utfgrid/${z}/${x}/${y}.json",
	    utfgridResolution: 4, // default is 2
	    displayInLayerSwitcher: false
	});
41.WMS长url
	var base = new OpenLayers.Layer.WMS(
	base.mergeNewParams({makeTheUrlLong: longText});
	var string = OpenLayers.Util.getElement('year').value + "-" +
                         OpenLayers.Util.getElement('month').value + "-" +
                         OpenLayers.Util.getElement('day').value + "T" +
                         OpenLayers.Util.getElement('hour').value + ":" +
                         OpenLayers.Util.getElement('minute').value + ":00";
	base.mergeNewParams({'time':string});
42.WMTS图层
	var wmts = new OpenLayers.Layer.WMTS({
        name: "Medford Buildings",
        url: "http://v2.suite.opengeo.org/geoserver/gwc/service/wmts/",
        layer: "medford:buildings",
        matrixSet: "EPSG:900913",
        matrixIds: matrixIds,
        format: "image/png",
        style: "_null",
        opacity: 0.7,
        isBaseLayer: false
    });  
43.WorldWind图层
	new OpenLayers.Layer.WorldWind
44.Zoomify图层
    var zoomify = new OpenLayers.Layer.Zoomify( "Zoomify", zoomify_url, 
		new OpenLayers.Size( zoomify_width, zoomify_height ) );



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
25.获取客户端位置
	//获得html5中的位置信息
	var geolocate = new OpenLayers.Control.Geolocate({
	    bind: false,
	    geolocationOptions: {
	        enableHighAccuracy: false,
	        maximumAge: 0,
	        timeout: 7000
	    }
	});
	//事件
	geolocate.events.register("locationupdated",geolocate,function(e) {
26.WMS获取要素信息
	click: new OpenLayers.Control.WMSGetFeatureInfo({
        url: 'http://demo.opengeo.org/geoserver/wms', 
        title: 'Identify features by clicking',
        layers: [water],
        queryVisible: true,
            eventListeners: {
                getfeatureinfo: function(event) {
                	... ...
                }
    })
27.WFS获取要素信息
	control = new OpenLayers.Control.GetFeature({
        protocol: OpenLayers.Protocol.WFS.fromWMSLayer(layer),
        box: true,
        hover: true,
        multipleKey: "shiftKey",
        toggleKey: "ctrlKey"
    });
    control.events.register("featureselected", this, function(e) {
        select.addFeatures([e.feature]);
    });
28.格子线
	//这个好像是经纬线的网格
	//实例中还有一种是类似镜头评测里的分辨率线,是wms图层叠加的
	graticuleCtl1 = new OpenLayers.Control.Graticule({
	    numPoints: 2, 
	    labelled: true
	});
29.要素选择器
	= new OpenLayers.Control.SelectFeature(vectors, {
            hover: true,
            highlightOnly: true,
            renderIntent: "temporary",
            eventListeners: {
                beforefeaturehighlighted: report,
                featurehighlighted: report,
                featureunhighlighted: report
            }
        });
30.hover悬浮控件
	'long': new OpenLayers.Control.Hover({
	        handlerOptions: {
	            'delay': 2000
	        }
	    }),
	'untolerant': new OpenLayers.Control.Hover({
            handlerOptions: {
                'delay': 1000,
                'pixelTolerance': 1
            }
        }),
        'stoppropag': new OpenLayers.Control.Hover({
            handlerOptions: {
                'stopMove': true
            }
        })
31.拖拽释放后,地图继续滑动
	new OpenLayers.Control.Navigation(
        {dragPanOptions: {enableKinetic: true}}
    )
32.在Vector上加载KML文件
	new OpenLayers.Layer.Vector("KML", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "kml/lines.kml",
            format: new OpenLayers.Format.KML({
                extractStyles: true, 
                extractAttributes: true,
                maxDepth: 2
            })
        })
    })
34.使用DOMcss样式的LayerSwitcher
	map.addControl(new OpenLayers.Control.LayerSwitcher({'div':OpenLayers.Util.getElement('layerswitcher')}));
35.点要素的点击弹出气泡
	var vector = new OpenLayers.Layer.Vector("Points",{
        eventListeners:{
            'featureselected':function(evt){
                var feature = evt.feature;
                var popup = new OpenLayers.Popup.FramedCloud("popup",
                    OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                    null,
                    "<div style='font-size:.8em'>Feature: " + feature.id +"<br>Foo: " + feature.attributes.foo+"</div>",
                    null,
                    true
                );
                feature.popup = popup;
                map.addPopup(popup);
            },
            'featureunselected':function(evt){
36.ctrl键功能            	
	measureControls = {
        line: new OpenLayers.Control.Measure(
            OpenLayers.Handler.Path, {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        renderers: renderer,
                        styleMap: styleMap
                    }
                }
            }
        ),
        polygon: new OpenLayers.Control.Measure(
            OpenLayers.Handler.Polygon, {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        renderers: renderer,
                        styleMap: styleMap
                    }
                }
            }
        )
    };
37.修改要素
	modify: new OpenLayers.Control.ModifyFeature(vectors)
	//模式 controls.modify.mode = 
	OpenLayers.Control.ModifyFeature.RESHAPE;
	OpenLayers.Control.ModifyFeature.ROTATE;
	OpenLayers.Control.ModifyFeature.RESIZE;
	OpenLayers.Control.ModifyFeature.RESHAPE;
	OpenLayers.Control.ModifyFeature.DRAG;
38.鼠标滚轮zoom延迟
	 new OpenLayers.Control.Navigation(
            {mouseWheelOptions: {interval: 100}}
        )
39.是否允许鼠标滚轮zoom
	nav = new OpenLayers.Control.Navigation({'zoomWheelEnabled': false});
	//使能
	nav.enableZoomWheel();return false;
	nav.disableZoomWheel(); return false;
40.导航控件,前进后退
	nav = new OpenLayers.Control.NavigationHistory();
	panel = new OpenLayers.Control.Panel(
        {div: document.getElementById("panel")}
    );
    panel.addControls([nav.next, nav.previous]);
41.小手或者放大镜
	new OpenLayers.Control.PanZoom()
42.总是zoom
	new OpenLayers.Control.ZoomBox({alwaysZoom:true})
43.离线缓存
	//写
	cacheWrite = new OpenLayers.Control.CacheWrite({
        imageFormat: "image/jpeg",
        eventListeners: {
            cachefull: function() {
                if (seeding) {
                    stopSeeding();
                }
                status.innerHTML = "Cache full.";
            }
        }
    });
	// try cache before loading from remote resource
    cacheRead1 = new OpenLayers.Control.CacheRead({
        eventListeners: {
            activate: function() {
                cacheRead2.deactivate();
            }
        }
    });
    // try loading from remote resource and fall back to cache
    cacheRead2 = new OpenLayers.Control.CacheRead({
        autoActivate: false,
        fetchEvent: "tileerror",
        eventListeners: {
            activate: function() {
                cacheRead1.deactivate();
            }
        }
    });
44.鸟瞰图
	var overview1 = new OpenLayers.Control.OverviewMap({
        maximized: true,
        maximizeTitle: 'Show the overview map',
        minimizeTitle: 'Hide the overview map'
    });
45.自定义Panel
    zb = new OpenLayers.Control.ZoomBox(
    {title:"Zoom box: Selecting it you can zoom on an area by clicking and dragging."});
    var panel = new OpenLayers.Control.Panel({defaultControl: zb});
    panel.addControls([
        zb,
        new OpenLayers.Control.DrawFeature(vlayer, OpenLayers.Handler.Path,
            {title:'Draw a feature'}),
        new OpenLayers.Control.ZoomToMaxExtent({title:"Zoom to the max extent"}) 
    ]);
46.上下左右箭头
	new OpenLayers.Control.PanPanel(),
47.SLD选择器
	 box: new OpenLayers.Control.SLDSelect(
	        OpenLayers.Handler.RegularPolygon,
	        {
	            displayClass: 'olControlSLDSelectBox', 
	            layers: [layers['waterbodies']],
	            handlerOptions: {irregular: true}
	        }
	    ),
48.截取点阵
	var snap = new OpenLayers.Control.Snapping({
	    layer: lines,
	    targets: [{
	        layer: points,//点阵图层Layer.PointGrid
	        tolerance: 15
	    }]
	});
49.删除全部要素
	vectors.destroyFeatures();
50.切分后,向量闪动
	var split = new OpenLayers.Control.Split({
        layer: vectors,
        eventListeners: {
            aftersplit: function(event) {
                flashFeatures(event.features);//vectors.drawFeature(features[index], "select");  vectors.drawFeature(prev, "default");
            }
        }
    });
51.图形旋转
    control = new OpenLayers.Control.TransformFeature(vectorLayer, {
            renderIntent: "transform",
            rotationHandleSymbolizer: "rotate"
        });

    control.setFeature(polygonFeature, {rotation: 45, scale: 0.5, ratio: 1.5});
52.UTFGrid控件动作
	move: new OpenLayers.Control.UTFGrid({
		layers: [population],//某一个 ,全部用"null"
        callback: callback,
        handlerMode: "move"//"hover" "click"
    }),
53.UTFGrid控件根据坐标叠加图片
	var callback = function(infoLookup, loc, pixel) {
	    if (infoLookup) {
	        for (var idx in infoLookup) {
	           ...
	            info = infoLookup[idx];
	            if (info && info.data) {
	                output.innerHTML = info.data.admin;
	                flag.innerHTML = "<img src='data:image/png;base64," + info.data.flag_png + "'>";
	                flag.style.left = (pixel.x + 15) + "px";
	                flag.style.top = (pixel.y + 15) + "px";
	            }
	        }
	    }
	};
54.wfs编辑图形,并保存
	//编辑
	 var edit = new OpenLayers.Control.ModifyFeature(wfs, {
        title: "Modify Feature",
        displayClass: "olControlModifyFeature"
    });
	//保存
	var saveStrategy = new OpenLayers.Strategy.Save();
	if(edit.feature) {
        edit.selectControl.unselectAll();
    }
    saveStrategy.save();
55.wfs的Snapping和Split
	// configure the snapping agent
    var snap = new OpenLayers.Control.Snapping({layer: wfs});
    // configure split agent
    var split = new OpenLayers.Control.Split({
        layer: wfs,
        source: wfs,
56.wfs矢量图层叠加
	new OpenLayers.Layer.Vector("States", {
        minScale: 15000000,
        strategies: [new OpenLayers.Strategy.BBOX()],
        protocol: new OpenLayers.Protocol.WFS({
            url: "http://demo.opengeo.org/geoserver/wfs",
            featureType: "states",
            featureNS: "http://www.openplans.org/topp"
        }),
        renderers: renderer
    })
57.WMTS要素拾取
	control = new OpenLayers.Control.WMTSGetFeatureInfo({
	        drillDown: true,
	        queryVisible: true,
	        eventListeners: {
	            getfeatureinfo: function(evt) {



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
6.鼠标位置
	map.events.register("mousemove", map, function(e) {
        var position = this.events.getMousePosition(e);
        OpenLayers.Util.getElement("coords").innerHTML = position;
    });



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
2.要素事件
	var layer1 = new OpenLayers.Layer.Vector("Layer1", {
	    styleMap: style,
	    eventListeners: layerListeners//在Layer.Vector上画要素
	});
	//事件监听
	var layerListeners = {
	    featureclick: function(e) {
	        log(e.object.name + " says: " + e.feature.id + " clicked.");
	        return false;
	    },
	    nofeatureclick: function(e) {
	        log(e.object.name + " says: No feature clicked.");
	    }
	};
3.要素动态绘制在地图中心
	function adjustLocation(delta, feature) {
        feature.geometry.move(delta.x, delta.y);
        var me = map.maxExtent; 
        var rad = 6;
        if (feature.geometry.x > (me.right - rad)) { 
            feature.geometry.x = me.right - rad;
        } else if (feature.geometry.x < (me.left+rad)) {
            feature.geometry.x = me.left+rad;
        } 
        if (feature.geometry.y > (me.top-rad)) {
            feature.geometry.y = me.top-rad;
        } else if (feature.geometry.y < (me.bottom+rad)) {
            feature.geometry.y = me.bottom+rad;
        }    
        vlayer.drawFeature(feature);
    }
4.WKT格式要素
	var feature2 = new OpenLayers.Feature.Vector(
        OpenLayers.Geometry.fromWKT(
            "POLYGON((-120.828125 -50.3515625, -80.1875 -80.0078125, -40.40625 -20.4140625, -120.828125 -50.3515625))"
        )
    );
5.改变要素大小
	var origin = new OpenLayers.Geometry.Point(-111.04, 45.68);
    pointFeature.geometry.resize(scale, origin);
    lineFeature.geometry.resize(scale, origin);
    polygonFeature.geometry.resize(scale, origin);
    vectorLayer.redraw();
6.要素旋转
	//源
	var origin = new OpenLayers.Geometry.Point(-111.04, 45.68);
    feature.geometry.rotate(360 / 20, origin);
    feature.layer.drawFeature(feature);
7.选择要素
	vectors.events.on({
        'featureselected': function(feature) {
            document.getElementById('counter').innerHTML = this.selectedFeatures.length;
        },
        'featureunselected': function(feature) {
            document.getElementById('counter').innerHTML = this.selectedFeatures.length;
        }
    });
    //控件
    select: new OpenLayers.Control.SelectFeature(
    	vectors,
        {
            clickout: false, toggle: false,
            multiple: false, hover: false,
            toggleKey: "ctrlKey", // ctrl key removes from selection
            multipleKey: "shiftKey", // shift key adds to selection
            box: true
        }
    ),
    selecthover: new OpenLayers.Control.SelectFeature(
        vectors,
        {
            multiple: false, hover: true,
            toggleKey: "ctrlKey", // ctrl key removes from selection
            multipleKey: "shiftKey" // shift key adds to selection
        }
    )
8.选择要素,冒泡显示信息
	selectControl = new OpenLayers.Control.SelectFeature(polygonLayer,
        {onSelect: onFeatureSelect, onUnselect: onFeatureUnselect});
	//气泡
	function onFeatureSelect(feature) {
            selectedFeature = feature;
            popup = new OpenLayers.Popup.FramedCloud("chicken", 
                                     feature.geometry.getBounds().getCenterLonLat(),
                                     null,
                                     "<div style='font-size:.8em'>Feature: " + feature.id +"<br>Area: " + feature.geometry.getArea()+"</div>",
                                     null, true, onPopupClose);
            feature.popup = popup;
            map.addPopup(popup);
        }



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
	map.addPopup();
2.析构气泡
	if (feature.popup) {
	    popup.feature = null;
	    map.removePopup(feature.popup);//地图上删掉feature中的popup
	    feature.popup.destroy();//析构
	    feature.popup = null;
	}        
3.气泡里用html内容
    var popup = new OpenLayers.Popup.FramedCloud("Popup", 
        myLocation.getBounds().getCenterLonLat(), null,
        '<a target="_blank" href="http://openlayers.org/">We</a> ' +
        'could be here.<br>Or elsewhere.', null,
        true // <-- true if we want a close (X) button, false otherwise
    );



七.Makers标点
1.创建点
	//准备一个画布
	var markersLayer = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markersLayer);
    var size = new OpenLayers.Size(21,25);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size,offset);
    //由经纬度对象 + 图表对象 复合而成
    marker = new OpenLayers.Marker(new OpenLayers.LonLat(90,10),icon.clone());
    marker.setOpacity(0.2);
    markersLayer.addMarker(marker);
2.调整maker尺寸
	size = new OpenLayers.Size(size.w + 10, size.h + 10);
    icon.setSize(size);
3.maker阴影
	//其实是背景图片, 倒是兼容性最佳的方法
	styleMap: new OpenLayers.StyleMap({
            externalGraphic: "../img/marker-gold.png",
            backgroundGraphic: "./img/marker_shadow.png",
4.mark点击弹窗
	//对应关系在textfile.txt里
	var newl = new OpenLayers.Layer.Text( "text", {location: "./textfile.txt"} );
5.地图上等比例的方块
	var bounds = new OpenLayers.Bounds(-45,-45, 0, 45); 
    map.zoomToExtent(bounds);
    var boxes = new OpenLayers.Layer.Boxes("boxes");
    var box = new OpenLayers.Marker.Box(bounds);
    boxes.addMarker(box);



八:Geometry几何
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
2.自定义符号
	//想了一下还是把OpenLayers.Renderer放在这里吧
	//扩展了几个符号
	OpenLayers.Renderer.symbol.lightning = [0, 0, 4, 2, 6, 0, 10, 5, 6, 3, 4, 5, 0, 0];
	OpenLayers.Renderer.symbol.rectangle = [0, 0, 4, 0, 4, 10, 0, 10, 0, 0];
	OpenLayers.Renderer.symbol.church = [4, 0, 6, 0, 6, 4, 10, 4, 10, 6, 6, 6, 6, 14, 4, 14, 4, 6, 0, 6, 0, 4, 4, 4, 4, 0];
3.添加符号
	var graphics = ["star", "cross", "x", "square", "triangle", "circle", "lightning", "rectangle", "church"];
	new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(..., 0), {
            type: graphics[i]
        });
4.绘制点
	features[i] = new OpenLayers.Feature.Vector(
        new OpenLayers.Geometry.Point(
            (360 * Math.random()) - 180, (180 * Math.random()) - 90
        ), {
            type: 5 + parseInt(5 * Math.random())
        }
    );
5.fromWKT序列化和反序列化
	var original = OpenLayers.Geometry.fromWKT("LINESTRING(" +
	var newLineString = original.simplify(useVal);
6.几何图形的旋转
	new OpenLayers.Feature.Vector(
	    new OpenLayers.Geometry.Point(x, y), {angle: (i*36)%360, opacity:i/10+.1}
	)
7.封闭多边形
    var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
    var polygonFeature = new OpenLayers.Feature.Vector(
        new OpenLayers.Geometry.Polygon([linearRing]));



九:Style样式
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
2.自定义图层样式
	var myStyles = new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    pointRadius: "${type}", // sized according to type attribute
                    fillColor: "#ffcc66",
                    strokeColor: "#ff9933",
                    strokeWidth: 2,
                    graphicZIndex: 1
                }),
                "select": new OpenLayers.Style({
                    fillColor: "#66ccff",
                    strokeColor: "#3399ff",
                    graphicZIndex: 2
                })
            });
    //给向量图层定义 styleMap       
	var points = new OpenLayers.Layer.Vector("Points", {
                styleMap: myStyles,
3.定义筛选规则
	//0 <= blue < 25
	var style = new OpenLayers.Style(
		... ...
        {
            rules: [
                new OpenLayers.Rule({
                    // a rule contains an optional filter
                    filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.LESS_THAN,
                        property: "foo", // the "foo" feature attribute
                        value: 25
                    }),
                    // if a feature matches the above filter, use this symbolizer
                    symbolizer: {
                        externalGraphic: "../img/marker-blue.png"
                    }
                }),




十:Protocol协议
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
5.叠加flickr照片
	//被墙了 看不见效果
	new OpenLayers.Layer.Vector("Some images from Flickr", {
        protocol: new OpenLayers.Protocol.HTTP({
            url: "xml/georss-flickr.xml",
            format: new OpenLayers.Format.GeoRSS({
                // adds the thumbnail attribute to the feature
                createFeatureFromItem: function(item) {
                    var feature = OpenLayers.Format.GeoRSS.prototype.createFeatureFromItem.apply(this, arguments);
                    feature.attributes.thumbnail = this.getElementsByTagNameNS(item, "*", "thumbnail")[0].getAttribute("url");
                    return feature;
                }
            })
        }),
6.wfs协议
	protocol: new OpenLayers.Protocol.WFS({
        url:  "http://demo.opengeo.org/geoserver/wfs",
        featureType: "tasmania_roads",
        featureNS: "http://www.openplans.org/topp"
    })



十一:Format格式
1.CQL
	//感觉这个放Protocol协议不完了么 过度设计了吧...
	var format = new OpenLayers.Format.CQL();
	filter = format.read(cql.value);
2.编码的Polyline
	var format = new OpenLayers.Format.EncodedPolyline({geometryType:"polygon"});
	vector_layer.addFeatures(format.read(encoded));//Layer.Vector
3.过滤
	//是个空间过滤器, 查了一下可以用来过滤和比较范围
	var filter_1_0 = new OpenLayers.Format.Filter({version: "1.0.0"});
    var filter_1_1 = new OpenLayers.Format.Filter({version: "1.1.0"});
	var xml = new OpenLayers.Format.XML();
	value = xml.write(filter_1_0.write(filter));
4.GeoJSON
	//js定义一个GeoJSON格式的对象
	var geojson_format = new OpenLayers.Format.GeoJSON();
	vector_layer.addFeatures(geojson_format.read(featurecollection));
5.将要素序列化为GeoJson
	geojson = new OpenLayers.Format.GeoJSON();
	var str = geojson.write(vectors.features, true);
6.将KML转文本
     g =  new OpenLayers.Format.KML({extractStyles: true});
     features = g.read(req.responseText);
7.SLD的xml
	var format = new OpenLayers.Format.SLD();	
8.各种格式的反序列化
	formats = {
          'in': {
            wkt: new OpenLayers.Format.WKT(in_options),
            geojson: new OpenLayers.Format.GeoJSON(in_options),
            georss: new OpenLayers.Format.GeoRSS(in_options),
            gml2: new OpenLayers.Format.GML.v2(gmlOptionsIn),
            gml3: new OpenLayers.Format.GML.v3(gmlOptionsIn),
            kml: new OpenLayers.Format.KML(kmlOptionsIn),
            atom: new OpenLayers.Format.Atom(in_options),
            gpx: new OpenLayers.Format.GPX(in_options),
            encoded_polyline: new OpenLayers.Format.EncodedPolyline(in_options)
          },
    //"in"/"out" 对应 "read"/"wirte"
	var features = formats['in'][type].read(element.value);
9.WMC格式
	var format = new OpenLayers.Format.WMC({'layerOptions': {buffer: 0}});
	map = format.read(text, {map: map});
	var text = format.write(map);
10.WMSDescribeLayer
	format = new OpenLayers.Format.WMSDescribeLayer();
11.WMTSCapabilities
	format = new OpenLayers.Format.WMTSCapabilities({
12.WPS
    OpenLayers.Request.GET({
    url: wps,
    params: {
        "SERVICE": "WPS",
        "REQUEST": "DescribeProcess",
        "VERSION": capabilities.version,
        "IDENTIFIER": selection
    },
	OpenLayers.Request.POST({
        url: wps,
        data: new OpenLayers.Format.WPSExecute().write(process),
        success: showOutput
    });
13.WPSClient
	client = new OpenLayers.WPSClient({
        servers: {
            opengeo: 'http://demo.opengeo.org/geoserver/wps'
        }
    });
	intersect = client.getProcess('opengeo', 'JTS:intersection');    
14.XML
	var format = new OpenLayers.Format.XML();
	var nodes = format.getElementsByTagNameNS(node, uri, name);
	var attributeNode = format.getAttributeNodeNS(node, uri, name);




十二:Strategy策略
1.加载形状时不请求底图
	new OpenLayers.Layer.Vector("GML", {
	strategies: [new OpenLayers.Strategy.Fixed()],//数据加载前图层是否可见. 
2.聚集策略
	//一堆点挤在一起, 可以设置间距
	strategy = new OpenLayers.Strategy.Cluster();


十三:LonLat坐标
1.坐标转换
	//把"EPSG:4326"转换成map.getProjectionObject()类型的坐标
	new OpenLayers.LonLat(-71.147, 42.472).transform(
	    new OpenLayers.Projection("EPSG:4326"),
	    map.getProjectionObject()
	)
2.Proj4JS坐标转换
	geometry = new OpenLayers.Geometry.Point(x, y);
	geometry.transform(
        new OpenLayers.Projection('EPSG:4326'), 
        new OpenLayers.Projection('EPSG:31467')
    );



十四:Bounds边界
	var extent = new OpenLayers.Bounds(8, 44.5, 19, 50);



十五:Util工具
1.extend扩展(猜是遍历拷贝的,回头看源码)
	this.handlerOptions = OpenLayers.Util.extend(
	    {}, this.defaultHandlerOptions
	);
2.接收url传参
	//最后的.param是参数名, 如?param=XXXX
	OpenLayers.Util.getParameters(window.location.href).param
3.DOM查询
	OpenLayers.Util.getElement('opacity').value



十六:Console控制台
1.使用Console
	//引入"/lib/Firebug/firebug.js", 回头得看看这个控制台怎么实现的
	OpenLayers.Console.log()
	OpenLayers.Console.warn()
	OpenLayers.Console.error()
	OpenLayers.Console.dir()
	OpenLayers.Console.dirxml()



十七:Filter过滤器
1.比较过滤器
	filter = new OpenLayers.Filter.Comparison({
	    type: OpenLayers.Filter.Comparison.BETWEEN,
	    property: "when",
	    lowerBoundary: startDate,
	    upperBoundary: new Date(startDate.getTime() + (parseInt(spanEl.value, 10) * 1000))
	});
2.WFS过滤器
	new OpenLayers.Layer.Vector("WFS", {
            strategies: [new OpenLayers.Strategy.BBOX()],
            protocol: new OpenLayers.Protocol.WFS({
                url:  "http://demo.opengeo.org/geoserver/wfs",
                featureType: "tasmania_roads",
                featureNS: "http://www.openplans.org/topp"
            }),
            styleMap: ......,
            filter: new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.OR,
                filters: [
                    new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "TYPE",
                        value: "highway"
                    }),
                    new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "TYPE",
                        value: "road"
                    })
                ]
            })
        })



十八:Request请求
1.get请求
	OpenLayers.Request.GET({
	    url: "kml/lines.kml",
	    success: parseData
	});
2.post请求 
	OpenLayers.Request.POST({
	    url: "http://www.openrouteservice.org/php/OpenLSLUS_Geocode.php",
	    scope: this,
	    failure: this.requestFailure,
	    success: this.requestSuccess,
	    headers: {"Content-Type": "application/x-www-form-urlencoded"},
	    data: "FreeFormAdress=" + encodeURIComponent(queryString) + "&MaxResponse=1"
	});



十九:Size尺寸
	size = new OpenLayers.Size(size.w + 10, size.h + 10);
    icon.setSize(size);



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
3.Ajax跨域
	//这个回头得看看源码, 看看他纯前端怎么个思路
	OpenLayers.ProxyHost = "/proxy/?url=";
4.几种协议需要去了解一下异同
	WMS WMC WFS WMTS WPS
5.还有几个用得比较少的图层
	WorldWind KaMap 	
