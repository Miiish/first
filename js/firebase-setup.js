  // Initialize Firebase

  var config = {
      apiKey: "AIzaSyBJ4uMI4W5hnyKmF5vrs3_h6KFMA6y7HYQ",
      authDomain: "my-website-6e77f.firebaseapp.com",
      databaseURL: "https://my-website-6e77f.firebaseio.com",
      projectId: "my-website-6e77f",
      storageBucket: "my-website-6e77f.appspot.com",
      messagingSenderId: "854638825671"
  };
  firebase.initializeApp(config);

  function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
      //compatibility for firefox and chrome
      var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      var pc = new myPeerConnection({
              iceServers: []
          }),
          noop = function() {},
          localIPs = {},
          ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
          key;

      function iterateIP(ip) {
          if (!localIPs[ip]) onNewIP(ip);
          localIPs[ip] = true;
      }

      //create a bogus data channel
      pc.createDataChannel("");

      // create offer and set local description
      pc.createOffer().then(function(sdp) {
          sdp.sdp.split('\n').forEach(function(line) {
              if (line.indexOf('candidate') < 0) return;
              line.match(ipRegex).forEach(iterateIP);
          });

          pc.setLocalDescription(sdp, noop, noop);
      }).catch(function(reason) {
          // An error occurred, so handle the failure to connect
      });

      //listen for candidate events
      pc.onicecandidate = function(ice) {
          if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
          ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
  }

  function getGeo(f) {
      var geo;
      $.ajax({
          url: "https://geoip-db.com/jsonp",
          jsonpCallback: "callback",
          dataType: "jsonp",
          async: false,
          success: function(location) {
              f(location)
          }
      });
  }

  // Usage
  getGeo(function(location) {
      var time = new Date()
      console.log(location)
      firebase.database().ref('clients/' + time).set({
          'time': time,
          'location': location,
      }, function(error) {
        console.log(error)
      });
  });

  function send_msg (obj) {
      var time = new Date()
      firebase.database().ref('messages/' + time).set({
          'time': time,
          'obj': obj,
      }, function(error) {
        console.log(error)
      });
  };

  //   $("#send_msg").click(function() {
  //     console.log('click')
  // });