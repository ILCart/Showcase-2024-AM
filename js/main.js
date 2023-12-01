

window.addEventListener('load', ()=>{
    document.querySelectorAll(".card").forEach((card)=>{
        console.log(card)

        card.onclick = (e)=>{
            console.log(card)
        }
    })
})

