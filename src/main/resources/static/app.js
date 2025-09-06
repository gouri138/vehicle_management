const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', function() {
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            login(email, password);
        });
    }

    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const phone = document.getElementById('phone').value;
            register(name, email, password, phone);
        });
    }

    // Admin dashboard handlers
    const loadCustomersBtn = document.getElementById('loadCustomers');
    if (loadCustomersBtn) {
        loadCustomersBtn.addEventListener('click', loadCustomers);
    }

    const loadAppointmentsBtn = document.getElementById('loadAppointments');
    if (loadAppointmentsBtn) {
        loadAppointmentsBtn.addEventListener('click', loadAppointments);
    }
});

// Extend loadAppointments to add accept/reject buttons
function loadAppointments() {
    fetch(`${API_BASE_URL}/admin/appointments`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const list = document.getElementById('appointmentsList');
        const actions = document.getElementById('appointmentActions');
        if (Array.isArray(data)) {
            list.innerHTML = '<ul class="list-group">' + data.map(appointment =>
                `<li class="list-group-item">
                    ${appointment.appointmentDate} - ${appointment.description} - Customer: ${appointment.customer ? appointment.customer.name : 'N/A'} - Status: ${appointment.status || 'Pending'}
                    <button class="btn btn-success btn-sm ml-2" onclick="updateAppointmentStatus(${appointment.appointmentId}, 'Confirmed')">Accept</button>
                    <button class="btn btn-danger btn-sm ml-2" onclick="updateAppointmentStatus(${appointment.appointmentId}, 'Rejected')">Reject</button>
                    <button class="btn btn-primary btn-sm ml-2" onclick="updateAppointmentStatus(${appointment.appointmentId}, 'Service Done')">Service Done</button>
                </li>`).join('') + '</ul>';
            actions.innerHTML = '';
        } else {
            list.innerHTML = `<div class="alert alert-danger">Failed to load appointments: Unexpected data format</div>`;
            actions.innerHTML = '';
        }
    })
    .catch(error => {
        document.getElementById('appointmentsList').innerHTML = `<div class="alert alert-danger">Failed to load appointments: ${error.message}</div>`;
        document.getElementById('appointmentActions').innerHTML = '';
    });
}

function updateAppointmentStatus(appointmentId, status) {
    fetch(`${API_BASE_URL}/admin/appointments/${appointmentId}/status?status=${status}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Basic ' + btoa('admin:admin'), // Replace with actual auth
        },
    })
    .then(response => {
        if (response.ok) {
            alert(`Appointment ${status.toLowerCase()} successfully.`);
            loadAppointments();
        } else {
            alert('Failed to update appointment status.');
        }
    })
    .catch(error => {
        alert('Error updating appointment status: ' + error.message);
    });
}

function login(email, password) {
    fetch(`${API_BASE_URL}/customer/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Login failed');
        }
    })
    .then(data => {
        localStorage.setItem('customerId', data.customerId);
        window.location.href = 'appointment.html';
    })
    .catch(error => {
        document.getElementById('message').innerHTML = `<div class="alert alert-danger">Login failed: ${error.message}</div>`;
    });
}

function register(name, email, password, phone) {
    fetch(`${API_BASE_URL}/customer/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerHTML = `<div class="alert alert-success">${data.message || 'Registration successful'}</div>`;
    })
    .catch(error => {
        document.getElementById('message').innerHTML = `<div class="alert alert-danger">Registration failed: ${error.message}</div>`;
    });
}

function loadCustomers() {
    fetch(`${API_BASE_URL}/admin/customers`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('customersList');
        list.innerHTML = '<ul class="list-group">' + data.map(customer => `<li class="list-group-item">${customer.name} - ${customer.email}</li>`).join('') + '</ul>';
    })
    .catch(error => {
        document.getElementById('customersList').innerHTML = `<div class="alert alert-danger">Failed to load customers: ${error.message}</div>`;
    });
}



// Appointment page handlers
document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        const customerId = localStorage.getItem('customerId');
        if (customerId) {
            loadUserAppointments(customerId);
        }
    }
});

function createAppointment(customerId, carModel, serviceType, date, time, description) {
    const appointment = {
        car: { model: carModel },
        serviceType: serviceType,
        appointmentDate: date,
        time: time,
        description: description
    };
    fetch(`${API_BASE_URL}/customer/${customerId}/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
    })
    .then(response => response.json())
    .then(data => {
        alert('Appointment requested successfully');
        loadUserAppointments(customerId);
    })
    .catch(error => {
        alert('Failed to request appointment: ' + error.message);
    });
}

function loadUserAppointments(customerId) {
    fetch(`${API_BASE_URL}/customer/${customerId}/appointments`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById('appointmentsList');
        if (Array.isArray(data)) {
            list.innerHTML = '<ul class="list-group">' + data.map(appointment => 
                `<li class="list-group-item">
                    Car: ${appointment.car ? appointment.car.model : 'N/A'} - Service: ${appointment.serviceType} - Date: ${appointment.appointmentDate} - Time: ${appointment.time} - Status: ${appointment.status}
                </li>`).join('') + '</ul>';
        } else {
            list.innerHTML = `<div class="alert alert-danger">Failed to load appointments</div>`;
        }
    })
    .catch(error => {
        document.getElementById('appointmentsList').innerHTML = `<div class="alert alert-danger">Failed to load appointments: ${error.message}</div>`;
    });
}
