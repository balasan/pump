(function($){
  $.photoblaster = function(url, name, success, error){
    if (! url) return;
    var API_HEADER = "#@im",
    success = success || function (data) {},
    error = error || function () {},
    params = {
      'url': url,
      'name': name || 'api',
      'transparent': true,
      'fuzz': 5,
    };
    $.ajax({
      'url': "http://asdf.us/cgi-bin/im/generate",
      'data': params,
      'dataType': "jsonp",
      'success': success,
      'error': error
    });
  };
})(jQuery);

