const menuBtn = document.getElementById("chatMenuBtn");
const chatMenu = document.getElementById("chatMenu");

menuBtn.onclick = () => {

    if(chatMenu.style.display==="block"){

        chatMenu.style.display="none";

    }else{

        chatMenu.style.display="block";

    }

};

document.addEventListener("click",(e)=>{

    if(!chatMenu.contains(e.target) && e.target!==menuBtn){

        chatMenu.style.display="none";

    }

});