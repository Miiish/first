  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyBoiit8uk1503ug0iGuT68bUwjyRh9wqks",
      authDomain: "my-mail-248d9.firebaseapp.com",
      databaseURL: "https://my-mail-248d9.firebaseio.com",
      projectId: "my-mail-248d9",
      storageBucket: "clients",
      messagingSenderId: "1015844241850"
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

  function getGeo() {
      var geo;
      if (navigator.geolocation) {
          navigator.geolocation.watchPosition(showPosition);
      } else {
          geo = "Not support geolocation api";
      }
      function showPosition(position) {
          geo = {
            Latitude: position.coords.latitude,
            Longitude: position.coords.longitude,
          }
      }
  }

  // Usage
  getUserIP(function(ip) {
      var time = new Date()
      console.log(time)
      firebase.database().ref('clients/'+time).set({
          time: time,
          ip: ip,
      }, function(error) {
          if (error) {
              console.log(error)
          } else {
              // Data saved successfully!
          }
      });
  });