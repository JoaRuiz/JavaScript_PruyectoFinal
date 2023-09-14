//CARDS
const cardsContainer = document.querySelector(".cards__container");


const cardsHtml = (array, contenedor) => {
    const cards = array.reduce((acc, element) => {
        return acc + `
        <div class="card" id="card-${element.id}">
            <h2>${element.title}</h2>
            <figure class="container-img">
                <img class="img" src=${element.image} alt="imagen del producto ${element.title}">
            </figure>
            <p>Precio: $${element.price}<p>
            <button class="button" id="button-${element.id}">
                Añadir al carrito
            </button>
        </div>
    `;
    }, "");

    contenedor.innerHTML = cards;

    const allCards = cardsContainer.querySelectorAll(".button");
    eventoCards(allCards, array);
};

//CARRITO
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];


const eventoCards = (nodos, array) => {
    for (let i = 0; i < nodos.length; i++) {
        nodos[i].onclick = (e) => {
            const id = e.currentTarget.id.slice(7);
            const buscarProducto = array.find(element => element.id === Number(id));
            const productoEnCarrito = carrito.find(item => item.id === buscarProducto.id);
            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                buscarProducto.cantidad = 1;
                carrito.push(buscarProducto);
            }

            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
            Toastify({
                text: "Se ha añadido a tu carrito",
                className: "info",
                gravity: "bottom",
                position: "left",
                style: {
                    background: "rgb(26, 112, 26)",
                }
            }).showToast();
        };
    }
};


const mostrarCarrito = () => {
    const cardsCarrito = document.querySelector('.cards__carrito');
    cardsCarrito.innerHTML = '';

    carrito.forEach(producto => {
        const cardCarrito = document.createElement('div');
        cardCarrito.classList.add('card-carrito');
        cardCarrito.innerHTML = `
        <div class="carrito__container" id="carrito__container-${producto.id}">
            <figure class="container__img">
                <img class="carrito__img" src=${producto.image} alt="imagen del producto ${producto.title}">
            </figure>
            <div class="container__hp">
                <h2>${producto.title}</h3>
                <div class="container__pbp">
                <p>Precio: $${producto.price}</p>
                <div class="cantidad-container">
                    <button data-producto-id="${producto.id}" class="restar-button">-</button>
                    <p class="cantidad">${producto.cantidad}</p>
                    <button data-producto-id="${producto.id}" class="sumar-button">+</button>
                </div>
                </div>
            </div>
            <div class="container__butoon">
                <button data-producto-id="${producto.id}" class="eliminar-button">X</button>
            </div>
        </div>
        `;

        const eliminarProductoDelCarrito = (id) => {
            const productoIndex = carrito.findIndex(producto => producto.id === id);

            if (productoIndex !== -1) {
                carrito.splice(productoIndex, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarCarrito();
                mostrarTotalCarrito();
            } else {
                console.error("El producto no se encontró en el carrito.");
            }
            mostrarTotalCarrito();
        };

        const eliminarButtons = document.querySelectorAll('.eliminar-button');
        eliminarButtons.forEach(button => {
            const id = button.getAttribute('data-producto-id');
            button.addEventListener('click', () => {
                eliminarProductoDelCarrito(Number(id));
            });
        });

        const restarButton = cardCarrito.querySelector('.restar-button');
        restarButton.addEventListener('click', () => {
            const id = restarButton.getAttribute('data-producto-id');
            restarCantidadProducto(Number(id));
            mostrarTotalCarrito();
        });

        const sumarButton = cardCarrito.querySelector('.sumar-button');
        sumarButton.addEventListener('click', () => {
            const id = sumarButton.getAttribute('data-producto-id');
            sumarCantidadProducto(Number(id));
            mostrarTotalCarrito();
        });

        cardsCarrito.appendChild(cardCarrito);
    });
};

const restarCantidadProducto = (id) => {
    const productoEnCarrito = carrito.find(item => item.id === id);

    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad === 1) {
            eliminarProductoDelCarrito(id);
        } else {
            productoEnCarrito.cantidad--;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
        }
    }
};

const sumarCantidadProducto = (id) => {
    const productoEnCarrito = carrito.find(item => item.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
};

const calcularTotalCarrito = () => {
    let total = 0;
    carrito.forEach(producto => {
        total += producto.price * producto.cantidad;
    });
    return total;
};

const mostrarTotalCarrito = () => {
    const totalCarritoElement = document.getElementById("total-carrito");
    const total = calcularTotalCarrito();
    totalCarritoElement.textContent = `Total: $${total.toFixed(2)}`;
};
mostrarTotalCarrito();


//MENU HAMBURGUESA
const menuIcon = document.getElementById('menu-icon');
const menu = document.getElementById('menu');

menuIcon.addEventListener('click', () => {
    menu.classList.toggle('active');
});


const closeMenuButton = document.getElementById('close-menu-button');

closeMenuButton.addEventListener('click', () => {
    menu.classList.remove('active');
});



//API ECCOMERCE
fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(json => {
        console.log(json);
        cardsHtml(json, cardsContainer);
    })
    .catch(() => console.log("error en la reques"));
