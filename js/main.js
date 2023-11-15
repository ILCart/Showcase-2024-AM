function clicked(){
    alert("clicked")
}

window.addEventListener('load', ()=>{
    document.getElementsByClassName("card menu-card")[0].onclick = clicked
})

