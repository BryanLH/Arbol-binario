using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Capanegocios;
using CapaDatos;

namespace CapaServicios
{
    public class ArbolServicio
    {
        public void AgregarPaciente(Paciente paciente)
        {
            if (paciente == null)
            {
                throw new ArgumentNullException(nameof(paciente));
            }
            // Implementa la lógica para agregar un paciente
        }

        public IEnumerable<Paciente> MostrarPacientes()
        {
            // Implementa la lógica para mostrar pacientes
            return new List<Paciente>(); // Cambia esto según tu implementación
        }

        public Paciente BuscarPaciente(string numSocial)
        {
            if (string.IsNullOrEmpty(numSocial))
            {
                throw new ArgumentException("Número social no puede ser nulo o vacío.", nameof(numSocial));
            }
            // Implementa la lógica para buscar un paciente
            return null; // Cambia esto según tu implementación
        }

        public bool EliminarPaciente(string numSocial)
        {
            if (string.IsNullOrEmpty(numSocial))
            {
                throw new ArgumentException("Número social no puede ser nulo o vacío.", nameof(numSocial));
            }
            // Implementa la lógica para eliminar un paciente
            return false; // Cambia esto según tu implementación
        }

        public void BalancearArbol()
        {
            // Implementa la lógica para balancear el árbol
        }
    }

}

