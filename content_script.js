

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
      // console.log("fullname: " + fullname);

      if(fullname){
        var mutation_text = $(mutation.target).text(); 

        if(parent_container.data("username_set") != "1"){
          // console.log(fullname);
          $($(mutation.target).children()[0]).append(" " + fullname);

          if(parent_container.data("username_set") == undefined){
            parent_container.data("username_set", "0"); 
          }else if(parent_container.data("username_set") == "0"){
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

// $(document).on("click", "div", function(){
//   console.log("reloading observer");

//   if($("#timeline").get(0)){
//     obs.observe($("#timeline").get(0), {
//       childList: true, 
//       subtree: true
//     });
//   }

// });

