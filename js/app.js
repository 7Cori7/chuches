//* SELECTORES:

const formulario = document.querySelector('form');
const btnOpciones = document.querySelector('#opciones');
const grid = document.querySelector('.grid');

//* Variables:
let clave, opcion, cambio, llenar;
var rep = true;


//* Estructuras para guardar:

let ventasChu = [];

const objChu = {
    nombre: ''
}



//* EVENTOS:

document.addEventListener('DOMContentLoaded', mostrarChuches);



function mostrarChuches(){

    limpiarHTML();

    chucherias.forEach(i=>{
        
        const fila = document.createElement('div');
        fila.classList.add('tarjeta');

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'dulces';
        input.value = i.nombre;
        input.id = `producto-${i.id}`;


        input.onchange = function(){
            objChu.nombre = input.value;
            
            if(input.parentElement.classList.contains('agotados')){
                input.disabled = true;
            }
        }

        const imagen = document.createElement('img');
        imagen.src = 'css/chuches/16.trululu.jfif';

        const nombre = document.createElement('p');
        nombre.textContent = i.nombre;
        nombre.classList.add('nombre');

        const precio = document.createElement('p');
        precio.textContent = i.precio;
        precio.classList.add('precio');

        fila.appendChild(input);
        fila.appendChild(imagen);
        fila.appendChild(nombre);
        fila.appendChild(precio);

        grid.appendChild(fila);

        formulario.appendChild(grid);

        if(i.cantidad <= 0){
            fila.classList.add('agotados')
        }

    })

    const boton = document.createElement('div');
    boton.innerHTML = `
    
    <div class="boton">
        <input type="submit" value="COMPRAR">
    </div>
    
    `

    formulario.appendChild(boton);

}

formulario.addEventListener('submit', comprarChu);


btnOpciones.addEventListener('click', administrarMaq);



//* FUNCIONES:

function comprarChu(e){
    e.preventDefault();
    
    let solicitar = objChu.nombre;
    let existe = chucherias.some(i => i.nombre === solicitar && i.cantidad > 0);

    //Validaciones:
    if(existe){

        ////console.log(solicitar)
        let chuche = chucherias.filter(i => i.nombre === solicitar && i.precio);
        const price = chuche.map(i => i.precio)

        const objCompra = {
            nombre: solicitar,
            precio: price[0],
            cantidad: 1 
        }

        ventasChu = [...ventasChu, objCompra];
        console.log(ventasChu)
        let chuCompra = new Array();
        chuCompra.push(objCompra);


        //OPERACIONES:
        const stockActual = chucherias.map(i => {
            let cantidadVendida = 0;
            let cantidadActual = i.cantidad;

            chuCompra.forEach(venta => {
                if (venta.nombre === i.nombre)
                    cantidadVendida = venta.cantidad;
            })
            i.cantidad = cantidadActual - cantidadVendida;
            return i;
        })
        console.log(stockActual);
        alert('Ha comprado la chucheria:\n' + solicitar + '\nPor favor retire su compra.\nGracias.');

        formulario.reset();

    }else if (objChu.nombre === ''){
        alert('No ha seleccionado ninguna chucheria');
    }else{
        alert('La chuchería solicitada está agotada.\nPor favor retire su dinero o elija otra chucheria');
    }


    mostrarChuches();

    scroll();
    
}

function administrarMaq(e){
    e.preventDefault();
    ////console.log('administrando maquina')
    clave = prompt('Indique su contraseña');

    if(clave === 'TecChu2022'){
        do{
            opcion = parseInt(prompt('1. Recargar chucheria \n 2. Apagar Maquina \n 3. Salir del menú'));

            switch (opcion){
                
                case 1:
                    //RECARGAR MAQUINA:
                    cambio = prompt('indique el NOMBRE de la chucheria que quiere recargar');
                    let requestFill = chucherias.some(i => i.nombre === cambio && i.cantidad < 10);

                    if(requestFill){
                        llenar = prompt('indique la CANTIDAD de chuchería a rellenar');

                        const refObj = {
                            nombre: cambio,
                            cantidad: Number(llenar)
                        }

                        if(refObj.cantidad > 10){
                            alert('Solo puedes introducir un máximo de 10 chucherías');
                            rep = true;
                        }else{
                            let vacioArray = new Array();
                            vacioArray.push(refObj);

                            const refillStock = chucherias.map(ref => {
                                let cantRefill = 0;
                                let cantActual = ref.cantidad;
    
                                vacioArray.forEach(relleno => {
                                    if (relleno.nombre === ref.nombre)
                                        cantRefill = relleno.cantidad;
                                })
                                    ref.cantidad = cantActual + cantRefill;
                                    if (ref.cantidad > 10){
                                    alert('La cantidad de chucherias sobrepasa la capacidad de almacenamiento de la maquina.\nSe colocaran solamente hasta 10 chucherias');
                                        ref.cantidad = 10;
                                        return ref;
                                    }else{
                                        return ref;
                                    }
                            })
                            console.log(refillStock);
    
                            alert('Cambio de chucheria exitoso');
                            limpiarHTML();
                            rep = false;
                        }
                    }else{
                        alert('la chucheria no está vacía');
                        rep = true;
                    }
                    mostrarChuches();
                    break;
                    
                case 2:
                    //APAGAR MAQUINA:

                    const ventasTotales = ventasChu.reduce((acc,cur)=> acc + cur.precio, 0)

                    const total = ventasTotales.toFixed(1);

                    if (ventasChu.length > 0) {
                        ////console.log(ventasChu.length)
                        alert('Hoy hubieron ' + ventasChu.length + ' ventas!\nCon una ganancia total de:\n' + '$' + total);
                        rep = false;
                    } else {
                        alert('Hoy hubieron 0 ventas')
                        rep = false;
                    }
                    break;
                    
                case 3:
                    //SALIR DEL MENU:
                    rep = false;
                    break;

            }

        }while (rep);

    }else{
        alert('Contraseña inválida');
        rep = true;
    }
}


function limpiarHTML(){
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }

    while (formulario.firstChild){
        formulario.removeChild(formulario.firstChild);
    }
}

function scroll(){
    setTimeout(() => {
        formulario.scrollIntoView();
    }, 300); 
}