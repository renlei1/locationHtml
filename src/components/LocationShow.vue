<template>
  <body>
    <div id="container"></div>
  </body>
</template>

<style scoped>
#container {
  /*地图(容器)显示大小*/ /*设置为全屏，位于最下层*/
  width: width;
  height: height;
  /* position: absolute; */
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 0;
}
</style>

<script>
import request from "@/utils/request";
export default {
  props: ["boHeight", "boxWith"],
  data() {
    return {
      // markerUrl: require("../assets/marker.png"),  // 点标记图片路径
      map: "",
      zoom: 17.2, // 地图一开始的缩放级别
      center: new window.TMap.LatLng(31.683617, 118.558927), // 地图一开始的中心点
      points: [],
      point: {
        id: "",
        latitue: "",
        longitue: "",
      },
      geometry: {
        id: "", //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
        styleId: "mystyle", //指定样式id
        position: Object, //点标记坐标位置
      },
      geometries: [],
      markerLayers: [],
      markerLayer: {},
      locationData: [],
      locationList: [],
    };
  },
  // created() {
  //   this.getLocation();
  //   console.log(this.points)
  //   this.initMap(this.center, this.zoom); // 初始化页面后直接初始化地图
  // },
  mounted() {
    this.getLocation();
    if (window.onload) {
      this.initMap(this.center, this.zoom);
    } else {
      window.addEventListener("load", () => {
        this.initMap(this.center, this.zoom);
      });
    }
  },
  methods: {
    getLocation() {
      request.get("/dispatch/getGPSLocation").then((res) => {
        this.locationData = res.data.data;

        for (let index = 0; index < this.locationData.length; index++) {
          const element = this.locationData[index];
          this.locationList.push({
            index: index,
            latitue: element.latitue,
            longitue: element.longitue,
          });
          // this.point.latitue = element.latitue;
          // this.point.longitue = element.longitue;
          // this.points.push(this.point);
          // this.point = {};
          this.markerLayers.push({
            id: element.targetId,
            styleId: "mystyle",
            position: new window.TMap.LatLng(element.longitue, element.latitue),
            properties: {}, // 自定义属性，可以没有
          });
          this.geometry.id=element.targetId
          this.geometry.styleId="mystyle"
          this.geometry.position= new window.TMap.LatLng(element.longitue, element.latitue)
         
          this.geometries.push(this.geometry);
          this.geometry={}

        }
        console.log( this.geometries)
      });
    },
    initMap(center, zoom) {
      this.map = new window.TMap.Map(document.getElementById("container"), {
        center: center, //设置地图中心点坐标
        zoom: zoom, //设置地图缩放级别
        pitch: 43.5, //设置俯仰角
        rotation: 45, //设置地图旋转角度
      });

      this.markerLayers = new window.TMap.MultiMarker({
        // 创建标记层
        map: this.map, //指定地图容器
        geometries: this.geometries,
        styles: {
          // 点标记样式
          mystyle: new window.TMap.MarkerStyle({
            width: 20,
            height: 30,
            anchor: { x: 10, y: 30 },
            opacity: 0.5,
          }),
        },
      });
      // this.forList();
    },
    //循环添加标记点
    // forList(){

    //   for (let index = 0; index < this.locationList.length; index++) {
    //     const element = this.locationList[index];
    //     console.log(element);
    //       this.addPoint(element);
    //   }
    // },

    // 添加点标记
    // addPoint(location) { // 一个point需要有id和坐标

    //     this.markerLayers.add(
    //         {
    //             'id': point[location.index],
    //             'styleId': 'mystyle',
    //             "position": new window.TMap.LatLng(location.latitue, location.longitue),
    //             "properties":{} // 自定义属性，可以没有
    //         }
    //     )
    // },
  },
};
</script>