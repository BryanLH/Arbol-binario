using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class Paciente
    {
        public string NumSocial { get; set; }
        public string Nombre { get; set; }
        public int Edad { get; set; }

        public string MostrarDatos()
        {
            return $"N° social: {NumSocial}, Nombre: {Nombre}, Edad: {Edad}";
        }
    }
}
