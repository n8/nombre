

var obs = new MutationObserver(function(mutations, observer) {

  // console.log("observing");
  // console.log("number of mutations: " + mutations.length);

  var fullname = null; 

  mutations = mutations.reverse();

  mutations.some(function(mutation) {
    if(mutation.target.classList.contains("original-tweet-container")){
      // console.log("trying to set name");
      fullname = $(mutation.target).find(".fullname").text(); 
      fullname = fullname.split(" ")[0];

      $("#timeline").data("current_fullname", fullname);

      return true
    }
  });

  mutations.some(function(mutation) {

    if(mutation.target.id == "tweet-box-template"){
      var parent_container = $(mutation.target).closest(".expanded-conversation");
      var fullname = $("#timeline").data("current_fullname");
      var use_name = parent_container.data("use_name");

      // console.log("fullname: " + fullname);

      if(fullname && use_name){
        var mutation_text = $(mutation.target).text(); 

        // this is a hacky way of appending the name. I'd love to find a more robust way to intercepting the event that displays the
        // tweet box, but haven't yet. This observers when the tweetbox is changed, and since it's changed multiple times during a reply, 
        // we try to only maniuplate it on the third time (when username_set is 1)

        if(parent_container.data("username_set") != "1"){
          // console.log(fullname);
          
          if(parent_container.data("username_set") == undefined){
            parent_container.data("username_set", "0"); 
          }else if(parent_container.data("username_set") == "0"){

            $($(mutation.target).children()[0]).append(" " + fullname);

            parent_container.data("username_set", "1"); 
          }
          
          return true;
        }
        
      }
    }
    return false;

  

  });    

});

obs.observe($(document).get(0), {
  childList: true, 
  subtree: true
});


// Does a bit of magic to click the reply link but setup the parent container to know we should use the person's name
$(document).on("click", ".reply-with-name-menu-item", function(){
  var parent_container = $(this).closest(".stream-item");
  var reply_link = parent_container.find(".js-action-reply");
  reply_link.children().click();

  // hide the menu
  parent_container.find(".more-tweet-actions button.dropdown-toggle").click();

  $(this).closest(".expanded-conversation").data("use_name", "true");

});


function insertNombreMenu(){
  var reply_link = "<li class='reply-with-name-menu-item' data-nav='share_tweet' role='presentation'><button type='button' class='dropdown-link' role='menuitem'>Reply with name</button></li>";

  // Adds a new menu item
  $(".more-tweet-actions").each(function(index, menu){
    if(!menu.classList.contains("nombre-inserted")){
      $(menu).find(".dropdown-menu ul").prepend(reply_link);
      $(menu).addClass("nombre-inserted");
    }
  });

  setTimeout(insertNombreMenu, 500);
}

setTimeout(insertNombreMenu, 1000);
