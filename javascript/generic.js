jQuery.fn.create_grid = function(options) {
  var settings                    = {'is_auto_device_width' : false};
  options                         = $.extend( settings, options );
  var o                           = options;
  var this_id                     = $(this).attr('id');
  var margin_width                = sanitize_number($('#margin-width .val').text());
  var gutter_width                = sanitize_number($('#gutter-width .val').text());
  var col_width                   = sanitize_number($('#col-width .val').text());
  var cont                        = [];
  var grid_content_width          = 0;
  var gutter                      = '<div style="width:'+gutter_width+'px;" class="gutter col">&nbsp;</div>';

  if(o.is_auto_device_width){
    // Set max width
    switch(this_id){
      case 'desktop':
        var max_width = 1024;
        break;
      case 'tablet-portrait':
        var max_width = 768;
        break;
      case 'mobile-landscape':
        var max_width = 480;
        break;
      case 'mobile-portrait':
        var max_width = 320;
        break;
    }
    var grid_width = (margin_width * 2);
    var columns = 0;
    // Calculate max nr of columns inside device width
    while (grid_width<max_width){
      columns++;
      grid_width += col_width;
      if (grid_width>max_width){
        columns--;
        break;
      }
      grid_width += gutter_width;
    }

  $('#'+this_id+'-columns .val').text(columns)

  }
  else {
    var columns = sanitize_number($('#'+this_id+'-columns .val').text());
  }

  // Create columns + gutter
  for (var i = 0;i<columns;i++) {
    grid_content_width += col_width + gutter_width;
    // Last column has no gutter on the right side
    if(i == (columns -1)) {
      gutter = '';
      grid_content_width -= gutter_width;
    }
    cont.push('<div style="width:'+col_width+'px;" class="col">'+(i+1)+'</div>' + gutter);
  }
  // Set width to container & print content
  $('#'+this_id+'-columns .val').text(columns)
  $('#'+this_id+'.grid-container').width(grid_content_width + (margin_width * 2))
  $('#'+this_id+' .grid-content').width(grid_content_width);
  $('#'+this_id+' .grid-content .colgroup').html(cont.join(''));
  return this;
};

jQuery.fn.update_layouts = function() {
  var gutter_width              = sanitize_number($('#gutter-width .val').text());
  var col_width                 = sanitize_number($('#col-width .val').text());
  var margin_width              = sanitize_number($('#margin-width .val').text());
  var is_auto_device_width      = $('#auto-device-width').is(':checked');

  $('#grid-container .col').width(col_width);
  $('.gutter').width(gutter_width);

  $('#desktop').create_grid({'is_auto_device_width' : is_auto_device_width});
  $('#tablet-portrait').create_grid({'is_auto_device_width' : is_auto_device_width});
  $('#mobile-landscape').create_grid({'is_auto_device_width' : is_auto_device_width});
  $('#mobile-portrait').create_grid({'is_auto_device_width' : is_auto_device_width});

  $('.margin').width(margin_width);
  update_info();
  return this;
};

jQuery.fn.increase_width = function() {
  var step = 1;
  if($(this).parents('.colgroup').hasClass('widths')) step = 2;
  $(this).text( sanitize_number($(this).text()) + step)
  $('#desktop').update_layouts()
  update_info();
  return this;
};

jQuery.fn.decrease_width = function() {
  var step = 1;
  if($(this).parents('.colgroup').hasClass('widths')) step = 2;
  var val = sanitize_number($(this).text());
  if($(this).parents('.colgroup').hasClass('columns') && (val - step) < 1) return this;
  if ((val - step) < 0) return this
  $(this).text(val - step)
  $('#desktop').update_layouts()
  update_info();
  return this;
};

function is_auto_device_width() {
    if ($('#auto-device-width').is(':checked')){
      $(".columns .label a").hide()
    }
    else{
       $(".columns .label a").show()
    }
};

function update_info() {
  $('#desktop .width-grid-container').text(  $('#desktop.grid-container').width() );
  $('#desktop .width-grid-content').text(  $('#desktop .grid-content').width() );

  $('#tablet-portrait .width-grid-container').text(  $('#tablet-portrait.grid-container').width() );
  $('#tablet-portrait .width-grid-content').text(  $('#tablet-portrait .grid-content').width() );

  $('#mobile-landscape .width-grid-container').text(  $('#mobile-landscape.grid-container').width() );
  $('#mobile-landscape .width-grid-content').text(  $('#mobile-landscape .grid-content').width() );

  $('#mobile-portrait .width-grid-container').text(  $('#mobile-portrait.grid-container').width() );
  $('#mobile-portrait .width-grid-content').text(  $('#mobile-portrait .grid-content').width() );
  return this;
};

function sanitize_number(s) {
  if( isNaN(parseInt(s)) || parseInt(s) < 0) {
    return 0;
  }
  else {
    return parseInt(s);
  }
}

$(document).ready(function () {

  $('#desktop').update_layouts();
  update_info();

  $(".increase").click(function() {
    $('#'+$(this).parents('.col').attr('id')+' .val').increase_width()
    return false;
  });

  $(".decrease").click(function() {
    $('#'+$(this).parents('.col').attr('id')+' .val').decrease_width()
    return false;
  });

  is_auto_device_width();

  $('#auto-device-width').click( function() {
    is_auto_device_width();
    $('#desktop').update_layouts()
  });

});