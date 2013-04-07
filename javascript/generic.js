$.fn.update_info = function() {

  var plugin = this;

  $(window).bind("load", function() {
    plugin.update();
    $(window).resize(plugin.update);
  });

  plugin.update = function() {
    // Update wrapper width
    $('.width-grid-wrapper').text($('#grid-wrapper').width());
    // Update content width
    $('.width-grid-content').text( Math.round(parseInt($('#grid-content').width())) );
    // Grid col width
    // Math.round(parseInt($('#grid-content .col:not(.gutter)').width()))
  }

 return this;
}

jQuery.fn.increase_width = function() {
  var step = $(this).parent().data('steps');
  $(this).text( sanitize_number($(this).text()) + step);
  create_grid();
  return this;
};

jQuery.fn.decrease_width = function() {
  var step = $(this).parent().data('steps');
  var val = sanitize_number($(this).text());
  if ((val - step) < 0) return this
  $(this).text(val - step)
  create_grid();
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

function is_int(n) {
   return ((typeof n==='number')&&(n%1===0));
}

function get_column_width(n){
  var grid_content_width  = sanitize_number($('#content-width .val').text());
  var gutter_width        = sanitize_number($('#gutter-width .val').text());
  return (grid_content_width - (gutter_width * (n - 1))) / n;
}

function create_grid(){

  var content_width_px  = sanitize_number($('#content-width .val').text());
  var gutter_width_px   = sanitize_number($('#gutter-width .val').text());
  var margin_width_px   = sanitize_number($('#margin-width .val').text());
  var nr_of_columns     = sanitize_number($('#nr-of-columns .val').text());
  
  var sum_gutter        = (((gutter_width_px * nr_of_columns) - gutter_width_px))
  var wrapper_width_px  = content_width_px + (margin_width_px * 2)
  
  var one_col_width_px  = ((content_width_px - sum_gutter) / nr_of_columns);
  
  var margin_width_perc = ( margin_width_px / wrapper_width_px )  * 100;
  var gutter_width_perc = ( gutter_width_px / content_width_px ) * 100;
  var col_width_perc    = ( one_col_width_px /  content_width_px )  * 100;
  
  var cont              = [];
  var gutter            = '<div style="width:'+gutter_width_perc+'%;" class="gutter col">&nbsp;</div>';

  // If column width has decimals, return false
  if(one_col_width_px != Math.floor(one_col_width_px) ){
    $('#grid-manager .colgroup .col p.val').css('color', '#bd8282');
    return false;
  }
  else if( (nr_of_columns / 3) == Math.floor(nr_of_columns / 3) &&
      (nr_of_columns / 4) == Math.floor(nr_of_columns / 4) &&
      (nr_of_columns / 6) == Math.floor(nr_of_columns / 6)){
    $('#grid-manager .colgroup .col p.val').css('color', '#463f4c'); // #c5a75f
  }
  else{
    $('#grid-manager .colgroup .col p.val').css('color', 'rgb(150,150,150)');
  }

  // Update Simplest settings  - - - - - - - - - 
  $('#simplest-grid-content').text(content_width_px);
  $('#simplest-gutter-width').text(gutter_width_px);
  $('#simplest-margin-width').text(margin_width_px);
  $('#simplest-grid-columns').text(nr_of_columns);

  // Create columns - - - - - - - - - 
  for (var i = 0;i<nr_of_columns;i++) {
   // Last column has no gutter on the right side
   if(i == (nr_of_columns -1)) {
     gutter = '';
   }

   var col_text = (i+1);/*
   if(nr_of_columns <= 6){
     col_text = one_col_width_px+'px';
   } */
   cont.push('<div style="width:'+col_width_perc+'%;" class="col" title="'+col_text+'">'+col_text+'</div>' + gutter);
  }

   var max_width = (content_width_px + (margin_width_px * 2));
   $('#grid-content .colgroup').html(cont.join(''));
   $('#grid-wrapper').css('max-width', max_width +'px');
   $('.grid-content').css('padding-left', margin_width_perc +'%');
   $('.grid-content').css('padding-right', margin_width_perc +'%');

   $('.width-grid-wrapper').text($('#grid-wrapper').width());
   $('.width-grid-content').text(content_width_px);

  // Create Grid Layout - - - - - - - - - 
  $('#grid-layout').css('max-width', max_width +'px');
  var gutter    = '<div style="width:'+gutter_width_perc+'%;" class="gutter col">&nbsp;</div>';
  var cont      = [];

  for (var i = 1;i<nr_of_columns;i++) {

    var sum_gutter           = gutter_width_px
    var col_width_px         = ((one_col_width_px + sum_gutter)  * i) - sum_gutter;
    var col_width_perc       = ( col_width_px /  content_width_px )  * 100;
    var right_col_width_px   =  (content_width_px - (col_width_px + sum_gutter));
    var right_col_width_perc =  (right_col_width_px / content_width_px) * 100
    var right_col            = '<div style="width:'+right_col_width_perc+'%;" class="col">'+ (nr_of_columns - i) +' col<br />'+right_col_width_px+'px</div>';

    cont.push('<div class="colgroup"><div style="width:'+col_width_perc+'%;" class="col" title="'+col_width_px+'px">'+i +' col<br />'+col_width_px+'px</div>' +gutter+ right_col+'</div>');
   }

  $('#layout-content .layout-samples').empty().prepend(cont.join(''));

  // Update Layout Columns - - - - - - - - - 
  var layout_cols = [ 
    {"cols": 2, "name": "two"}, 
    {"cols": 3, "name": "three"}, 
    {"cols": 4, "name": "four"}, 
    {"cols": 6, "name": "six"}
  ];

  $.each(layout_cols,function(index, value){ 
    update_layout_cols(content_width_px, gutter_width_perc, nr_of_columns, value.cols, value.name);
  });

}

function update_layout_cols(content_width_px, gutter_width_perc, nr_of_columns, cols, col_name){
  var col_width = get_column_width(cols);
   if((nr_of_columns / cols) == Math.floor(nr_of_columns / cols)) {
     var percent = (col_width / content_width_px) * 100;
     $('.colgroup.'+col_name).show();
     $('.colgroup.'+col_name+' .col:not(.gutter)').width(percent+'%').html('1/'+cols+'<br />'+col_width+'px');
     $('.colgroup.'+col_name+' .col.gutter').width(gutter_width_perc+'%');
   }
   else{
     $('.colgroup.'+col_name).hide();
   }
}

$(document).ready(function () {

  $('body').update_info();
  create_grid();

  $('#toggle-simplest a').click( function(e) {
    e.preventDefault();
    $('#simplest').slideToggle();
  });

  $(".increase").click(function(e) {
    e.preventDefault();
     $('#'+$(this).parents('.col').attr('id')+' .val').increase_width()
   });

   $(".decrease").click(function(e) {
     e.preventDefault();
     $('#'+$(this).parents('.col').attr('id')+' .val').decrease_width()
   });

   $(".widths .val").focus(function() {
     $(this).addClass('focus')
   })
   .keyup(function() {
     var val = sanitize_number($(this).text());
     if (val < 1) $(this).text('0');
     create_grid();
     return false;
   })
   .blur(function() {
     $(this).removeClass('focus')
     return false;
   });

});