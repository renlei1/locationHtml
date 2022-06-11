<template>
  <div id="container" ref="container">123</div>
</template>

<script>
import TMap from "https://map.qq.com/api/gljs?v=1.exp&key=zmemBqvm9zY5MwzD1cvEDIQr8jqS1kr"

export default {
    mounted(){
        this.initMap();
    },
    // watch:{
    //     initMap();
    // },
    methods:{
        initMap() {
	        //创建map对象，初始化地图
	         var center = new TMap.LatLng(31.683617, 118.558927);
	        var map = new TMap.Map(this.$refs.container, {
	            center: center,//设置地图中心点坐标
	            zoom: 17.2,   //设置地图缩放级别
	            pitch: 43.5,  //设置俯仰角
	            rotation: 45    //设置地图旋转角度
	        });
	        //创建并初始化MultiMarker
	        var markerLayer = new TMap.MultiMarker({
	            map: map,  //指定地图容器
	            //样式定义
	            styles: {
	                 marker: new TMap.MarkerStyle({
	                            width: 20, // 样式宽
	                            height: 30, // 样式高
	                            anchor: { x: 10, y: 30 }, // 描点位置
	                          }),
	                        },
	            //点标记数据数组
	            geometries: [
	                     // 点标记数据数组
	                     {
	                       // 标记位置(纬度，经度，高度)
	                       position: center,
	                       id: 'marker',
	                     },
	                   ],
	                 });
	    }
    },
}
</script>

<style>

 #container{
            /*地图(容器)显示大小*/
            width:1200px;
            height:400px;
        }
</style>