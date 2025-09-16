// const API_BASE_URL = 'http://localhost:8080';

// document.addEventListener('DOMContentLoaded', function() {
//     // Login form handler
//     const loginForm = document.getElementById('loginForm');
//     if (loginForm) {
//         loginForm.addEventListener('submit', function(e) {
//             e.preventDefault();
//             const email = document.getElementById('email').value;
//             const password = document.getElementById('password').value;
//             login(email, password);
//         });
//     }

//     // Register form handler
//     const registerForm = document.getElementById('registerForm');
//     if (registerForm) {
//         registerForm.addEventListener('submit', function(e) {
//             e.preventDefault();
//             const name = document.getElementById('name').value;
//             const email = document.getElementById('email').value;
//             const password = document.getElementById('password').value;
//             const phone = document.getElementById('phone').value;
//             register(name, email, password, phone);
//         });
//     }

//     // Admin dashboard handlers
//     const loadCustomersBtn = document.getElementById('loadCustomers');
//     if (loadCustomersBtn) {
//         loadCustomersBtn.addEventListener('click', loadCustomers);
//     }

//     const loadAppointmentsBtn = document.getElementById('loadAppointments');
//     if (loadAppointmentsBtn) {
//         loadAppointmentsBtn.addEventListener('click', loadAppointments);
//     }
// });

// // Extend loadAppointments to add accept/reject buttons
// function loadAppointments() {
//     fetch(`${API_BASE_URL}/admin/appointments`, {
//         method: 'GET',
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then(data => {
//         const list = document.getElementById('appointmentsList');
//         const actions = document.getElementById('appointmentActions');
//         if (Array.isArray(data)) {
//             list.innerHTML = '<ul class="list-group">' + data.map(appointment =>
//                 `<li class="list-group-item">
//                     ${appointment.appointmentDate} - ${appointment.description} - Customer: ${appointment.customer ? appointment.customer.name : 'N/A'} - Status: ${appointment.status || 'Pending'}
//                     <button class="btn btn-success btn-sm ml-2" onclick="updateAppointmentStatus(${appointment.appointmentId}, 'Confirmed')">Accept</button>
//                     <button class="btn btn-danger btn-sm ml-2" onclick="updateAppointmentStatus(${appointment.appointmentId}, 'Rejected')">Reject</button>
//                     <button class="btn btn-primary btn-sm ml-2" onclick="updateAppointmentStatus(${appointment.appointmentId}, 'Service Done')">Service Done</button>
//                 </li>`).join('') + '</ul>';
//             actions.innerHTML = '';
//         } else {
//             list.innerHTML = `<div class="alert alert-danger">Failed to load appointments: Unexpected data format</div>`;
//             actions.innerHTML = '';
//         }
//     })
//     .catch(error => {
//         document.getElementById('appointmentsList').innerHTML = `<div class="alert alert-danger">Failed to load appointments: ${error.message}</div>`;
//         document.getElementById('appointmentActions').innerHTML = '';
//     });
// }

// function updateAppointmentStatus(appointmentId, status) {
//     fetch(`${API_BASE_URL}/admin/appointments/${appointmentId}/status?status=${status}`, {
//         method: 'PUT',
//         headers: {
//             'Authorization': 'Basic ' + btoa('admin:admin'), // Replace with actual auth
//         },
//     })
//     .then(response => {
//         if (response.ok) {
//             alert(`Appointment ${status.toLowerCase()} successfully.`);
//             loadAppointments();
//         } else {
//             alert('Failed to update appointment status.');
//         }
//     })
//     .catch(error => {
//         alert('Error updating appointment status: ' + error.message);
//     });
// }

// function login(email, password) {
//     fetch(`${API_BASE_URL}/customer/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error('Login failed');
//         }
//     })
//     .then(data => {
//         localStorage.setItem('customerId', data.customerId);
//         window.location.href = 'appointment.html';
//     })
//     .catch(error => {
//         document.getElementById('message').innerHTML = `<div class="alert alert-danger">Login failed: ${error.message}</div>`;
//     });
// }

// function register(name, email, password, phone) {
//     fetch(`${API_BASE_URL}/customer/register`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name, email, password, phone }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         document.getElementById('message').innerHTML = `<div class="alert alert-success">${data.message || 'Registration successful'}</div>`;
//     })
//     .catch(error => {
//         document.getElementById('message').innerHTML = `<div class="alert alert-danger">Registration failed: ${error.message}</div>`;
//     });
// }

// function loadCustomers() {
//     fetch(`${API_BASE_URL}/admin/customers`, {
//         method: 'GET',
//     })
//     .then(response => response.json())
//     .then(data => {
//         const list = document.getElementById('customersList');
//         list.innerHTML = '<ul class="list-group">' + data.map(customer => `<li class="list-group-item">${customer.name} - ${customer.email}</li>`).join('') + '</ul>';
//     })
//     .catch(error => {
//         document.getElementById('customersList').innerHTML = `<div class="alert alert-danger">Failed to load customers: ${error.message}</div>`;
//     });
// }



// // Appointment page handlers
// document.addEventListener('DOMContentLoaded', function() {
//     const appointmentForm = document.getElementById('appointmentForm');
//     if (appointmentForm) {
//         const customerId = localStorage.getItem('customerId');
//         if (customerId) {
//             loadUserAppointments(customerId);
//         }
//     }
// });

// function createAppointment(customerId, carModel, serviceType, date, time, description) {
//     const appointment = {
//         car: { model: carModel },
//         serviceType: serviceType,
//         appointmentDate: date,
//         time: time,
//         description: description
//     };
//     fetch(`${API_BASE_URL}/customer/${customerId}/appointments`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(appointment),
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert('Appointment requested successfully');
//         loadUserAppointments(customerId);
//     })
//     .catch(error => {
//         alert('Failed to request appointment: ' + error.message);
//     });
// }

// function loadUserAppointments(customerId) {
//     fetch(`${API_BASE_URL}/customer/${customerId}/appointments`, {
//         method: 'GET',
//     })
//     .then(response => response.json())
//     .then(data => {
//         const list = document.getElementById('appointmentsList');
//         if (Array.isArray(data)) {
//             list.innerHTML = '<ul class="list-group">' + data.map(appointment => 
//                 `<li class="list-group-item">
//                     Car: ${appointment.car ? appointment.car.model : 'N/A'} - Service: ${appointment.serviceType} - Date: ${appointment.appointmentDate} - Time: ${appointment.time} - Status: ${appointment.status}
//                 </li>`).join('') + '</ul>';
//         } else {
//             list.innerHTML = `<div class="alert alert-danger">Failed to load appointments</div>`;
//         }
//     })
//     .catch(error => {
//         document.getElementById('appointmentsList').innerHTML = `<div class="alert alert-danger">Failed to load appointments: ${error.message}</div>`;
//     });
// }


const API_BASE_URL = 'http://localhost:8080';

// DOM Ready
document.addEventListener('DOMContentLoaded', function () {
  // Login form handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  }

  // Register form handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
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

  // Appointment page handlers
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    // Require login
    const customerIdStored = localStorage.getItem('customerId');
    if (!customerIdStored) {
      alert('Please login first.');
      window.location.href = 'login.html';
      return;
    }
    document.getElementById('customerId').value = customerIdStored;

    // Load car names and models from backend
    let carModelsMap = {};
    fetch(`${API_BASE_URL}/customer/carmodels`)
      .then(response => response.json())
      .then(data => {
        carModelsMap = data;
        const carNameSelect = document.getElementById('carName');
        for (const carName in carModelsMap) {
          const option = document.createElement('option');
          option.value = carName;
          option.textContent = carName;
          carNameSelect.appendChild(option);
        }
      });

    // Load service types from backend
    let serviceTypes = [];
    fetch(`${API_BASE_URL}/customer/servicetypes`)
      .then(response => response.json())
      .then(data => {
        serviceTypes = data;
        const serviceTypeSelect = document.getElementById('serviceType');
        serviceTypes.forEach(service => {
          const option = document.createElement('option');
          option.value = service;
          option.textContent = service;
          serviceTypeSelect.appendChild(option);
        });
      });

    // Update models dropdown when car name changes
    document.getElementById('carName').addEventListener('change', function () {
      const selectedCar = this.value;
      const modelSelect = document.getElementById('carModel');
      modelSelect.innerHTML = '<option value="">Select a model</option>';
      if (selectedCar && carModelsMap[selectedCar]) {
        carModelsMap[selectedCar].forEach(model => {
          const option = document.createElement('option');
          option.value = model;
          option.textContent = model;
          modelSelect.appendChild(option);
        });
      }
    });

    // Submit
    appointmentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const customerId = document.getElementById('customerId').value;
      const carName = document.getElementById('carName').value;
      const carModel = document.getElementById('carModel').value;
      const serviceType = document.getElementById('serviceType').value;
      const currentKm = document.getElementById('currentKm').value;
      const appointmentDate = document.getElementById('appointmentDate').value;
      const time = document.getElementById('time').value;
      const description = document.getElementById('description').value;

      // This matches the original backend expectations
      const appointment = {
        carName,
        carModel,
        serviceType,
        currentKm: parseInt(currentKm),
        appointmentDate,
        time,
        description
      };

      fetch(`${API_BASE_URL}/customer/${customerId}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      })
        .then(response => {
          if (response.ok) {
            document.getElementById('message').innerHTML = '<div class="alert alert-success">Appointment booked successfully.</div>';
            appointmentForm.reset();
            loadUserAppointments(customerId);
            loadUserReminders(customerId);
          } else {
            throw new Error('Failed to book appointment.');
          }
        })
        .catch(error => {
          document.getElementById('message').innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        });
    });

    // Load user's appointments on page load
    loadUserAppointments(customerIdStored);
    loadUserReminders(customerIdStored);
  }
});

// Admin: load appointments with actions
function loadAppointments() {
  fetch(`${API_BASE_URL}/admin/appointments`, { method: 'GET' })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      const list = document.getElementById('appointmentsList');
      const actions = document.getElementById('appointmentActions');
      if (Array.isArray(data)) {
        list.innerHTML =
          '<ul class="list-ul">' +
          data
            .map(appointment => {
              const customerName = appointment.customer ? appointment.customer.name : 'N/A';
              const status = (appointment.status || 'Pending');
              const badgeClass =
                status === 'Confirmed' ? 'badge-success'
                : status === 'Rejected' ? 'badge-danger'
                : status === 'Service Done' ? 'badge-info'
                : 'badge-warning';

              const carName = appointment.carName || (appointment.car ? appointment.car.model : 'N/A');

              return `
              <li class="list-item">
                <div>
                  <div><strong>${appointment.appointmentDate}</strong> • <span class="hint">${appointment.time || ''}</span></div>
                  <div class="hint">${appointment.description || ''}</div>
                  <div class="hint">Customer: ${customerName}</div>
                  <div class="hint">Car: ${carName}</div>
                </div>
                <div class="actions">
                  <span class="badge ${badgeClass}">${status}</span>
                  <button class="btn btn-sm btn-success" onclick="updateAppointmentStatus(${appointment.appointmentId}, 'Confirmed')">Accept</button>
                  <button class="btn btn-sm btn-danger" onclick="updateAppointmentStatus(${appointment.appointmentId}, 'Rejected')">Reject</button>
                  <button class="btn btn-sm btn-primary" onclick="updateAppointmentStatus(${appointment.appointmentId}, 'Service Done')">Service Done</button>
                </div>
              </li>`;
            })
            .join('') +
          '</ul>';
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
  fetch(`${API_BASE_URL}/admin/appointments/${appointmentId}/status?status=${encodeURIComponent(status)}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Basic ' + btoa('admin:admin'), // Replace with real auth in production
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
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Login failed');
    })
    .then(data => {
      localStorage.setItem('customerId', data.customerId);
      window.location.href = 'appointment.html';
    })
    .catch(error => {
      const box = document.getElementById('message');
      if (box) box.innerHTML = `<div class="alert alert-danger">Login failed: ${error.message}</div>`;
    });
}

function register(name, email, password, phone) {
  fetch(`${API_BASE_URL}/customer/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone }),
  })
    .then(response => {
      if (response.ok) {
        return response.json().then(data => {
          const box = document.getElementById('message');
          if (box) box.innerHTML = `<div class="alert alert-success">${data.message || 'Registration successful'}</div>`;
        });
      } else {
        return response.json().then(data => {
          const box = document.getElementById('message');
          if (box) box.innerHTML = `<div class="alert alert-danger">${data.error || 'Registration failed'}</div>`;
        });
      }
    })
    .catch(error => {
      const box = document.getElementById('message');
      if (box) box.innerHTML = `<div class="alert alert-danger">Registration failed: ${error.message}</div>`;
    });
}

function loadCustomers() {
  fetch(`${API_BASE_URL}/admin/customers`, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById('customersList');
      list.innerHTML =
        '<ul class="list-ul">' +
        data.map(customer => `<li class="list-item"><div>${customer.name} — <span class="hint">${customer.email}</span></div></li>`).join('') +
        '</ul>';
    })
    .catch(error => {
      document.getElementById('customersList').innerHTML = `<div class="alert alert-danger">Failed to load customers: ${error.message}</div>`;
    });
}

function loadUserAppointments(customerId) {
  fetch(`${API_BASE_URL}/customer/${customerId}/appointments`, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById('appointmentsList');
      if (!list) return;
      if (Array.isArray(data)) {
        list.innerHTML =
          '<ul class="list-ul">' +
          data
            .map(appointment => {
              const status = appointment.status || 'Pending';
              const badgeClass =
                status === 'Confirmed' ? 'badge-success'
                : status === 'Rejected' ? 'badge-danger'
                : status === 'Service Done' ? 'badge-info'
                : 'badge-warning';

              let reminder = '';
              if (appointment.nextServiceDate) {
                reminder = `<div class="hint"><strong>Next Service Reminder:</strong> ${appointment.nextServiceType} on ${appointment.nextServiceDate}</div>`;
              } else if (appointment.nextServiceKm) {
                reminder = `<div class="hint"><strong>Next Service Reminder:</strong> ${appointment.nextServiceType} after ${appointment.nextServiceKm} km</div>`;
              }

              return `<li class="list-item">
                <div>
                  <div><strong>Car:</strong> ${appointment.car ? appointment.car.model : (appointment.carModel || 'N/A')}</div>
                  <div class="hint"><strong>Service:</strong> ${appointment.serviceType} • <strong>Date:</strong> ${appointment.appointmentDate} • <strong>Time:</strong> ${appointment.time || '-'}</div>
                  ${reminder}
                </div>
                <div><span class="badge ${badgeClass}">${status}</span></div>
              </li>`;
            })
            .join('') +
          '</ul>';
      } else {
        list.innerHTML = `<div class="alert alert-danger">Failed to load appointments</div>`;
      }
    })
    .catch(error => {
      const box = document.getElementById('appointmentsList');
      if (box) box.innerHTML = `<div class="alert alert-danger">Failed to load appointments: ${error.message}</div>`;
    });
}

function loadUserReminders(customerId) {
  fetch(`${API_BASE_URL}/customer/${customerId}/appointments`, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById('remindersList');
      if (!list) return;
      if (Array.isArray(data)) {
        const reminders = data.filter(appointment => appointment.nextServiceDate || appointment.nextServiceKm);
        if (reminders.length > 0) {
          list.innerHTML =
            '<ul class="list-ul">' +
            reminders
              .map(appointment => {
                let reminderText = '';
                if (appointment.nextServiceDate) {
                  reminderText = `${appointment.nextServiceType} on ${appointment.nextServiceDate}`;
                } else if (appointment.nextServiceKm) {
                  reminderText = `${appointment.nextServiceType} after ${appointment.nextServiceKm} km`;
                }

                return `<li class="list-item">
                  <div>
                    <div><strong>Car:</strong> ${appointment.car ? appointment.car.model : (appointment.carModel || 'N/A')}</div>
                    <div class="hint"><strong>Next Service:</strong> ${reminderText}</div>
                    <div class="hint">Last Service: ${appointment.serviceType} on ${appointment.appointmentDate}</div>
                  </div>
                  <div><span class="badge badge-info">Reminder</span></div>
                </li>`;
              })
              .join('') +
            '</ul>';
        } else {
          list.innerHTML = `<div class="alert alert-info">No upcoming service reminders.</div>`;
        }
      } else {
        list.innerHTML = `<div class="alert alert-danger">Failed to load reminders</div>`;
      }
    })
    .catch(error => {
      const box = document.getElementById('remindersList');
      if (box) box.innerHTML = `<div class="alert alert-danger">Failed to load reminders: ${error.message}</div>`;
    });
}

