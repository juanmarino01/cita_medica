// Variables globales
let appointments = [];
let editingId = null;
let unsubscribe = null;
let indexCreationAttempted = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Inicializar la aplicación con manejo de errores mejorado
async function initializeApp() {
    try {
        setupEventListeners();
        await loadAppointments();
        hideLoading();
        updateConnectionStatus(true);
    } catch (error) {
        console.error('Error inicializando la app:', error);
        handleFirestoreError(error);
        updateConnectionStatus(false);
    }
}

// Cargar citas desde Firestore con manejo de índices
async function loadAppointments() {
    return new Promise((resolve, reject) => {
        try {
            unsubscribe = db.collection('appointments')
                .orderBy('date', 'asc')
                .orderBy('time', 'asc')
                .onSnapshot(snapshot => {
                    appointments = [];
                    snapshot.forEach(doc => {
                        appointments.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    
                    renderAppointments();
                    updateStats();
                    resolve();
                }, error => {
                    console.error('Error en snapshot:', error);
                    handleFirestoreError(error);
                    reject(error);
                });
        } catch (error) {
            console.error('Error cargando citas:', error);
            handleFirestoreError(error);
            reject(error);
        }
    });
}

// Manejar errores de Firestore específicos
function handleFirestoreError(error) {
    let errorMessage = 'Error de conexión con la base de datos';
    
    if (error.code === 'failed-precondition') {
        errorMessage = `
            <strong>Se requiere índice compuesto</strong><br>
            Firebase necesita crear un índice para optimizar las consultas.<br><br>
            <button class="btn btn-warning btn-sm" onclick="createCompositeIndex()">
                <i class="fas fa-wrench me-1"></i>Crear Índice Automáticamente
            </button>
            <br><br>
            <small>O crea manualmente en Firebase Console: Firestore → Indexes</small>
        `;
    } else if (error.code === 'unavailable') {
        errorMessage = 'Firestore no está disponible. Verifica tu conexión.';
    } else if (error.code === 'permission-denied') {
        errorMessage = 'No tienes permisos para acceder a los datos. Verifica las reglas de seguridad.';
    } else {
        errorMessage = `Error: ${error.message}`;
    }
    
    showAlert(errorMessage, 'danger');
    
    // Mostrar interfaz de respaldo
    showFallbackInterface();
}

// Intentar crear índice compuesto
async function createCompositeIndex() {
    try {
        // Solución temporal: usar ordenamiento simple
        if (unsubscribe) unsubscribe();
        
        unsubscribe = db.collection('appointments')
            .orderBy('date', 'asc')
            .onSnapshot(snapshot => {
                appointments = [];
                snapshot.forEach(doc => {
                    appointments.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                // Ordenar localmente por hora
                appointments.sort((a, b) => {
                    if (a.date === b.date) {
                        return a.time.localeCompare(b.time);
                    }
                    return a.date.localeCompare(b.date);
                });
                
                renderAppointments();
                updateStats();
                showAlert('Usando ordenamiento local temporal. Para mejor rendimiento, crea el índice en Firebase Console.', 'warning');
            });
            
    } catch (error) {
        console.error('Error creando índice:', error);
        showAlert('No se pudo solucionar automáticamente. Por favor crea el índice manualmente.', 'danger');
    }
}

// Mostrar interfaz de respaldo cuando hay errores
function showFallbackInterface() {
    const container = document.getElementById('appointments-list');
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-database"></i>
            <h4>Problema de Conexión con Firebase</h4>
            <p>No se pudieron cargar las citas debido a un error de configuración.</p>
            <div class="mt-3">
                <button class="btn btn-primary me-2" onclick="initializeApp()">
                    <i class="fas fa-redo me-1"></i> Reintentar
                </button>
                <button class="btn btn-outline-secondary" onclick="showManualIndexInstructions()">
                    <i class="fas fa-question-circle me-1"></i> Instrucciones
                </button>
            </div>
        </div>
    `;
}

// Mostrar instrucciones para crear índice manualmente
function showManualIndexInstructions() {
    const instructions = `
        <div class="alert alert-info">
            <h5><i class="fas fa-wrench me-2"></i>Crear Índice Manualmente</h5>
            <ol class="mb-0">
                <li>Ve a <a href="https://console.firebase.google.com" target="_blank">Firebase Console</a></li>
                <li>Selecciona tu proyecto</li>
                <li>Ve a <strong>Firestore Database</strong> → <strong>Indexes</strong></li>
                <li>Haz clic en <strong>"Create Index"</strong></li>
                <li>Configura:
                    <ul>
                        <li><strong>Collection ID:</strong> appointments</li>
                        <li><strong>Field 1:</strong> date (Ascending)</li>
                        <li><strong>Field 2:</strong> time (Ascending)</li>
                    </ul>
                </li>
                <li>Haz clic en <strong>"Create Index"</strong></li>
                <li>Espera 1-5 minutos a que el índice se cree</li>
            </ol>
        </div>
    `;
    
    showAlert(instructions, 'info', 0); // 0 = no auto-close
}

// El resto de las funciones permanecen igual...
// [Mantener las funciones: setupEventListeners, handleFormSubmit, createAppointment, etc.]
