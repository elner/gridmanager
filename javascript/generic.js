jQuery.fn.create_grid = function(options) {
  var settings                    = {'is_auto_device_width' : false};
  options                         = $.extend( settings, options );
  var o                           = options;
  var this_id                     = $(this).attr('id');
  var margin_width                = parseInt($('#margin-width').val());
  var gutter_width                = parseInt($('#gutter-width').val());
  var col_width                   = parseInt($('#col-width').val());
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


  $('#'+this_id+'-columns').prev().text(columns)
  }
  else {
    var columns = parseInt($('#'+this_id+'-columns').val());
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
  $('#'+this_id+'-columns').val(columns)
  $('#'+this_id+'.grid-container').width(grid_content_width + (margin_width * 2))
  $('#'+this_id+' .grid-content').width(grid_content_width);
  $('#'+this_id+' .grid-content .colgroup').html(cont.join(''));
  return this;
};

jQuery.fn.update_layouts = function() {
  var gutter_width              = parseInt($('#gutter-width').val());
  var col_width                 = parseInt($('#col-width').val());
  var margin_width              = parseInt($('#margin-width').val());
  var is_auto_device_width      = $('#auto-device-width').is(':checked');

  $('.col').width(col_width);
  $('.gutter').width(gutter_width);

  $('#desktop').create_grid({'is_auto_device_width' : is_auto_device_width});
  $('#tablet-portrait').create_grid({'is_auto_device_width' : is_auto_device_width});
  $('#mobile-landscape').create_grid({'is_auto_device_width' : is_auto_device_width});
  $('#mobile-portrait').create_grid({'is_auto_device_width' : is_auto_device_width});

  $('.margin').width(margin_width);
  update_info();
  return this;
};

function is_auto_device_width() {
    if ($('#auto-device-width').is(':checked')){
      $(".columns input").each(function (i) {
        $(this).hide().parent().prepend('<span class="col-width">'+$(this).val()+'</span>')
      });
    }
    else{
       $(".columns input").each(function (i) {
         $('span.col-width', $(this).parent()).hide()
         $(this).show().val($('span.col-width', $(this).parent()).text());
         $('span.col-width', $(this).parent()).remove();
        });
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

$(document).ready(function () {

  $('#desktop').update_layouts();
  update_info();

  $("form").submit(function() {
    $('#desktop').update_layouts()
    return false;
  });

  $("input[type=number]").click(function() {
    $('#desktop').update_layouts()
    return false;
  });
  $("input[type=number]").keyup(function() {
    $('#desktop').update_layouts()
    return false;
  });

  is_auto_device_width();

  $('#auto-device-width').click( function() {
    is_auto_device_width();
    $('#desktop').update_layouts()
  });

});