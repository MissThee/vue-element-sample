<template>
    <div ref="mainDiv" style="overflow: hidden;height: 100%;">
        <el-row class="layout-fit">
            <el-col :span="leftSpan" class="layout-fit">
                <div ref="searchBar" style="overflow: hidden">
                    <div :gutter="20" class="grid-tool-bar">
                        <el-button style="float:left" size="mini" type="primary" @click="handleCreate()">添加</el-button>
                        <el-input style="float:left;width: 130px;margin:0 0 0 15px" placeholder="重点单位名称查找" size="mini" v-model="keyWords.name"></el-input>
                        <el-button style="float:left" size="mini" type="primary" @click="loadTable()">查找</el-button>
<!--                        ,width:showMapSpace?'15px':'',paddingLeft:showMapSpace?'5px':''-->
                        <el-button :icon="showMapSpace?'el-icon-arrow-right':'el-icon-arrow-left'" :style="{float:'right',marginRight:'-5px',fontWeight: 'bold'}" size="mini" type="danger" @click="handleSwitchMap()" plain>
                            {{showMapSpace?'收起地图':'展开地图'}}
                        </el-button>
                    </div>
                </div>
                <el-table :key="'用Math.random()渲染会频繁触发使自适应高度变慢'" :data="importantCompanyTableData" @row-click="handleRowClick" :height="clientHeight-searchBarHeight-pageBarHeight" stripe :default-sort="{prop: 'name', order: 'ascending'}" border>
                    <el-table-column :width="50" key="index" type="index" label="序号"></el-table-column>
                    <el-table-column :min-width="140" key="importantCompany" prop="importantCompany" label="重点单位" sortable></el-table-column>
                    <el-table-column :width="140" key="area" v-if="!showMapSpace" prop="area" label="区域" sortable></el-table-column>
                    <el-table-column :width="140" key="protectedRange" v-if="!showMapSpace" prop="protectedRange" label="消防保护范围" sortable></el-table-column>
                    <el-table-column :width="140" key="type" v-if="!showMapSpace" prop="type" label="类别" sortable></el-table-column>
                    <el-table-column :width="140" key="address" v-if="!showMapSpace" prop="address" label="具体位置" sortable></el-table-column>
                    <el-table-column :width="140" key="level" v-if="!showMapSpace" prop="level" label="级别" sortable></el-table-column>
                    <el-table-column :width="140" key="responsePerson" v-if="!showMapSpace" prop="responsePerson" label="消防责任人" sortable></el-table-column>
                    <el-table-column :width="140" key="contactInformation" v-if="!showMapSpace" prop="contactInformation" label="联系方式" sortable></el-table-column>
                    <el-table-column key="operation" fixed="right" label="操作" width="106">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="handleUpdate(scope.row.id)" plain><i class="el-icon-edit "></i>编辑
                            </el-button>
                            <el-button size="mini" type="text" style="color:red;" @click="handelDelete(scope.row.id,scope.row.importantCompany)" plain><i class="el-icon-remove "></i>删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div ref="pageBar" style="overflow: hidden">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page="pageNumber"
                            :page-size="pageSize"
                            layout=" prev, pager, next, jumper"
                            :total="totalRow">
                    </el-pagination>
                </div>
            </el-col>
            <el-col v-show="showMapSpace" :span="rightSpan" class="layout-fit">
                <div v-if="ifMap" id="container" class="layout-fit"></div>
            </el-col>
        </el-row>
        <el-dialog width="50%" top="50px" :title="dialogTitle[formDialogStatus]" :visible.sync="formDialogVisible" append-to-body>
            <el-form class="form-mini" :rules="rules" ref="formData" size="mini" :model="form" label-width="120px">
                <!--<el-form-item label="id" prop="id"><el-input v-model="form.id"></el-input></el-form-item>-->
                <el-form-item label="重点单位名称" prop="importantCompany">
                    <el-input :readonly="formDialogStatus==='view'" v-model="form.importantCompany"></el-input>
                </el-form-item>
                <el-form-item label="区域" prop="area">
                    <el-input :readonly="formDialogStatus==='view'" v-model="form.area"></el-input>
                </el-form-item>
                <el-form-item label="消防保护范围" prop="protectedRange">
                    <el-input :readonly="formDialogStatus==='view'" v-model="form.protectedRange"></el-input>
                </el-form-item>
                <el-form-item label="类别" prop="type">
                    <el-input :readonly="formDialogStatus==='view'" v-model="form.type"></el-input>
                </el-form-item>
                <el-form-item label="具体位置" prop="address">
                    <el-input :readonly="formDialogStatus==='view'" v-model="form.address"></el-input>
                </el-form-item>

                <el-form-item label="级别" prop="level">
                    <el-input :readonly="formDialogStatus==='view'" v-model="form.level"></el-input>
                </el-form-item>

                <el-form-item label="消防责任人" prop="responsePerson">
                    <el-input :readonly="formDialogStatus==='view'" v-model="form.responsePerson"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contactInformation">
                    <el-input :readonly="formDialogStatus==='view'" v-model="form.contactInformation"></el-input>
                </el-form-item>

                <el-form-item label="经纬度" label-width="120px">
                    <el-col :span="9">
                        <el-form-item label-width="50px" label="经度" prop="lng">
                            <el-input :readonly="formDialogStatus==='view'" v-model="form.lng"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label-width="50px" label="纬度" prop="lat">
                            <el-input :readonly="formDialogStatus==='view'" v-model="form.lat"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-select :disabled="formDialogStatus==='view'" v-model="form.coordinateType" placeholder="请选择">
                            <el-option
                                    v-for="item in coordinateTypes"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <!--<el-form-item label-width="50px" label="坐标类型" prop="lat">-->
                        <!--<el-input :readonly="formDialogStatus==='view'" v-model="form.lat"></el-input>-->
                        <!--</el-form-item>-->
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" v-if="formDialogStatus!=='view'" class="dialog-footer">
          <el-button v-if=" formDialogStatus!=='view'" @click="formDialogVisible = false">取消</el-button>
          <el-button v-if=" formDialogStatus!=='view'" type="primary" @click="postData()">确定</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import BMap from 'BMap'
    import {createImportantCompany, deleteImportantCompany, fetchCompanyTable, fetchImportantCompany, updateImportantCompany} from '../../../api/important-company'
    import {showNotify} from 'src/utils/tools'
    import coordtransform from 'coordtransform'
    import marker from 'src/assets/baidumappoint/marker_red.png'

    export default {
        name: 'importantCompany',
        data() {
            return {
                coordinateTypes: [
                    {value: "bd09", label: "百度bd09"},
                    {value: "wgs84", label: "地球wgs84"},
                    {value: "gcj02", label: "火星gcj02"},
                ],
                map: undefined,
                clientHeight: 0,
                searchBarHeight: 0,
                pageBarHeight: 0,
                points: [
                    // {"lng": 116.092, "lat": 38.715},
                    // {"lng": 116.112, "lat": 38.705},
                    // {"lng": 116.122, "lat": 38.725}
                ],
                lastFocusPoint: {},
                focusPoint: {
                    lng: 116.092957,
                    lat: 38.715097
                },
                importantCompanyTableData: [],
                icons: [new BMap.IconSequence(new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                    scale: 0.6,//图标缩放大小
                    strokeColor: '#fff',//设置矢量图标的线填充颜色
                    strokeWeight: '2',//设置线宽
                }), '10', '60')],
                ifMap: false,
                showMapSpace: false,
                leftSpan: 24,
                // pager:{
                //   layout:"total, sizes, prev, pager, next, jumper",
                //   layout_min:"total, sizes, prev, pager, next",
                // }
                rules: {
                    importantCompany: [{required: true, message: ' ', trigger: 'blur'}],
                },
                form: {
                    id: "",
                    area: "",
                    protectedRange: "",
                    type: "",
                    importantCompany: "",
                    address: "",
                    level: "",
                    responsePerson: "",
                    contactInformation: "",
                    lng: "",
                    lat: "",
                },
                formDialogStatus: "",
                formDialogVisible: false,
                dialogTitle: {
                    update: '编辑',
                    create: '创建',
                    view: '查看'
                },
                keyWords: {name: ''},
                pageNumber: 1,
                pageSize: 100,
                totalRow: 0,
                typeColors: []
            }
        },
        mounted() {
            this.loadTable();
            this.fixTableHeight();
            this.$nextTick(() => {
                this.searchBarHeight = this.$refs.searchBar.clientHeight;
                this.pageBarHeight = this.$refs.pageBar.clientHeight;
                this.handleSwitchMap();
            });
        },
        computed: {
            rightSpan() {
                return 24 - this.leftSpan
            }
        },
        activated() {
            this.fixTableHeight();
        },
        methods: {
            // addMarkers() {
            //     let points = this.importantCompanyTableData;
            //     for (let i = 0; i < points.length; i++) {
            //         let fixedPoint = this.transPoint(points[i].lng, points[i].lat, points[i].coordinateType)
            //         let marker = new BMap.Marker(new BMap.Point(fixedPoint.lng, fixedPoint.lat));
            //         let label = new BMap.Label(points[i].importantCompany, {offset: new BMap.Size(20, -10)});
            //         marker.setLabel(label);
            //         let that = this;
            //         marker.addEventListener("click", function () {
            //             that.handleView(points[i].id)
            //         });
            //         this.map.addOverlay(marker);
            //     }
            // },
            // addMarker(lng, lat) {
            //     let fixedPoint = this.transPoint(lng, lat);
            //     let marker = new BMap.Marker(new BMap.Point(fixedPoint.lng, fixedPoint.lat));
            //     this.map.addOverlay(marker);
            // },
            addColorMakers() {
                let page = this;

                // 复杂的自定义覆盖物
                function ComplexCustomOverlay(point, text, id, area, color) {
                    this._point = point;
                    this._text = text;
                    this._id = id;
                    this._color = color;
                    this._area = area;
                    this._div = document.createElement("div");
                }

                ComplexCustomOverlay.prototype = new BMap.Overlay();
                ComplexCustomOverlay.prototype.initialize = function (map) {
                    this._map = map;
                    this._div.style.position = "absolute";
                    this._div.style.cursor = 'pointer';
                    let self = this;

                    class textDiv {//文字
                        constructor(...text) {
                            this.text = document.createElement("div");
                            this.text.style.position = "absolute";//重要
                            this.text.style.backgroundColor = "#FFFFFF";
                            this.text.style.border = "1px solid #BC3B3A";
                            this.text.style.fontWeight = "bold";
                            this.text.style.whiteSpace = "nowrap";
                            this.text.style.color = "red";
                            this.text.style.fontSize = "12px";
                            this.text.style.lineHeight = "12px";
                            this.text.style.padding = "2px";
                            this.text.style.marginLeft = "20px";
                            this.addContext(text);
                        }

                        addContext(text) {
                            let lineNumber = 0;
                            text.forEach((item, index, input) => {
                                lineNumber++;
                                if (lineNumber > 1) {
                                    this.text.appendChild(document.createElement("br"));
                                }
                                this.text.appendChild(document.createTextNode(item));
                                this.text.style.marginTop = -(6 + Math.max(lineNumber - 1) * 12) + 'px';
                            })
                        }
                    }

                    class pointImg {//坐标点
                        constructor() {
                            this.point = document.createElement("img");
                            this.point.style.position = "absolute";//重要
                            this.point.src = marker;//"url(/baiduMapAssets/marker_red_sprite.png) no-repeat";
                            // this.point.style.width = "25px";
                            // this.point.style.height = "25px";
                            // this.point.style.top = "0px";
                            // this.point.style.left = "0px";
                            // this.point.style.overflow = "hidden";
                            // this.point.style.zIndex = '100';
                            for (let i in self._color) {
                                if (self._color[i].area === self._area) {
                                    this.point.style.filter = 'hue-rotate(' + self._color[i].hueRotate + 'deg)';
                                    break;
                                }
                            }
                        }
                    }

                    this._div.appendChild(new textDiv(this._text).text);//创建、添加文字
                    this._div.appendChild(new pointImg().point);//创建、添加坐标点
                    this._div.onclick = () => {//添加点击事件
                        page.handleView(this._id)
                    };
                    map.getPanes().labelPane.appendChild(this._div);
                    return this._div;//无此语句，换页时自定义覆盖物不能正确显示
                };
                ComplexCustomOverlay.prototype.draw = function () {
                    let pixel = this._map.pointToOverlayPixel(this._point);
                    //此处绘制自定义覆盖物，需减去覆盖物一般宽度，整个高度，使覆盖物低端中央与坐标点保持位置一致
                    this._div.style.left = pixel.x - 12.5 + "px";
                    this._div.style.top = pixel.y - 25 + "px";
                };

                // // 复杂的自定义覆盖物
                // function ComplexCustomOverlay(point, text, id, area, typeColors) {
                //   this._point = point;
                //   this._text = text;
                //   this._id = id;
                //   this._area = area;
                //   this._typeColors = typeColors;
                // }
                //
                // ComplexCustomOverlay.prototype = new BMap.Overlay();
                // ComplexCustomOverlay.prototype.initialize = function (map) {
                //   this._map = map;
                //   var div = this._div = document.createElement("div");
                //   div.style.position = "absolute";
                //   div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                //
                //   let span = document.createElement("div");
                //   span.style.backgroundColor = "#FFFFFF";
                //   span.style.border = "1px solid #BC3B3A";
                //   span.style.color = "red";
                //   span.style.height = "20px";
                //   span.style.fontWeight = "bold";
                //   span.style.padding = "2px";
                //   span.style.lineHeight = "18px";
                //   span.style.whiteSpace = "nowrap";
                //   span.style.MozUserSelect = "none";
                //   span.style.fontSize = "12px";
                //   span.style.marginLeft = "15px";
                //   span.style.marginTop = "-15px";
                //   span.appendChild(document.createTextNode(this._text));
                //   div.appendChild(span);
                //   let arrow  = document.createElement("div");
                //   arrow.style.background = "url(/baiduMapAssets/marker_red_sprite.png) no-repeat";
                //   arrow.style.position = "absolute";
                //   arrow.style.width = "25px";
                //   arrow.style.height = "39px";
                //   arrow.style.top = "0px";
                //   arrow.style.left = "0px";
                //   arrow.style.overflow = "hidden";
                //   arrow.style.zIndex = '100';
                //
                //   for (let i in this._typeColors) {
                //     if (this._typeColors[i].area === this._area) {
                //       arrow.style.filter = 'hue-rotate(' + this._typeColors[i].hueRotate + 'deg)';
                //       break;
                //     }
                //   }
                //   div.appendChild(arrow);
                //   let _id = this._id;
                //   arrow.onclick = function () {
                //     console.log('点击了点，id：', _id);
                //     self.handleView(_id)
                //   };
                //
                //   map.getPanes().labelPane.appendChild(div);
                //   return div;
                // };
                // ComplexCustomOverlay.prototype.draw = function () {
                //   let map = this._map;
                //   let pixel = map.pointToOverlayPixel(this._point);
                //   this._div.style.left = pixel.x - 13 + "px";
                //   this._div.style.top = pixel.y - 25 + "px";
                // };

                this.map.clearOverlays();
                let points = this.importantCompanyTableData;
                let pointArray = [];
                for (let i = 0; i < points.length; i++) {
                    let fixedPoint = this.transPoint(points[i].lng, points[i].lat, points[i].coordinateType)
                    let myCompOverlay = new ComplexCustomOverlay(new BMap.Point(fixedPoint.lng, fixedPoint.lat), points[i].importantCompany, points[i].id, points[i].area, this.typeColors);
                    this.map.addOverlay(myCompOverlay);
                    pointArray.push(new BMap.Point(fixedPoint.lng, fixedPoint.lat));
                }

                if (isFinite(this.lastFocusPoint.lng) && isFinite(this.lastFocusPoint.lat)) {
                    let fixedPoint = this.transPoint(this.lastFocusPoint.lng, this.lastFocusPoint.lat, this.lastFocusPoint.coordinateType);
                    this.focus(fixedPoint.lng, fixedPoint.lat, 15);
                } else {
                    //让所有点在视野范围内
                    this.map.setViewport(pointArray);
                }
            },
            focus(fixedPointLng, fixedPointLat, zoomLevel) {
                if (this.showMapSpace) {
                    if (isNaN(zoomLevel)) {
                        zoomLevel = 15;
                    }
                    let point = new BMap.Point(fixedPointLng, fixedPointLat);   // 创建点坐标
                    this.map.centerAndZoom(point, zoomLevel); // 初始化地图，设置中心点坐标和地图级别
                    this.map.panTo(point);
                }
            },
            setColorForEachType() {
                this.typeColors = [];
                let hueRotate = 0;
                for (let i in this.importantCompanyTableData) {
                    let hasThisItem = false;
                    for (let j in this.typeColors) {
                        if (this.typeColors[j].area === this.importantCompanyTableData[i].area) {
                            hasThisItem = true;
                        }
                    }
                    if (!hasThisItem) {
                        let item = {area: this.importantCompanyTableData[i].area, hueRotate};
                        this.typeColors.push(item);
                        hueRotate += 140
                    }
                }
            },
            initMap() {
                if (this.map === undefined) {
                    this.map = new BMap.Map("container")  // 创建地图实例
                    let fixedPoint = this.transPoint(116.092, 38.715, "bd09")
                    this.map.centerAndZoom(new BMap.Point(fixedPoint.lng, fixedPoint.lat), 5);
                    this.map.enableScrollWheelZoom(true);
                    this.map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]}));//添加[地图/混合]按钮
                    this.map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));//左上角比例尺
                    this.map.addControl(new BMap.NavigationControl());//左上角，添加默认缩放平移控件
                }
            },
            loadTable() {
                fetchCompanyTable(this.pageNumber, this.pageSize, this.keyWords).then(
                    response => {
                        this.importantCompanyTableData = response.data.importantCompanyTable;
                        this.totalRow = response.data.totalRow;
                        if (this.ifMap) {
                            setTimeout(() => {
                                this.lastFocusPoint = {};
                                this.setOrUpdateMap()
                            }, 100);
                        }
                    }
                )
            },
            handleRowClick(row) {
                let fixedPoint = this.transPoint(row.lng, row.lat, row.coordinateType)
                this.lastFocusPoint = {"lng": fixedPoint.lng, "lat": fixedPoint.lat}
                this.focus(fixedPoint.lng, fixedPoint.lat, 15);
            },
            handleSwitchMap() {
                if (this.showMapSpace) {
                    this.showMapSpace = false;
                    this.leftSpan = 24
                } else {
                    this.showMapSpace = true;
                    this.leftSpan = 9;
                }
                if (!this.ifMap) {
                    this.ifMap = true;
                    setTimeout(() => {
                        this.setOrUpdateMap();
                    }, 100)
                }
            },
            setOrUpdateMap() {
                this.initMap();
                this.setColorForEachType();
                this.addColorMakers();
            },

            handelDelete(id, importantCompany) {
                this.$confirm('将删除单位 <span style="color:blue">' + importantCompany + '</span>，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    deleteImportantCompany(id).then(
                        response => {
                            this.loadTable();
                            showNotify(response, '删除');
                        }
                    )
                }).catch(() => {
                    // this.$message({
                    //   type: 'info',
                    //   message: '已取消删除'
                    // });
                });
            },
            handleUpdate(id) {
                fetchImportantCompany(id).then(response => {
                    this.form = response.data.importantCompany;
                });
                this.formDialogStatus = 'update';
                this.formDialogVisible = true;
            },
            handleView(id) {
                for (let i = 0; i < this.importantCompanyTableData.length; i++) {
                    if (this.importantCompanyTableData[i].id === id) {
                        this.form = this.importantCompanyTableData[i];
                    }
                }
                this.formDialogStatus = 'view';
                this.formDialogVisible = true;
                this.$nextTick(() => {
                    this.$refs['formData'].clearValidate()
                })
            },
            handleCreate() {
                this.form = {
                    area: "",
                    protectedRange: "",
                    type: "",
                    importantCompany: "",
                    address: "",
                    level: "",
                    responsePerson: "",
                    contactInformation: "",
                    lng: "",
                    lat: "",
                    coordinateType: "bd09"
                };
                this.formDialogStatus = 'create';
                this.formDialogVisible = true;
            },
            postData() {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        if (this.formDialogStatus === 'update') {
                            updateImportantCompany(this.form).then(response => {
                                this.formDialogVisible = false;
                                this.loadTable();
                                showNotify(response, '更新');
                            })
                        } else if (this.formDialogStatus === 'create') {
                            createImportantCompany(this.form).then(response => {
                                this.formDialogVisible = false;
                                this.loadTable();
                                showNotify(response, '添加');
                            })
                        }
                    }
                })
            },

            transPoint(lng, lat, coordinateType) {
                if (coordinateType === "bd09") {
                    return {"lng": lng, "lat": lat};
                } else if (coordinateType === "wgs84") {
                    var wgs84togcj02 = coordtransform.wgs84togcj02(lng, lat);
                    var gcj02tobd09 = coordtransform.gcj02tobd09(wgs84togcj02[0], wgs84togcj02[1]);
                    return {"lng": gcj02tobd09[0], "lat": gcj02tobd09[1]};
                } else if (coordinateType === "gcj02") {
                    var gcj02tobd09 = coordtransform.gcj02tobd09(lng, lat);
                    return {"lng": gcj02tobd09[0], "lat": gcj02tobd09[1]};
                } else {
                    return {"lng": lng, "lat": lat};
                }
            },
            handleCurrentChange(val) {
                this.pageNumber = val;
                this.loadTable();
            },
            fixTableHeight() {
                const that = this;
                this.$nextTick(function () {
                    that.clientHeight = that.$refs.mainDiv.clientHeight;
                    window.onresize = function temp() {
                        that.clientHeight = that.$refs.mainDiv.clientHeight;
                    };
                })
            },
        }
    }
</script>

<style scoped>
    .layout-fit {
        height: 100%;
    }


    .form-mini div {
        margin-bottom: 5px;
    }

</style>
