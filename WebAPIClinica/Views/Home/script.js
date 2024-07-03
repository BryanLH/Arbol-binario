// Funci�n para agregar un paciente
document.getElementById('formAgregar').addEventListener('submit', async function (event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const numSocial = document.getElementById('numSocial').value;
    const edad = parseInt(document.getElementById('edad').value);

    // Validar que la edad sea un n�mero positivo
    if (isNaN(edad) || edad < 0) {
        document.getElementById('error-container').innerText = 'La edad debe ser un n�mero positivo';
        return;
    }

    try {
        // Verificar si el paciente ya existe antes de agregarlo
        await axios.get(`/api/arbol/buscar/${numSocial}`);
        document.getElementById('error-container').innerText = 'Paciente con este n�mero de seguro social ya existe';
    } catch (error) {
        // Si no existe, continuar con la adici�n del paciente
        try {
            await axios.post('/api/arbol/agregar', { Nombre: nombre, NumSocial: numSocial, Edad: edad });
            alert('Paciente agregado');
            document.getElementById('formAgregar').reset();
            mostrarArbol(); // Mostrar el �rbol despu�s de agregar un paciente
        } catch (error) {
            console.error('Error al agregar paciente:', error);
            document.getElementById('error-container').innerText = 'Error al agregar paciente: ' + error.message;
        }
    }
});

// Funci�n para buscar un paciente
document.getElementById('formBuscar').addEventListener('submit', async function (event) {
    event.preventDefault();
    const numSocial = document.getElementById('numSocialBuscar').value;

    try {
        const response = await axios.get(`/api/arbol/buscar/${numSocial}`);
        const paciente = response.data;
        const pacienteContainer = document.getElementById('paciente-container');
        pacienteContainer.innerHTML = `<p>${paciente.NumSocial} - ${paciente.Nombre} - ${paciente.Edad}</p>`;
        document.getElementById('error-container').innerText = '';
    } catch (error) {
        console.error('Error al buscar paciente:', error);
        document.getElementById('error-container').innerText = 'Paciente no encontrado: ' + error.message;
        document.getElementById('paciente-container').innerHTML = '';
    }
});

// Funci�n para eliminar un paciente
document.getElementById('formEliminar').addEventListener('submit', async function (event) {
    event.preventDefault();
    const numSocial = document.getElementById('numSocialEliminar').value;

    try {
        await axios.delete(`/api/arbol/eliminar/${numSocial}`);
        alert('Paciente eliminado');
        document.getElementById('formEliminar').reset();
        mostrarArbol(); // Mostrar el �rbol despu�s de eliminar un paciente
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        document.getElementById('error-container').innerText = 'Error al eliminar paciente: ' + error.message;
    }
});

// Funci�n para balancear el �rbol
async function balancearArbol() {
    try {
        await axios.post('/api/arbol/balancear');
        alert('�rbol balanceado');
        mostrarArbol(); // Mostrar el �rbol despu�s de balancearlo
    } catch (error) {
        console.error('Error al balancear el �rbol:', error);
        document.getElementById('error-container').innerText = 'Error al balancear el �rbol: ' + error.message;
    }
}

// Funci�n para mostrar el �rbol
async function mostrarArbol() {
    try {
        const response = await axios.get('/api/arbol/mostrar');
        const pacientes = response.data;
        const arbolContainer = document.getElementById('arbol-container');
        arbolContainer.innerHTML = ''; // Limpiar el contenido del contenedor del �rbol antes de agregar el canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 800;  // Ajusta el tama�o del canvas seg�n sea necesario
        canvas.height = 600;
        arbolContainer.appendChild(canvas);

        // Definir el nodo ra�z del �rbol
        let raiz = construirArbolDesdePacientes(pacientes);

        // Limpiar el canvas antes de dibujar
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Funci�n para dibujar un nodo en el canvas
        function dibujarNodo(nodo, x, y, nivel, offsetX) {
            if (nodo !== null) {
                // Dibujar c�rculo para el nodo
                let circulo = new Circulo(x, y, 20, 'blue');
                circulo.draw(context);

                // Dibujar valor del nodo dentro del c�rculo
                context.fillStyle = 'white';
                context.font = '14px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(nodo.Data.NumSocial, x, y);

                // Dibujar las l�neas que conectan el nodo con sus hijos
                if (nodo.Izquierdo !== null) {
                    context.beginPath();
                    context.moveTo(x, y + 20);  // L�nea desde el nodo actual
                    context.lineTo(x - offsetX, y + 60);  // L�nea hasta el nodo izquierdo
                    context.stroke();
                    dibujarNodo(nodo.Izquierdo, x - offsetX, y + 60, nivel + 1, offsetX / 2);
                }
                if (nodo.Derecho !== null) {
                    context.beginPath();
                    context.moveTo(x, y + 20);  // L�nea desde el nodo actual
                    context.lineTo(x + offsetX, y + 60);  // L�nea hasta el nodo derecho
                    context.stroke();
                    dibujarNodo(nodo.Derecho, x + offsetX, y + 60, nivel + 1, offsetX / 2);
                }
            }
        }

        // Crear una clase para dibujar c�rculos
        class Circulo {
            constructor(x, y, radio, color) {
                this.x = x;
                this.y = y;
                this.radio = radio;
                this.color = color;
            }

            draw(context) {
                context.beginPath();
                context.arc(this.x, this.y, this.radio, 0, Math.PI * 2, false);
                context.fillStyle = this.color;
                context.fill();
                context.stroke();
            }
        }

        // Llamar a la funci�n para iniciar el dibujo del �rbol
        dibujarNodo(raiz, canvas.width / 2, 30, 0, canvas.width / 4);
    } catch (error) {
        console.error('Error al mostrar el �rbol:', error);
        document.getElementById('error-container').innerText = 'Error al mostrar el �rbol: ' + error.message;
    }
}

// Funci�n para construir el �rbol binario a partir de una lista de pacientes
function construirArbolDesdePacientes(pacientes) {
    const arbol = new ArbolBinario();
    pacientes.forEach(paciente => arbol.Agregar(paciente));
    return arbol.Raiz;
}

// Asignar el evento al bot�n para mostrar el �rbol
document.querySelector('button[onclick="mostrarArbol()"]').addEventListener('click', mostrarArbol);

// Asignar el evento al bot�n para balancear el �rbol
document.querySelector('button[onclick="balancearArbol()"]').addEventListener('click', balancearArbol);
