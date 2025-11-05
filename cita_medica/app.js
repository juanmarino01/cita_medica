// Aplicación de Citas Médicas con Firebase
// Variables globales
let appointments = [];
let editingId = null;
let unsubscribe = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Inicializar la aplicación
async function initializeApp() {
    try {
        setupEventListeners();
        await loadAppointments();
        hideLoading();
        updateConnectionStatus(true);
    } catch (error) {
        console.error('Error inicializando la app:', error);
        showAlert('Error al conectar con Firebase: ' + error.message, 'danger');
        updateConnectionStatus(false);
    }
}

// Configurar event listeners
function setupEventListeners() {
    const appointmentForm = document.getElementById('appointment-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleFormSubmit);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEdit);
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', filterAppointments);
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterAppointments);
    }
}

// Actualizar estado de conexión
function updateConnectionStatus(connected) {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
        if (connected) {
            statusElement.innerHTML = '<i class="fas fa-circle me-1 firebase-connected"></i>Conectado';
            statusElement.className = 'firebase-connected';
        } else {
            statusElement.innerHTML = '<i class="fas fa-circle me-1 firebase-disconnected"></i>Desconectado';
            statusElement.className = 'firebase-disconnected';
        }
    }
}

// [El resto del código JavaScript se mantiene igual que en la versión anterior]
// [Incluir aquí todas las funciones: loadAppointments, handleFormSubmit, createAppointment, etc.]
