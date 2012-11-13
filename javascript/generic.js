function round_dec(num, dec) {
  var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
  return result;
}


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

function grid_layout(){
  // Grid layout
  var margin_width        = sanitize_number($('#margin-width .val').text());
  var gutter_width        = sanitize_number($('#gutter-width .val').text());
  var col_width           = sanitize_number($('#col-width .val').text());
  var grid_content_width  = sanitize_number($('#desktop .grid-content').width());
  var columns             = sanitize_number($('#desktop-columns .val').text());

  $('#grid-layout .width-grid-container').text(grid_content_width + (margin_width * 2))
  $('#grid-layout').width(grid_content_width + (margin_width * 2));
  $('#grid-layout .grid-content').width(grid_content_width);
  $('#grid-layout .margin').width(margin_width);
  $('#grid-layout .grid-content .colgroup').hide();
  $('.colgroup.one').show();
  $('#grid-layout .width-grid-content').text(grid_content_width);

  $('#grid-layout .grid-content .col').css('margin', '0 ' +(gutter_width /2)+'px');
  $('#grid-layout .grid-content .col.first').css('margin-left', '0');
  $('#grid-layout .grid-content .col.last').css('margin-right', '0');

  // Two col
  var col_two_width = get_column_width(2);
  if(is_int(col_two_width)) {
    var percent = (col_two_width / grid_content_width) * 100;
    $('.colgroup.two').show();
    $('.colgroup.two .col').width(col_two_width).text(col_two_width+'px' + ' (' +percent+'%)');
  }
  // Three col
  var col_three_width = get_column_width(3);
  if(is_int(col_three_width)) {
    var percent = (col_three_width / grid_content_width) * 100;
    $('.colgroup.three').show();
    $('.colgroup.three .col').width(col_three_width).text(col_three_width+'px' + ' (' +percent+'%)');

    $('.colgroup.third').show();
    var two_three = multiply_column_width(col_three_width,2);
    $('.colgroup.third .col.one-three').css({ "width": col_three_width+"px" }).text(col_three_width+'px');
    $('.colgroup.third .col.two-three').css({ "width": two_three+"px" }).text(two_three+'px');
  }
  // Four col
  var col_four_width = get_column_width(4);
  if(is_int(col_four_width)) {
    var percent = (col_four_width / grid_content_width) * 100;
    $('.colgroup.four').show();
    $('.colgroup.four .col').width(col_four_width).text(col_four_width+'px' + ' (' +percent+'%)');

    $('.colgroup.fourth').show();
    var tree_four = multiply_column_width(col_four_width,3);
    $('.colgroup.fourth .col.one-four').css({ "width": col_four_width+"px" }).text(col_four_width+'px');
    var percent = (tree_four / grid_content_width) * 100;
    $('.colgroup.fourth .col.three-four').css({ "width": tree_four+"px" }).text(tree_four+'px'+ ' (' +percent+'%)');
  }
  // Six col
  var col_six_width = get_column_width(6);
  if(is_int(col_six_width)) {
    $('.colgroup.six').show();
    $('.colgroup.six .col').width(col_six_width).text(col_six_width+'px');

    $('.colgroup.sixth').show();
    var five_six = multiply_column_width(col_six_width,5);
    $('.colgroup.sixth .col.one-six').css({ "width": col_six_width+"px" }).text(col_six_width+'px');
    $('.colgroup.sixth .col.five-six').css({ "width": five_six+"px" }).text(five_six+'px');
  }
}

function is_int(n) {
   return ((typeof n==='number')&&(n%1===0));
}

function get_column_width(n){
  var grid_content_width  = sanitize_number($('#desktop .grid-content').width());
  var gutter_width        = sanitize_number($('#gutter-width .val').text());
  return (grid_content_width - (gutter_width * (n - 1))) / n;
}

function multiply_column_width(w,n) {
  var gutter_width        = sanitize_number($('#gutter-width .val').text());
  return (w * n + (gutter_width * (n - 1)));
}

jQuery.fn.update_layouts = function() {
  var gutter_width              = sanitize_number($('#gutter-width .val').text());
  var col_width                 = sanitize_number($('#col-width .val').text());
  var margin_width              = sanitize_number($('#margin-width .val').text());
  var is_auto_device_width      = $('#auto-device-width').is(':checked');

  $('#simplest #gutter-width').text(gutter_width);
  $('#simplest #margin-width').text(margin_width);

  $('#grid-container .col').width(col_width);
  $('.gutter').width(gutter_width);

  $('#desktop').create_grid({'is_auto_device_width' : is_auto_device_width});
  $('#tablet-portrait').create_grid({'is_auto_device_width' : is_auto_device_width});
  $('#mobile-landscape').create_grid({'is_auto_device_width' : is_auto_device_width});
  $('#mobile-portrait').create_grid({'is_auto_device_width' : is_auto_device_width});

  $('.margin').width(margin_width);
  grid_layout();
  update_info();
  return this;
};

jQuery.fn.increase_width = function() {
  var step = 1;
  if($(this).parents('.colgroup').hasClass('widths') && $(this).parent().attr('id') != 'margin-width') step = 2;
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

  $('#simplest #grid-content').text($('#desktop.grid-container').width());
  $('#simplest #grid-columns').text($('#desktop-columns .val').text());

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

  $(".widths .val").focus(function() {
    $(this).addClass('focus')
    return false;
  })
  .keyup(function() {
    var val = sanitize_number($(this).text());
    if (val < 1) $(this).text('0')
    $('#desktop').update_layouts()
    update_info();
    return false;
  })
  .blur(function() {
    $(this).removeClass('focus')
    return false;
  });

  is_auto_device_width();

  $('#auto-device-width').click( function() {
    is_auto_device_width();
    $('#desktop').update_layouts()
  });

  $('#toggle-simplest').click( function(e) {
    e.preventDefault();
    $('#simplest').toggle();
  });


});