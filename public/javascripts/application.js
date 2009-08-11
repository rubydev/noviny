// kazdy request se spravnym headerem
jQuery.ajaxSetup({ 
  'beforeSend': function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
})

// pridavam .js mime k URL pro korektni rails respond_to response
var mimeifyUrl = function(url){
	if (/\.js/.test(url)){
		return url
	} else if (/\?/.test(url)) {
		return url.replace('?', '.js?')
	} else {
		return url + '.js'
	}
}


function getCounter(formObj){
       var pos = formObj.position();
       $("#counter").css("top",pos.top);
       $("#counter").css("left",pos.left+formObj.width()+20);
       $("#counter").html("Pocet znaku:"+formObj.val().length);
       $("#counter").removeClass("hidden");
       $("#counter").addClass("visible");
}


function hideCounter(){
       $("#counter").removeClass("visible");
       $("#counter").addClass("hidden");
}



//onload
$(function()
{
  var options = { 
      dataType: "script"
  };
  $("form").ajaxForm(options);
  
  //$("div[id^='group-'] h2").click(function() { navigationClick( $(this), null, $(this).parent().parent() ) });
  //$("#articles h2").click(function() { getArticles( $(this) ) });
  //$("#authors h2").click(function() { getAuthors( $(this) ) });
  $("#viewRecord").hide();
  
  //counter

  
});


function getAuthors( obj )
{
  if(obj.attr("class") == 'active')
  {
    obj.removeClass('active');
    obj.addClass('folder');
    $("#authors .listFilter > *").remove();
    $("#authors .listContent > *").remove();
  }else{
    obj.removeClass('folder');
    obj.addClass('active');
  
  $.ajax({
    type: 'GET',
    url: '/admin/authors',
    dataType: 'script',
    error: function(msg) { alert("Chyba v přenosu dat."); },
    success: function(data, status) {
      $("tr[id^='author_'] a.edit_author").bind("click", function() { return editAuthor( $(this))} );
      $("a[id^='authors_new']").bind("click", function() { return newAuthor()} );
    }
  });
  return false;
  }

}


function newAuthor()
{
  $("#listView").addClass("listSmall");
  $.ajax({
    type: 'GET',
    dataType: 'script',
    url: '/admin/authors/new',
    error: function(msg) { alert("Chyba v přenosu dat."); },
    success: function(data, status) {
      $(".recordHeader a").bind("click", function() { return cancelLeaf() });      
    }
  });
  return false;
  
}


function editAuthor( obj )
{
  $("#listView").addClass("listSmall");
  $.ajax({
    type: 'GET',
    dataType: 'script',
    url: '/admin/authors/' + $(obj).parent().parent().attr("id").split("_")[1] + "/edit",
    error: function(msg) { alert("Chyba v přenosu dat."); },
    success: function(data, status) {
      $(".recordHeader a").bind("click", function() { return cancelArticle() });
      //$("a[id^='file_']").bind("click", function() { return removeFileFromArticle( $(this).parent().parent().attr("id").split("_")[1], $(this).attr("id").split("_")[1] ) });      
    }
  });
  return false;

}

function getArticles( obj )
{
  if(obj.attr("class") == 'active')
  {
    obj.removeClass('active');
    obj.addClass('folder');
    $("#articles .listFilter > *").remove();
    $("#articles .listContent > *").remove();
  }else{
    obj.removeClass('folder');
    obj.addClass('active');
  
  $.ajax({
    type: 'GET',
    url: '/admin/articles',
    dataType: 'script',
    error: function(msg) { alert("Chyba v přenosu dat."); },
    success: function(data, status) {
      //$("tr[id^='article_'] a.file").bind("click", function() { return showArticle( $(this))} );
      $("tr[id^='article_'] a.file").bind("click", function() { return editArticle( $(this))} );
      $("tr[id^='article_'] a.edit_article").bind("click", function() { return editArticle( $(this))} );
      $("a[id^='articles_new']").bind("click", function() { return newArticle()} );
      $(".pagination a").bind("click", function() {
        $(".pagination").html("");
        $("#articles tr").remove();
        //$.get(this.href, null, null, "script");
       // var params = $(this.href);
        //alert($(this.href.params[0]));
        $.ajax({
          type: 'GET',
          url: '/admin/articles',
          data: 'page=2',
          dataType: 'script',
          error: function(msg) { alert("Chyba v přenosu dat."); },
          success: function(data, status) {

          }
        });
        return false;
      });    
    }
  });
  
  return false;
  }  
}

function newArticle()
{
  $("#listView").addClass("listSmall");
  $.ajax({
    type: 'GET',
    dataType: 'script',
    url: '/admin/articles/new',
    error: function(msg) { alert("Chyba v přenosu dat."); },
    success: function(data, status) {
      setCounterEvents();
      $(".recordHeader a").bind("click", function() { return cancelLeaf() });
      $("#article_section_id").change(function()
      {


      });      
    }
  });
  return false;
  
}


function editArticle( obj )
{
  $("#listView").addClass("listSmall");
  $.ajax({
    type: 'GET',
    dataType: 'script',
    url: '/admin/articles/' + $(obj).parent().parent().attr("id").split("_")[1] + "/edit",
    error: function(msg) { alert("Chyba v přenosu dat."); },
    success: function(data, status) {
      setCounterEvents();
      $("#article_section_id").change(function()
      {

      });
      $(".recordHeader a").bind("click", function() { return cancelArticle() });
      $("a[id^='file_']").bind("click", function() { return removeFileFromArticle( $(this).parent().parent().attr("id").split("_")[1], $(this).attr("id").split("_")[1] ) });      
    }
  });
  return false;

}


function setCounterEvents()
{
  $(".countable").focus(function() { getCounter( $(this) ) });
  $(".countable").keydown(function() { getCounter( $(this) )});
  $(".countable").blur(function() {hideCounter()});
  $("#viewRecord").scroll(function() {hideCounter()});
}

function loadSubsections( id )
{
  
}

function dragAndDrop()
{  
  //add file
  $(".dnd").droppable({
    accept: "div[id^='picture_']",
  	//activeClass: 'ui-state-highlight',
  	drop: function(ev, ui) {
  	  addFileToArticle( $(this).attr("id").split("_")[1] ,ui.draggable.attr("id").split("_")[1] );
  	  }
  	});
    
  //remove file - nepouzivat
  /*
  $(".listImageBox").droppable({
		accept: "div[id^='picture_']",
		//activeClass: 'custom-state-active',
		drop: function(ev, ui) {
		}
	});
	*/  
}

function addFileToArticle( article, file )
{
  $.ajax({
     type: 'POST',
     url: '/admin/articles/add_file/'+ article +'/'+file,
     dataType: 'script',
     error: function(msg) { alert("Chyba v přenosu dat."); },
     success: function(data, status) {
       //alert(data.picture.data_file_name);from json      
     }
   });
   return false; 
}

function removeFileFromArticle( article, file )
{
  $.ajax({
     type: 'POST',
     url: '/admin/articles/remove_file/'+ article +'/'+file,
     dataType: 'script',
     error: function(msg) { alert("Chyba v přenosu dat."); },
     success: function(data, status) {      
     }
   });
   return false;
}

function cancelArticle()
{
  $("#viewRecord").hide();
  $("#recordHeader a").unbind();
  $("#listView").removeClass("listSmall");
}


function navigationClick( obj, id, type ) 
{
  //alert(type.attr("id"));
  if(obj.attr("class") == 'active')//mazani subvetvi
  {
    obj.removeClass('active');
    obj.addClass('folder');

    if( id != null )
    {
      var del = $(obj).parent().parent().attr("id");
      $("tr[id!='"+del+"'][id^='"+del+"']").remove();
    }else{
      $("div[id^='group-"+type.attr("id").split("-")[1]+"'] .listFilter > *").remove();
      $("div[id^='group-"+type.attr("id").split("-")[1]+"'] .listContent > *").remove();
    }       
  }else{//pridavani
    obj.removeClass('folder');
    obj.addClass('active');
    if( id != null )
    {
      var ar = $(obj).parent().parent().attr("id").split("-");
      var tree = ar.slice(1, ar.length).join("-");
    }else{
      var tree = "";
    }  
    $.ajax({
      type: 'GET',
      url: '/admin/albums/get_level',
      data: 'id='+id+'&tree='+tree+'&type='+type.attr("id").split("-")[1],
      dataType: 'script',
      //beforeSend: function() { $("div[id^='group-"+type.attr("id").split("-")[1]+"'] h2").addClass("loading"); },
      error: function(msg) { alert("Chyba v přenosu dat."); },
      success: function(data, status) {
        //$("div[id^='group-"+type.attr("id").split("-")[1]+"'] h2").removeClass("loading");
        $("td.listItem a").bind("click", function() { return navigationClick( $(this), $(this).parent().attr("id"), $(this).parent().parent().parent().parent().parent().parent() ) });
        $("td a[class^='editLeaf-']").bind("click", function() { return editLeaf( $(this).attr("eid"), $(this).attr("class").split("-")[1]  ) });
        $("div[id^='picture_']").css("cursor: move;");
        $("div[id^='picture_']").draggable({
        	revert: 'invalid',
        	helper: 'clone',
        	cursor: 'move'
        });
        dragAndDrop(); 
      }
    });
    return false;
  }    
}

function editImage( id )
{
  
}

function newLeaf( type )
{
  $("#listView").addClass("listSmall");
  $.ajax({
    type: 'GET',
    dataType: 'script',
    data: 'type='+type,
    url: '/admin/albums/new',
    error: function(msg) { alert("Chyba v přenosu dat."); },
    success: function(data, status) {
      $(".recordHeader a").bind("click", function() { return cancelLeaf() });      
    }
  });
  return false;
}

function newAtt( type )
{
  var lnk = type;
  if (lnk == 'image') lnk = 'picture';
  $("#listView").addClass("listSmall");
  $.ajax({
    type: 'GET',
    dataType: 'script',
    url: '/admin/'+ lnk +'s/new', 
    data: 'type=' + type,
    //beforeSend: function() { $("#group1 h2").addClass("loading"); },
    error: function(msg) { alert("Chyba v přenosu dat."); },
    success: function(data, status) {
      //$("#group1 h2").removeClass("loading");
      $(".recordHeader a").bind("click", function() { return cancelLeaf() });      
    }
  });
  return false;
}

function editLeaf( id, type )
{
  $("#listView").addClass("listSmall");
  $.ajax({
    type: 'GET',
    url: '/admin/albums/'+id+'/edit',
    data: 'type='+type,
    dataType: 'script',
    error: function(msg) { alert("Chyba v přenosu dat."); },
    success: function(data, status) {
      $(".recordHeader a").bind("click", function() { return cancelLeaf() });      
    }
  });
  return false;
}

function cancelLeaf()
{
  $("#viewRecord").hide();
  $("#recordHeader a").unbind();
  $("td a.editLeaf").bind("click", function() { return editLeaf( $(this).attr("eid") ) });
  $("#listView").removeClass("listSmall");
}

/* show je shortcut pro edit - nebude vubec
function showArticle( obj )
{
  $("#listView").addClass("listSmall");
  $.ajax({
    type: 'GET',
    dataType: 'script',
    url: '/admin/articles/' + $(obj).parent().parent().attr("id").split("_")[1],
    beforeSend: function() { $("#articles h2").addClass("loading"); },
    error: function(msg) { alert("Chyba v přenosu dat."); },
    success: function(data, status) {
      $("#articles h2").removeClass("loading");
      $(".recordHeader a").bind("click", function() { return cancelArticle() });      
    }
  });
  return false;
}
*/

/*
function remove_field(element, item) 
{
  element.up(item).remove();
}
*/