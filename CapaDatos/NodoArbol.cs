using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CapaDatos
{
    public class NodoArbol
    {
        public Paciente Data { get; set; }
        public NodoArbol Izquierdo { get; set; }
        public NodoArbol Derecho { get; set; }

        public NodoArbol(Paciente data)
        {
            Data = data;
            Izquierdo = null;
            Derecho = null;
        }
    }
}
