var auth = {
  consumerKey: "_cmxf_TCkzjgdSx5XdOtJA",
  consumerSecret: "S8DfUOLBebRUM43_xsRzlo4Ixzk",
  accessToken: "mj-e1P50ojX7mcRVrc6CtB_izjda4-Sz",
  accessTokenSecret: "UCu_8OHHN3GeOBhuEgWvJUyMnUU",
  serviceProvider: {
    signatureMethod: "HMAC-SHA1"
  }
};

var terms = 'Capital+Grille';
var near = 'atlanta';
var ll = '';
var rest_addr = '255 East Paces Ferry Road Atlanta, GA 30305';

var accessor = {
  consumerSecret: auth.consumerSecret,
  tokenSecret: auth.accessTokenSecret
};

var google_parameters = [];
google_parameters.push(['address', encodeURI(rest_addr)]);
google_parameters.push(['sensor', false]);

var google_message = {
  'action': 'http://maps.google.com/maps/api/geocode/json',
  'method': 'GET'
}


var xmlhttp,xmlhttp1;
  if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
    xmlhttp1 = new XMLHttpRequest();
  }
  else{// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp1=new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
      var data = JSON.parse(xmlhttp.responseText);
      var myLong = data["results"][0].geometry.location.lng;
      var myLat = data["results"][0].geometry.location.lat;
      ll = myLat+","+myLong;
      //alert(ll);


      yelp_parameters = [];
      yelp_parameters.push(['term', terms]);
      yelp_parameters.push(['limit', '1'])
      yelp_parameters.push(['ll', ll]);
      yelp_parameters.push(['callback', 'cb']);
      yelp_parameters.push(['oauth_consumer_key', auth.consumerKey]);
      yelp_parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
      yelp_parameters.push(['oauth_token', auth.accessToken]);
      yelp_parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

      var yelp_message = {
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': yelp_parameters
      };



      OAuth.setTimestampAndNonce(yelp_message);
      OAuth.SignatureMethod.sign(yelp_message, accessor);

      var parameterMap = OAuth.getParameterMap(yelp_message.parameters);
      parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
      //console.log(parameterMap);


      $.ajax({
        'url': yelp_message.action,
        'data': parameterMap,
        'cache': true,
        'dataType': 'jsonp',
        'jsonpCallback': 'cb',
        'success': function(data, textStats, XMLHttpRequest) {
            var id = data.businesses[0].id;
            yelp_parameters2 = [];
            yelp_parameters2.push(['callback', 'cb']);
            yelp_parameters2.push(['oauth_consumer_key', auth.consumerKey]);
            yelp_parameters2.push(['oauth_consumer_secret', auth.consumerSecret]);
            yelp_parameters2.push(['oauth_token', auth.accessToken]);
            yelp_parameters2.push(['oauth_signature_method', 'HMAC-SHA1']);

            var yelp_message2 = {
              'action': 'http://api.yelp.com/v2/business'+'/'+id,
              'method': 'GET',
              'parameters': yelp_parameters2
            };

            OAuth.setTimestampAndNonce(yelp_message2);
            OAuth.SignatureMethod.sign(yelp_message2, accessor);

            var parameterMap2 = OAuth.getParameterMap(yelp_message2.parameters);
            parameterMap2.oauth_signature = OAuth.percentEncode(parameterMap2.oauth_signature);

            $.ajax({
                'url':yelp_message2.action,
                'data': parameterMap2,
                'cache': true,
                'dataType': 'jsonp',
                'jsonpCallback': 'cb',
                'success': function(data, textStats, XMLHttpRequest) {
                  //console.log(data);
                  alert(data);
                  var output = prettyPrint(data);
                  $("body").append(output);
                }
              });
            }
      });

    }
  }
  xmlhttp.open("GET",google_message.action+"?address="+encodeURI(rest_addr)+"&sensor=false",true);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send();