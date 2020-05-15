
 const form= document.getElementById('form').addEventListener('onclick',function(e){
    e.preventDefault();
},false);
const form2= document.getElementById('form2').addEventListener('onclick',function(e){
    e.preventDefault();
},false);
const addQuantity=async()=>{
    // const unitPrice=document.querySelector('cart-price').innerHTML;
    // const totalPrice=document.querySelector('cart-subtotal').innerHTML;
    

    await fetch('/cart' , {
        method: 'POST'});
   
 
    const quantity= document.getElementById('field');
   
    let value=quantity.value;
    value++;
    quantity.value=value;
    // const newPrice=value*unitPrice;
    // totalPrice.innerHTML='newPrice';

}


function subtractQuantity(){

    
 
    const quantity= document.getElementById('field');
   
    let value=quantity.value;
    if(value>1){
        value--;  
    }
    
    quantity.value=value;
}

