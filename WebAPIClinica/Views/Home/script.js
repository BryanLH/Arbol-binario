// Función para agregar un paciente
document.getElementById('formAgregar').addEventListener('submit', async function (event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const numSocial = document.getElementById('numSocial').value;
    const edad = parseInt(document.getElementById('edad').value);

    // Validar que la edad sea un número positivo
    if (isNaN(edad) || edad < 0) {
        document.getElementById('error-container').innerText = 'La edad debe ser un número positivo';
        return;
    }

    try {
        // Verificar si el paciente ya existe antes de agregarlo
        await axios.get(`/api/arbol/buscar/${numSocial}`);
        document.getElementById('error-container').innerText = 'Paciente con este número de seguro social ya existe';
    } catch (error) {
        // Si no existe, continuar con la adición del paciente
        try {
            await axios.post('/api/arbol/agregar', { Nombre: nombre, NumSocial: numSocial, Edad: edad });
            alert('Paciente agregado');
            document.getElementById('formAgregar').reset();
            mostrarArbol(); // Mostrar el árbol después de agregar un paciente
        } catch (error) {
            console.error('Error al agregar paciente:', error);
            document.getElementById('error-container').innerText = 'Error al agregar paciente: ' + error.message;
        }
    }
});

// Función para buscar un paciente
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

// Función para eliminar un paciente
document.getElementById('formEliminar').addEventListener('submit', async function (event) {
    event.preventDefault();
    const numSocial = document.getElementById('numSocialEliminar').value;

    try {
        await axios.delete(`/api/arbol/eliminar/${numSocial}`);
        alert('Paciente eliminado');
        document.getElementById('formEliminar').reset();
        mostrarArbol(); // Mostrar el árbol después de eliminar un paciente
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        document.getElementById('error-container').innerText = 'Error al eliminar paciente: ' + error.message;
    }
});

// Función para balancear el árbol
async function balancearArbol() {
    try {
        await axios.post('/api/arbol/balancear');
        alert('Árbol balanceado');
        mostrarArbol(); // Mostrar el árbol después de balancearlo
    } catch (error) {
        console.error('Error al balancear el árbol:', error);
        document.getElementById('error-container').innerText = 'Error al balancear el árbol: ' + error.message;
    }
}

// Función para mostrar el árbol
async function mostrarArbol() {
    try {
        const response = await axios.get('/api/arbol/mostrar');
        const pacientes = response.data;
        const arbolContainer = document.getElementById('arbol-container');
        arbolContainer.innerHTML = ''; // Limpiar el contenido del contenedor del árbol antes de agregar el canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 800;  // Ajusta el tamaño del canvas según sea necesario
        canvas.height = 600;
        arbolContainer.appendChild(canvas);

        // Definir el nodo raíz del árbol
        let raiz = construirArbolDesdePacientes(pacientes);

        // Limpiar el canvas antes de dibujar
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Función para dibujar un nodo en el canvas
        function dibujarNodo(nodo, x, y, nivel, offsetX) {
            if (nodo !== null) {
                // Dibujar círculo para el nodo
                let circulo = new Circulo(x, y, 20, 'blue');
                circulo.draw(context);

                // Dibujar valor del nodo dentro del círculo
                context.fillStyle = 'white';
                context.font = '14px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(nodo.Data.NumSocial, x, y);

                // Dibujar las líneas que conectan el nodo con sus hijos
                if (nodo.Izquierdo !== null) {
                    context.beginPath();
                    context.moveTo(x, y + 20);  // Línea desde el nodo actual
                    context.lineTo(x - offsetX, y + 60);  // Línea hasta el nodo izquierdo
                    context.stroke();
                    dibujarNodo(nodo.Izquierdo, x - offsetX, y + 60, nivel + 1, offsetX / 2);
                }
                if (nodo.Derecho !== null) {
                    context.beginPath();
                    context.moveTo(x, y + 20);  // Línea desde el nodo actual
                    context.lineTo(x + offsetX, y + 60);  // Línea hasta el nodo derecho
                    context.stroke();
                    dibujarNodo(nodo.Derecho, x + offsetX, y + 60, nivel + 1, offsetX / 2);
                }
            }
        }

        // Crear una clase para dibujar círculos
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

        // Llamar a la función para iniciar el dibujo del árbol
        dibujarNodo(raiz, canvas.width / 2, 30, 0, canvas.width / 4);
    } catch (error) {
        console.error('Error al mostrar el árbol:', error);
        document.getElementById('error-container').innerText = 'Error al mostrar el árbol: ' + error.message;
    }
}

// Función para construir el árbol binario a partir de una lista de pacientes
function construirArbolDesdePacientes(pacientes) {
    const arbol = new ArbolBinario();
    pacientes.forEach(paciente => arbol.Agregar(paciente));
    return arbol.Raiz;
}

// Asignar el evento al botón para mostrar el árbol
document.querySelector('button[onclick="mostrarArbol()"]').addEventListener('click', mostrarArbol);

// Asignar el evento al botón para balancear el árbol
document.querySelector('button[onclick="balancearArbol()"]').addEventListener('click', balancearArbol);
