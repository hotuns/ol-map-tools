<template>
  <div class="mapviewer">
    <ol-map
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      @singleclick="onMapSingleclick"
      @dblclick="onMapDbclick"
    >
      <ol-view
        @ready="viewReady"
        ref="view"
        :center="mapOptions.center"
        :rotation="mapOptions.rotation"
        :zoom="mapOptions.zoom"
        :projection="mapOptions.projection"
      />

      <!-- 鼠标右键菜单 -->
      <ol-context-menu :items="contextMenuItems" />

      <!-- start ----- 控件 -->
      <ol-fullscreen-control />
      <ol-mouseposition-control :coordinateFormat="coordinateFormat" />
      <ol-attribution-control />

      <ol-overviewmap-control>
        <ol-tile-layer>
          <ol-source-tianditu
            layerType="vec"
            projection="EPSG:4326"
            :tk="mapOptions.tianditukey"
          ></ol-source-tianditu>
        </ol-tile-layer>
      </ol-overviewmap-control>

      <ol-scaleline-control />
      <ol-rotate-control />
      <ol-zoom-control />
      <ol-zoomslider-control />
      <ol-zoomtoextent-control
        :extent="[23.906, 42.812, 46.934, 34.597]"
        tipLabel="Fit to Turkey"
      />
      <!-- 控件------end -->

      <!-- 天地图 -->
      <ol-tile-layer>
        <ol-source-tianditu
          layerType="img"
          projection="EPSG:4326"
          :tk="mapOptions.tianditukey"
          :hidpi="true"
        ></ol-source-tianditu>
      </ol-tile-layer>
      <!--  -->
      <ol-tile-layer>
        <ol-source-tianditu
          :isLabel="true"
          layerType="img"
          projection="EPSG:4326"
          :tk="mapOptions.tianditukey"
          :hidpi="true"
        ></ol-source-tianditu>
      </ol-tile-layer>
    </ol-map>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  toRefs,
  computed,
} from "vue";
import { GPX, GeoJSON, IGC, KML, TopoJSON } from "ol/format";
import { Map, View } from "ol";
import { toStringXY } from "ol/coordinate";
import { Circle, Point } from "ol/geom";
import { Style, Stroke, Fill, Image } from "ol/style";
import Feature from "ol/Feature";
import { copyText } from "../utils";

export default defineComponent({
  name: "mapViewer",
  setup() {
    const state = reactive({
      olMap: null as Map | null,
      olView: null as View | null,
    });

    const contextMenuItems = ref([] as any[]);

    const mapOptions = ref({
      tianditukey: "dbed7e0f96194affd82763e159de4c50",
      center: [116.41124529391394, 39.953530444730816],
      projection: "EPSG:4326",
      zoom: 5,
      maxZoom: 21,
      rotation: 0,
      format: new GeoJSON(),
    });

    const viewReady = (map: Map, view: View) => {
      console.log(map, view);
      state.olMap = map;
      state.olView = view;

      contextMenuItems.value = [
        {
          text: "居中显示",
          classname: "some-style-class", // add some CSS rules
          callback: (val: { coordinate: number[]; data: any }) => {
            if (state.olView) {
              state.olView.animate({ center: val.coordinate, duration: 500 });
            }
          }, // `center` is your callback function
        },
        {
          text: "复制此坐标",
          classname: "some-style-class", // add some CSS rules
          callback: (val: { coordinate: number[]; data: any }) => {
            state.olView && state.olView.setCenter(val.coordinate);
            copyText(String(val.coordinate));
          }, // `center` is your callback function
        },
        // {
        // 	text: 'Add a Marker',
        // 	classname: 'some-style-class', // you can add this icon with a CSS class
        // 	// instead of `icon` property (see next line)
        // 	// icon: marker, // this can be relative or absolute
        // 	callback: (val: any) => {
        // 		console.log(val);
        // 		let feature = new Feature({
        // 			geometry: new Geom.Point(val.coordinate),
        // 		});
        // 		markers.value.source.addFeature(feature);
        // 	},
        // },
        "-", // this is a separator
      ];
    };

    // 点 样式
    const overrideStyleFunction = (feature: Point, style: Style) => {
      let clusteredFeatures = feature.get("features");
      let size = clusteredFeatures.length;
      // 大小
      let img = style.getImage();
      // 文字
      if (size == 1) {
        style.getText().setText("");
        img.setScale(0.2);
      } else if (size > 1) {
        style.getText().setText(size.toString());

        img.setScale(Math.min(0.1 * size, 0.3));
      }
    };

    // 格式化显示右下角-鼠标位置
    const coordinateFormat = (coordinate: [number, number]) => {
      return `经度：${coordinate[0]}; 纬度：${coordinate[1]}`;
    };

    // 单击地图
    const onMapSingleclick = (event: any) => {
      const map = state.olMap as Map;
      let feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );
      if (feature) {
        console.log(feature);
      }
    };

    // 双击地图
    const onMapDbclick = (event: any) => {
      const map = state.olMap as Map;
      let feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );
      if (feature) {
        console.log("db", feature);
      }
    };

    onMounted(() => {});

    return {
      mapOptions,
      viewReady,
      contextMenuItems,
      overrideStyleFunction,
      coordinateFormat,
      onMapDbclick,
      onMapSingleclick,
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss" scoped>
.mapviewer {
  width: 100%;
  height: 100%;
}
</style>
