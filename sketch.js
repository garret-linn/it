/* -----------
//to do: 
add css
do better bacgground music
*/
////////////////////////
//https://codesandbox.io/s/mapbox-switch-style-qs8c5?from-embed=&file=/src/index.js:0-1737
//https://dev.to/dqunbp/effectively-switching-mapbox-gl-styles-1a3i
// API Key for Mapbox. Get one here:
// https://www.mapbox.com/studio/account/tokens/
const key = 'pk.eyJ1IjoiY295YXJ6dW4iLCJhIjoiY2t2aWs2cXlsNHZybTJvcXB1emt2ZDFnZSJ9.HuCWasiKvtDaHlSrjog9bw';

var target = [[-73.245209+5,-39.819588-14],[-70.9333,-53.1667],[-70.64827,-33.45694],[-70.9333,-53.1667]];//valdi, pta arenas, stgo
var studio = [true,true,true,true];
var pitch = [20,30,0,0]
var zoom = [4,7,6,2];
var bearing = [90,-90,180,180];//
var style = [ "mapbox://styles/mapbox/traffic-night-v2", "mapbox://styles/mapbox/satellite-v9"];
// Options for map
const options = {
  lng:  target[0][0],//-70.64827,
  lat:  target[0][1]-3.000,//-33.45694,//,
  zoom: 3.85,//zoom[3],
  studio: true, // false to use non studio styles
  pitch: pitch[0], // pitch in degrees
  bearing: bearing[0],//, // bearing in degrees
  style: style[1],//'mapbox://styles/mapbox/satellite-v9'
  attributionControl: false
};
var stylized = false;
// Create an instance of Mapbox
const mappa = new Mappa('MapboxGL', key);

var mapMarkerIcon;

/////////////////////////////////////////////////////////////////////////////////////
let myMap;
let canvas;
var viewGUI_1, viewGUI_2, viewGUI_3, styleGUI_1, styleGUI_2, styleGUI_3, videoGUI;
/////////////////////////////////////////////////////////////////////////////////////
var bgImage, bgIndex;
const VIDEO_ROOT = "media/video/";//https://storage.googleapis.com/gatito/"
let videos = [];
var rockTable, oscTable, perspectiveTable;
var rockNodes = [];
var oscNodes = [];
var perspectiveNodes = [];
////////////////////////////////////////////////////////////////////////////////////
var toggleRocksBox, toggleOscBox, togglePerspectiveBox;
var toggleRocks, toggleOsc, togglePerspective;
var launchCreditos
;var drawRocks =  true;
var drawOsc   = true;
var drawPerspective = true;
var textoCreditos;
////////////////////////////////////////////////////////////////////////////////////
var rockHue        = 0;
var oscHue         = 24;
var perspectiveHue = 48;
////////////////////////////////////////////////////////////////////////////////////
var bgMusic        = [];
////////////////////////////////////////////////////////////////////////////////////
function preload(){
  mapMarkerIcon    = loadImage("media/utilities/map-marker-icon.png");

  rockTable        = loadTable('data/inventario_Gral.xlsx - rocas.csv', 'csv');
  oscTable         = loadTable('data/inventario_Gral.xlsx - osc (1).csv', 'csv');
  perspectiveTable = loadTable('data/inventario_Gral.xlsx - perspectivas(4).csv', 'csv');

  textoCreditos    = loadStrings('creditos.html');
  //videos.push(createVideo(VIDEO_ROOT+"2846381811.mp4"));
  //videos.push(VIDEO_ROOT+"2846381811.mp4");

}
/////////////////////////////////////////////////////////////////////////////////////
  var modal = document.getElementById("myModal");
  var modal2 = document.getElementById("myModal2");
  var modal3 = document.getElementById("myModal3");
  var video5 = document.getElementById("v5");
  var foto = document.getElementById("i5");
  //console.log(">>>>>>>>>video5 es "+video5);
// Get the button that opens the modal
  //var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
  var span  = document.getElementById("closeVideo");//ClassName("close");//[0];
  var span2 = document.getElementById("closeFicha");//ClassName("close");//[0];
  var span3 = document.getElementById("closeFicha2");//ClassName("close");//[0];
  var imgg = document.getElementById("i5");
  var texto = document.getElementById("texto");
  var creditos = document.getElementById("creditos");

  // When the user clicks the button, open the modal 
  /*btn.onclick = function() {
  modal.style.display = "block";
  }*/


// When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display  = "none";
      Stop();
      modal2.style.display  = "none";
      fotoAuxIndex = 0;
      modal3.style.display  = "none";
      doBGM();
  }
    span2.onclick = function() {
      modal.style.display  = "none";
      Stop();
      modal2.style.display  = "none";
      fotoAuxIndex = 0;
      modal3.style.display  = "none";
      doBGM();
  }
    span3.onclick = function() {
      modal.style.display  = "none";
      Stop();
      modal2.style.display  = "none";
      fotoAuxIndex = 0;
      modal3.style.display  = "none";
      doBGM();
  }
  imgg.onclick = function() {
    fotoAuxIndex++;
    //if(fotoAuxIndex==1)
    if(fotoAuxIndex%2!=0){//fotoModal(url, id, txt){
      fotoModal(rockNodes[rockNodeId].fotoTest2, rockNodeId, rockNodes[rockNodeId].speech2);
    }else{
      //fotoModal(rockNodes[rockNodeId].fotoTest, rockNodeId, rockNodes[rockNodeId].speech);
      modal2.style.display  = "none";
      fotoAuxIndex = 0;
    }
    //console.log(fotoAuxIndex);
        //doBGM();
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display  = "none";
      //modal2.style.display = "none";
      //fotoAuxIndex = 0;
      Stop();
      doBGM();
    }
    if (event.target == modal2) {
      modal2.style.display  = "none";
      //modal2.style.display = "none";
      fotoAuxIndex = 0;
      Stop();
      doBGM();
    }
    if (event.target == modal3) {
      modal3.style.display  = "none";
      //modal2.style.display = "none";
      //fotoAuxIndex = 0;
      //Stop();
      doBGM();
    }
    
  }
/////////////////////////////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(windowWidth,windowWidth*0.3).parent('canvasContainer');
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  myMap.attributionControl = false;
  //console.log(">>>>>>>>>>>><"+myMap.position);
  doGui();
  parseCSV();
  imageMode(CENTER);
  //doModal();
  colorMode(HSB,255,255,255);

  for (var i = 0; i<8; i++) {
    bgMusic.push(   new AudioLayer(""+(i+1),i) );
  }
}
function draw() {
  clear();
  if(stylized){
    noStroke();
    fill(0,228);
    rect(0,0,width,height);
  }
  //if(bgIndex>=0){
    //image(videos[bgIndex],0,0,width,height);
    //videos[bgIndex].
  //}
  drawAllNodes();
  updateGUI();
}
function viewTest(n){
  myMap.map.flyTo({
  center:  target[n],
  zoom:    zoom[n],
  bearing: bearing[n],
  pitch:   pitch[n],
  // These options control the flight curve, making it move
  // slowly and zoom out almost completely before starting
  // to pan.
  speed:   1.0, // make the flying slow
  curve:   1, // change the speed at which it zooms out
  // This can be any easing function: it takes a number between
  // 0 and 1 and returns another number between 0 and 1.
  easing: (t) => t, 
  // this animation is considered essential with respect to prefers-reduced-motion
  essential: true
  });
}

function styleTest(n){
  stylized = Boolean(n);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
var kedarLeyenda;

function doGui(){

  let offsets = document.getElementById('canvasContainer').getBoundingClientRect();
  let top = offsets.top;
  let left = offsets.left;
  //console.log(">>>>>>"+left+", "+top);
  kedarLeyenda = createDiv('<p style="height: 80px;width: 120px; background-color: #000000CC;"></p>');//<<< aqui rectangulito grone
  kedarLeyenda.position(width-210, top+5-10-5);

  toggleRocks = createDiv('<p style="color:white;font-family:Monospace;font-size:10px;cursor:pointer">Rocas</p>');
  toggleRocks.position(width-180, top+5);
  toggleRocks.class("GUI");
  toggleRocksBox = createP('');
  toggleRocksBox.style("cursor", "pointer");
  toggleRocksBox.style("width", "8px");
  toggleRocksBox.style("height","8px");
  toggleRocksBox.style("outline","white solid thin");
  toggleRocksBox.class("GUI");
  toggleRocksBox .position(width-200, top);
  toggleRocks.mousePressed(function(){      drawRocks=!drawRocks    });
  toggleRocksBox.mousePressed(function(){      drawRocks=!drawRocks    });

  toggleOsc = createDiv('<p style="color:white;font-family:Monospace;font-size:10px;cursor:pointer">Osciladores</p>');
  toggleOsc.position(width-180, top+18+5);
  toggleOsc.class("GUI");
  toggleOscBox = createP('');
  toggleOscBox.style("cursor", "pointer");
  toggleOscBox.style("width", "8px");
  toggleOscBox.style("height","8px");
  toggleOscBox.style("outline","white solid thin");
  toggleOscBox.class("GUI");
  toggleOscBox .position(width-200, top+18);
  toggleOsc.mousePressed(function(){      drawOsc=!drawOsc;   });
  toggleOscBox.mousePressed(function(){      drawOsc=!drawOsc    });

  togglePerspective = createDiv('<p style="color:white;font-family:Monospace;font-size:10px;cursor:pointer">Perspectivas</p>');
  togglePerspective.position(width-180, top+18*2+5);
  togglePerspective.class("GUI");
  togglePerspectiveBox = createP('');
  togglePerspectiveBox.style("cursor", "pointer");
  togglePerspectiveBox.style("width", "8px");
  togglePerspectiveBox.style("height","8px");
  togglePerspectiveBox.style("outline","white solid thin");
  togglePerspectiveBox.class("GUI");
  togglePerspectiveBox .position(width-200, top+18*2);
  togglePerspective.mousePressed(function(){         drawPerspective=!drawPerspective    }); 
  togglePerspectiveBox.mousePressed(function(){      drawPerspective=!drawPerspective    });

  launchCreditos = createDiv('<p style="color:white;font-family:Monospace;font-size:10px;cursor:pointer">Credits</p>');
  launchCreditos.position(width-180, top+18*3+5);//width-180, windowHeight-(20+18));
  launchCreditos.mousePressed(function(){      doCredits();   });
}
function updateGUI(){
  if(drawRocks) toggleRocksBox.style("background","red");
  else   toggleRocksBox.style("background","rgba(255,0,0,0)");

  if(drawOsc) toggleOscBox.style("background","green");
  else   toggleOscBox.style("background","rgba(0,255,0,0)");

  if(drawPerspective) togglePerspectiveBox.style("background","yellow");
  else   togglePerspectiveBox.style("background","rgba(255,255,0,0)");
}
function swapVideo(){
  if(bgIndex!=0)doBackground(0);
  else doBackground(-1);
}
function doBackground(i){
  bgIndex = i;
  //bgImage = loadImage(audioNodes[i].filename3);//audioNodes[i].icon;//
  for(let k=0; k<videos.length; k++){
    if(k!=bgIndex){videos[k].hide();videos[k].pause();} 
    else if(k>=0){
      videos[k].play();
      videos[k].show();
      //videos[k].style = "position: absolute; left: 0px, top: 0px";
    }
  }
}
/////////////////////////////////////////////////////////////////////////


function parseCSV(){
  for (let r = 0; r < rockTable.getRowCount(); r++){
    rockNodes[r] = new RockNode(r); 
  }
  for (let r = 1; r < oscTable.getRowCount(); r++){
    oscNodes[r-1] = new OscNode(r-1); 
  }
  for (let r = 1; r < perspectiveTable.getRowCount(); r++){
    perspectiveNodes[r-1] = new PerspectiveNode(r-1); 
  }
}
//////////////////////////////////////////////////////////////////////////
function drawAllRockNodes(){
  //console.log("did i passed by here?");
  for (let i = 0; i < rockNodes.length; i ++){
    rockNodes[i].draw();
  }
  
}
/////////////////////////////////////////////////////////////////////////
function drawAllNodes(){
  //console.log("did i passed by here?");
  //tint(255,0,0);
  if(drawRocks){
  for (let i = 0; i < rockNodes.length; i ++){
    //if(rockNodes[i].over)tint(255);
    rockNodes[i].draw();
  }
  }
  //tint(0,255,0);
  if(drawOsc){
  for (let i = 0; i < oscNodes.length; i ++){
    //if(oscNodes[i].over)tint(255);
    oscNodes[i].draw();
  }
  }
  //tint(0,0,255);
  if(drawPerspective){
  for (let i = 0; i < perspectiveNodes.length; i ++){
    //if(perspectiveNodes[i].over)tint(255);
    perspectiveNodes[i].draw();
  }
  }
}
//////////////////////////////////////////////////////////////////////////
class RockNode{
  constructor(i){
    this.i = i;
    this.index = i;//+1;
    this.forceIndex  = rockTable.getString(this.index, 0);//a
    this.codigo      = rockTable.getString(this.index, 1);//b
    this.ubicacion   = rockTable.getString(this.index, 2);//c
    this.nombre      = rockTable.getString(this.index, 3);//d
    this.L           = rockTable.getString(this.index, 4);//e
    this.A           = rockTable.getString(this.index, 5);//f
    this.H           = rockTable.getString(this.index, 6);//g
    this.kg          = rockTable.getString(this.index, 7);//h
    this.gps         = rockTable.getString(this.index, 8);//i
    this.lat         = rockTable.getString(this.index, 9);//j
    this.long        = rockTable.getString(this.index, 10);//k
    this.autor       = rockTable.getString(this.index, 11);//l
    this.texto1      = rockTable.getString(this.index, 12);//m
    this.texto2      = rockTable.getString(this.index, 13);//n
    this.foto1       = rockTable.getString(this.index, 14);//o
    this.foto2       = rockTable.getString(this.index, 15);//p
    this.fotoTest    = "media2/fichas/"+nf(this.index+1,2)+"/img/01.jpg";
    this.fotoTest2   = "media2/fichas/"+nf(this.index+1,2)+"/img/02.jpg";
    this.speech      = loadStrings("media3_links/fichas/"+nf(this.index+1,2)+"/textos/01.txt");
    this.speech2     = loadStrings("media3_links/fichas/"+nf(this.index+1,2)+"/textos/02.txt");
    //console.log(">>>>>>>> media3/fichas/"+nf(this.index+1,2)+"/textos/01.txt");
    //this.fotoTest    = "media/fichas/"+nf(this.index,2)+"/img/01.jpg";
    //print(this.index+">>"+this.lat+" "+this.long);
    this.over = false;
    this.tint = color(0,255,255);
 }
  draw(){
    //if (myMap.map.getBounds().contains([latitude, longitude])) {
      // Transform lat/lng to pixel position
      const pos = myMap.latLngToPixel(this.lat, this.long);
      let size = 4;//meteorites.getString(i, 'mass (g)');
      //size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
      size*=myMap.zoom();
      push();
      translate(pos.x, pos.y);
      //translate(0,-16,0);
      //fill(this.tint);
      //fill(255);
      fill(0,255,(this.over)? 255:128);
      triangle(0,0,-8,-16,8,-16);
      //image(mapMarkerIcon,0,0,32,32);
      pop();
    //}
  }
  mouseReleased(){
    if(this.over){
      //print("i was over "+this.i+" and my name is "+this.nombre);
      //prewindorsOnDFly();
      fotoModal(this.fotoTest, this.i, this.speech);
    }
  }
  mouseMoved(){
    const pos = myMap.latLngToPixel(this.lat, this.long);
    let l = pos.x - 10; 
    let r = pos.x + 10;
    let t = pos.y - 10-10; 
    let b = pos.y + 10-10;
    this.over = (mouseX>=l && mouseX<=r && mouseY>=t && mouseY<=b)
  }
}
/////////////////////////////////////
function mouseReleased(){
  for (let i = 0; i < rockNodes.length; i ++){
    rockNodes[i].mouseReleased();
  }
}
function mouseMoved(){
  for (let i = 0; i < rockNodes.length; i ++){
    rockNodes[i].mouseMoved();
  }
}

class OscNode{
  constructor(i){
    this.i = i;
    this.index = i+1;
    this.forceIndex  = oscTable.getString(this.index, 0);
    this.codigo      = oscTable.getString(this.index, 1);
    this.ubicacion   = oscTable.getString(this.index, 2);
    this.LL           = oscTable.getString(this.index, 3);
    this.lat         = oscTable.getString(this.index, 4);
    this.long        = oscTable.getString(this.index, 5);
    this.videoName   = oscTable.getString(this.index, 6);
    this.over = false;
    this.tint = color(32,255,255);
 }
  draw(){
    //if (myMap.map.getBounds().contains([latitude, longitude])) {
      // Transform lat/lng to pixel position
      const pos = myMap.latLngToPixel(this.lat, this.long);
      let size = 4;//meteorites.getString(i, 'mass (g)');
      //size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
      size*=myMap.zoom();
      push();
      translate(pos.x, pos.y);
      //translate(0,-16,0);
      //fill(this.tint);
      //fill(128);
      fill(64,255,(this.over)? 255:128);
      triangle(0,0,-8,-16,8,-16);
      //image(mapMarkerIcon,0,0,32,32);
      //tint(this.over? color(255,0,0): color())
      pop();
    //}
  }
  mouseReleased(){
    if(this.over){
      //print("i was over "+this.i+" and my name is "+this.nombre);
      //prewindorsOnDFly();
      muteBGM();
      doVideoModal(VIDEO_ROOT+"/osc/"+this.videoName);
    }
  }
  mouseMoved(){
    const pos = myMap.latLngToPixel(this.lat, this.long);
    let l = pos.x - 10; 
    let r = pos.x + 10;
    let t = pos.y - 10-10; 
    let b = pos.y + 10-10;
    this.over = (mouseX>=l && mouseX<=r && mouseY>=t && mouseY<=b);
  }
}
/////////////////////////////////////
//-67.709639
class PerspectiveNode{
  constructor(i){
    this.i = i;
    this.index = i+1;
    this.forceIndex  = perspectiveTable.getString(this.index, 0);
    this.codigo      = perspectiveTable.getString(this.index, 1);
    this.ubicacion   = perspectiveTable.getString(this.index, 2);
    this.LL           = perspectiveTable.getString(this.index, 3);
    this.xx           = perspectiveTable.getString(this.index, 4);
    this.lat         = perspectiveTable.getString(this.index, 5);
    this.long        = perspectiveTable.getString(this.index, 6);
    this.nombre      = perspectiveTable.getString(this.index, 7);
    this.videoName      = perspectiveTable.getString(this.index, 8);
    //print(this.index+">>"+this.lat+" "+this.long);
    this.over = false;
    this.tint = color(64,255,255);
 }
  draw(){
    //if (myMap.map.getBounds().contains([latitude, longitude])) {
      // Transform lat/lng to pixel position
      const pos = myMap.latLngToPixel(this.lat, this.long);
      let size = 4;//meteorites.getString(i, 'mass (g)');
      //size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
      size*=myMap.zoom();
      push();
      translate(pos.x, pos.y);
      //translate(0,-16,0);
      //fill(this.tint);
      fill(43,255,(this.over)? 255:128);
      triangle(0,0,-8,-16,8,-16);
      //image(mapMarkerIcon,0,0,32,32);
      pop();
    //}
  }
  mouseReleased(){
    if(this.over){
      //print("i was over "+this.i+" and my name is "+this.nombre);
      //prewindorsOnDFly();
       muteBGM();
       doVideoModal(VIDEO_ROOT+"/perspectivas/"+this.videoName);
    }
  }
  mouseMoved(){
    const pos = myMap.latLngToPixel(this.lat, this.long);
    let l = pos.x - 10; 
    let r = pos.x + 10;
    let t = pos.y - 10-10; 
    let b = pos.y + 10-10;
    this.over = (mouseX>=l && mouseX<=r && mouseY>=t && mouseY<=b);
    //this.tint = (this.over)? color(64,255,255):color(64,255,128);
    //cursor(this.over? FINGER: HAND);
    //if(this.over){
      //print("i was over "+this.i+" and my name is "+this.nombre);
    //}
  }
}
/////////////////////////////////////
function mouseReleased(){
  if(drawRocks){
  for (let i = 0; i < rockNodes.length; i ++){
    rockNodes[i].mouseReleased();
  }
}
if(drawOsc){
  for (let i = 0; i < oscNodes.length; i ++){
    oscNodes[i].mouseReleased();
  }
}
if(drawPerspective){
  for (let i = 0; i < perspectiveNodes.length; i ++){
    perspectiveNodes[i].mouseReleased();
  }
}
}
function mouseMoved(){
  let yeah = false;
  if(drawRocks){
  for (let i = 0; i < rockNodes.length; i ++){
    rockNodes[i].mouseMoved();
    if(rockNodes[i].over){
      yeah = true;
      break;
    }
  }
  }
  if(!yeah && drawOsc){
    for (let i = 0; i < oscNodes.length; i ++){
      oscNodes[i].mouseMoved();
      if(oscNodes[i].over){yeah = true;break};
    }
  }
  if(!yeah && drawPerspective){
    for (let i = 0; i < perspectiveNodes.length; i ++){
      perspectiveNodes[i].mouseMoved();
      if(perspectiveNodes[i].over)break;
    }
  }
}
/////////////////////////////////////////////////////////
function windorsOnDFly(){//l
  //lang = l;
  var wWindors = screen.availWidth - 10;    
  var hWindors = screen.availHeight - 30;   
  var leftOffset = 0;
  var topOffset = 0;
  var newW = window.open(videos[0], "bindors", "width=" + wWindors + ",height=" + hWindors + ",top=" + -topOffset + ",left=" + leftOffset + ",scrollbars=no");
}
function prewindorsOnDFly(){
  //doBackground(0);
  //windorsOnDFly();
  //neoWindorsOnDFly();
  modal.style.display = "block";
  video5.src = videos[0];
  video5.play();
}
function doVideoModal(url){
  modal.style.display = "block";
  video5.src = url;
  video5.play();
}//VIDEO_ROOT+"/perspectivas/"+this.videoName);
var fotoAuxIndex = 0;
var rockNodeId = 0;

function fotoModal(url, id, txt){
  rockNodeId = id;
  modal2.style.display = "block";
  foto.src = url;
  texto.innerHTML = makeMeAString(txt);
  //console.log(">>> "+url);
  //fotoAuxIndex++;
  //video5.play();
}//VIDEO_ROOT+"/perspectivas/"+this.videoName);
function doCredits(){
  modal3.style.display = "block";
  creditos.innerHTML = makeMeAHTML(textoCreditos);//realMakeMeAString(textoCreditos);
}
function makeMeAHTML(ss){
  //console.log(ss);
  let suma = "";
  for(let i=0; i<ss.length; i++){
    suma+=ss[i];
  }
  return suma;
}
function makeMeAString(ss){
  //console.log(ss);
  let papers = 0;
  let suma = "";
  let prevLine = "";
  let nextLine = "";
  for(let i=2; i<ss.length-1; i++){
    //evaluar q primeros caracteres de ss[i] sean "http" o "https"
    let daLine = ss[i];
    let aux = ss[i+1].substring(0,5);
    if(aux=="http:"){
      papers++;
      i++;
      suma+="<a href='"+ss[i]+"' target='_blank'>"+daLine+"</a><br>";//nf(papers,2)+"</a><br>";
    }else if(aux=="https"){
      papers++;
      i++;
      suma+="<a href='"+ss[i]+"' target='_blank'>"+daLine+"</a><br>";//+nf(papers,2)+"</a><br>";
    }else{
      suma+=ss[i]+"<br>";
    }
  }
  return suma;
}
function realMakeMeAString(ss){
  //console.log(ss);
  let suma = "";
  for(let i=0; i<ss.length; i++){
    suma+=ss[i]+"<br>";
  }
  return suma;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function AudioLayer(f, i){
  var filename = f;
  var index    = i;
  var loadingbar = createP('');
  loadingbar.position(4, 54+index*18);
  loadingbar.class("GUI");
  
  /*var buttonbar = createP('');
  buttonbar.position(4, 54+index*18);
  buttonbar.class("GUI");*/
  
  this.amplitude = new p5.Amplitude();
  this.filter    = new p5.BandPass();
  
  this.doFilter  = false;
  
  this.updateMeter = function(){
    this.vuMeter.remove();
    if(showGUI)this.doMeter();
    //this.vuMeter.class("GUI");
  }
  this.doMeter = function(){
    var w = 200*this.amplitude.getLevel();
    this.vuMeter    = createP('');
    this.vuMeter.style("width", w+"px");
    this.vuMeter.style("height","8");
    this.vuMeter.style("background","white");
    this.vuMeter.position(136+16*2, -4+72+index*18);
    this.vuMeter.class("GUI");
  }
  this.soundLoaded = function(s){
    //buttonbar.remove();
    /*buttonbar = createDiv('<p style="color:white;font-family:Monospace;font-size:10px;cursor:pointer">['+(index+1)+'] '+filename+'</p>');
    buttonbar.position(8, 72+index*18);
    buttonbar.class("GUI");
    buttonbar.mousePressed(function(){
      console.log("mousePressed!");
      if(s.isPlaying())s.pause();
      else s.loop();
    });*/
    console.log("yeah!");
    //makeFilterButton(index);
    s.loop();
    s.setVolume(random(0.6));
  }
  this.soundError = function(err){
    console.log(err);
  }
  this.soundLoading = function(status){
    console.log(status);
    let offsets = document.getElementById('canvasContainer').getBoundingClientRect();
    let top = offsets.top;
    let left = offsets.left;
    /*buttonbar.remove();
    buttonbar = createDiv('<p style="color:white;font-family:Monospace;font-size:10px;cursor:wait">['+nf(status*100,2,0)+'%] '+filename+'</p>');
    buttonbar.position(8, top+index*18);*/

  }
  this.trigger = function(){
    if(this.sound.isPlaying())this.sound.pause();
    else 
    this.sound.loop();
  }
  this.toggleFilter = function(){
    this.doFilter = !this.doFilter;
    if(!this.doFilter){
      this.sound.disconnect();
      this.sound.connect();
      this.amplitude.setInput(this.sound);
    }else{
      this.sound.disconnect();
      this.sound.connect(this.filter);
      this.amplitude.setInput(this.filter);
    }

    if(this.doFilter) toggleBPFbox[index].style("background","white");
    else   toggleBPFbox[index].style("background","rgba(255,0,0,  0)");

  }
  this.randomFilterValues = function(){
    if(this.doFilter)
      this.filter.freq(random(40,1000));
  }
  this.doBGM = function(g){
    this.sound.setVolume(g);
  }
  this.muteBGM = function(){
    this.sound.setVolume(0);
  }
  this.doMeter();
  this.sound = loadSound("media/bgm/"+f+".mp3", this.soundLoaded, this.soundError, this.soundLoading);
  this.amplitude.setInput(this.sound);
  this.doFilter = false;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function doBGM(){
  for(let i=0; i<8; i++){
    let level = random(0.6);
    bgMusic[i].doBGM(level);
  }
  console.log("do bgm!");
}
function muteBGM(){
  for(let i=0; i<8; i++){
    bgMusic[i].muteBGM();
  }
  console.log("all paused?");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
