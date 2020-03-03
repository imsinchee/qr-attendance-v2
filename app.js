var db = firebase.database();
var talk_title = "Talks";
var flag = false;
var first_time = true;
var audio = new Audio('honk/Honk1.mp3')

function comfrim(){
  talk_title = document.getElementById("talks").value.toUpperCase();
  document.getElementById("current_talk").innerHTML=talk_title;
  flag = true;
}

function del(){
  talk_title = "Talks"
  document.getElementById("talks").innerHTML=""
  document.getElementById("current_talk").innerHTML=talk_title;
  flag = false;
}

var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: [],
    tem_scan: String
  },
  mounted: function () {
    var self = this;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
    self.scanner.addListener('scan', function (content, image) {
      
      if (flag){
        var on_refresh = db.ref("qr-scanner");
        if (first_time){
          on_refresh.once('value',function(snapshot){
            if (snapshot.hasChild(talk_title)){
              var num = Math.floor(100000 + Math.random() * 900000);
              talk_title = talk_title +"-"+ String(num);
              console.log(talk_title)
              while(snapshot.hasChild(talk_title)){
                num = Math.floor(100000 + Math.random() * 900000);
                talk_title = talk_title + toString(num);
              }
              self.tem_scan = self.scans;
              self.scans.unshift({ date: +(Date.now()), content: content });
  
              db.ref("qr-scanner/"+talk_title).set(self.tem_scan);
              audio.play();
            }
            else{
              self.tem_scan = self.scans;
              self.scans.unshift({ date: +(Date.now()), content: content });
  
              db.ref("qr-scanner/"+talk_title).set(self.tem_scan);
              audio.play();
            }
          })
          first_time = false;
        }
        else{
          self.tem_scan = self.scans;
              self.scans.unshift({ date: +(Date.now()), content: content });
  
              db.ref("qr-scanner/"+talk_title).set(self.tem_scan);
              audio.play();
        }
        
      }
      else{
        alert("Please Enter Talk")
      }
      
      

    });
    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      if (cameras.length > 0) {
        self.activeCameraId = cameras[0].id;
        self.scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    }
  }
});
