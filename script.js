let currentUser = '';
let sodaStock = {
    'Pepsi': 0,  // Inventario del usuario
    'Seven Up': 0,
    'Coca Cola': 0,
    'Sprite': 0
};
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Login functionality
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    if (username) {
        currentUser = username;
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('order-section').style.display = 'block';
        alert(`Bienvenido, ${currentUser}`);
        loadOrders();
    } else {
        alert('Por favor, ingrese un nombre de usuario.');
    }
});

// Placing a new order
document.getElementById('restock-btn').addEventListener('click', () => {
    const soda = document.getElementById('soda').value;
    let quantity = document.getElementById('quantity').value;

    if (!quantity || isNaN(quantity) || quantity <= 0) {
        alert('Por favor, ingresa una cantidad válida.');
        return;
    }

    quantity = parseInt(quantity);
    if (quantity < 1) {
        alert('Debe pedir al menos 1 docena.');
        return;
    }

    // Cálculo de costo
    const sodaPrices = {
        'Pepsi': 6,
        'Seven Up': 5,
        'Coca Cola': 7,
        'Sprite': 5
    };
    const costPerBottle = sodaPrices[soda];
    const bottlesPerDozen = 12;
    const totalCost = costPerBottle * bottlesPerDozen * quantity;
    const date = new Date().toLocaleDateString();
    const batchNumber = Math.floor(Math.random() * 10000);

    // Crear objeto de pedido
    const order = {
        date: date,
        soda: soda,
        batch: batchNumber,
        quantity: quantity,
        totalCost: totalCost,
        status: 'Pending'
    };

    // Agregar el nuevo pedido a la lista de pedidos y guardarlo en localStorage
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    addOrderToTable(order);

    // Actualizar el stock del usuario
    sodaStock[soda] += quantity * 12;

    // Mostrar advertencia si el stock del usuario es igual a 1 docena
    if (sodaStock[soda] === 12) {
        document.getElementById('warning-message').style.display = 'block';
    } else {
        document.getElementById('warning-message').style.display = 'none';
    }
});

// Add order to the table
function addOrderToTable(order) {
    const tableBody = document.querySelector('#orders-table tbody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${order.date}</td>
        <td>${order.soda}</td>
        <td>${order.batch}</td>
        <td>${order.quantity} docenas</td>
        <td>${order.totalCost.toFixed(2)} Bs</td>
        <td>${order.status}</td>
        <td>
            <button class="btn btn-success btn-sm" onclick="completeOrder(${order.batch})">Completar</button>
            <button class="btn btn-danger btn-sm" onclick="cancelOrder(${order.batch})">Cancelar</button>
        </td>
    `;
    tableBody.appendChild(newRow);
}

// Mark order as completed
function completeOrder(batch) {
    const order = orders.find(o => o.batch === batch);
    if (order) {
        order.status = 'Completed';
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();  // Reload the orders to reflect the updated status
    }
}

// Cancel the order
function cancelOrder(batch) {
    const order = orders.find(o => o.batch === batch);
    if (order) {
        order.status = 'Canceled';
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();  // Reload the orders to reflect the updated status
    }
}

// Load and display all orders from localStorage
function loadOrders() {
    const tableBody = document.querySelector('#orders-table tbody');
    tableBody.innerHTML = ''; // Clear the table before loading
    orders.forEach(order => {
        addOrderToTable(order);  // Add each order to the table
    });
}

// Filter orders based on soda type
document.getElementById('filter-btn').addEventListener('click', () => {
    const filterSoda = document.getElementById('filter-soda').value;
    const filteredOrders = filterSoda === 'all' ? orders : orders.filter(o => o.soda === filterSoda);
    
    const tableBody = document.querySelector('#orders-table tbody');
    tableBody.innerHTML = ''; // Clear the table before loading filtered data
    filteredOrders.forEach(order => {
        addOrderToTable(order);  // Add each filtered order to the table
    });
});
