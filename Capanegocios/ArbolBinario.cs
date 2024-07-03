using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CapaDatos;

namespace Capanegocios
{
    public class ArbolBinario
    {
        public NodoArbol Raiz { get; set; }

        public void Agregar(Paciente data)
        {
            NodoArbol nuevoNodo = new NodoArbol(data);
            if (Raiz == null)
            {
                Raiz = nuevoNodo;
            }
            else
            {
                AgregarRecursivo(Raiz, nuevoNodo);
            }
        }

        private void AgregarRecursivo(NodoArbol actual, NodoArbol nuevoNodo)
        {
            if (string.Compare(nuevoNodo.Data.NumSocial, actual.Data.NumSocial) < 0)
            {
                if (actual.Izquierdo == null)
                {
                    actual.Izquierdo = nuevoNodo;
                }
                else
                {
                    AgregarRecursivo(actual.Izquierdo, nuevoNodo);
                }
            }
            else
            {
                if (actual.Derecho == null)
                {
                    actual.Derecho = nuevoNodo;
                }
                else
                {
                    AgregarRecursivo(actual.Derecho, nuevoNodo);
                }
            }
        }

        public Paciente Buscar(string numSocial)
        {
            return BuscarRecursivo(Raiz, numSocial);
        }

        private Paciente BuscarRecursivo(NodoArbol actual, string numSocial)
        {
            if (actual == null)
            {
                return null;
            }
            if (actual.Data.NumSocial == numSocial)
            {
                return actual.Data;
            }
            if (string.Compare(numSocial, actual.Data.NumSocial) < 0)
            {
                return BuscarRecursivo(actual.Izquierdo, numSocial);
            }
            else
            {
                return BuscarRecursivo(actual.Derecho, numSocial);
            }
        }

        public void Eliminar(string numSocial)
        {
            Raiz = EliminarRecursivo(Raiz, numSocial);
        }

        private NodoArbol EliminarRecursivo(NodoArbol raiz, string numSocial)
        {
            if (raiz == null) return raiz;

            if (string.Compare(numSocial, raiz.Data.NumSocial) < 0)
            {
                raiz.Izquierdo = EliminarRecursivo(raiz.Izquierdo, numSocial);
            }
            else if (string.Compare(numSocial, raiz.Data.NumSocial) > 0)
            {
                raiz.Derecho = EliminarRecursivo(raiz.Derecho, numSocial);
            }
            else
            {
                if (raiz.Izquierdo == null)
                {
                    return raiz.Derecho;
                }
                else if (raiz.Derecho == null)
                {
                    return raiz.Izquierdo;
                }

                raiz.Data = MinValor(raiz.Derecho);
                raiz.Derecho = EliminarRecursivo(raiz.Derecho, raiz.Data.NumSocial);
            }
            return raiz;
        }

        private Paciente MinValor(NodoArbol nodo)
        {
            Paciente min = nodo.Data;
            while (nodo.Izquierdo != null)
            {
                min = nodo.Izquierdo.Data;
                nodo = nodo.Izquierdo;
            }
            return min;
        }

        public List<Paciente> Mostrar()
        {
            List<Paciente> pacientes = new List<Paciente>();
            MostrarRecursivo(Raiz, pacientes);
            return pacientes;
        }

        private void MostrarRecursivo(NodoArbol actual, List<Paciente> pacientes)
        {
            if (actual != null)
            {
                MostrarRecursivo(actual.Izquierdo, pacientes);
                pacientes.Add(actual.Data);
                MostrarRecursivo(actual.Derecho, pacientes);
            }
        }

        public void Balancear()
        {
            List<Paciente> pacientes = Mostrar();
            Raiz = BalancearRecursivo(pacientes, 0, pacientes.Count - 1);
        }

        private NodoArbol BalancearRecursivo(List<Paciente> pacientes, int inicio, int fin)
        {
            if (inicio > fin)
            {
                return null;
            }
            int medio = (inicio + fin) / 2;
            NodoArbol nodo = new NodoArbol(pacientes[medio]);
            nodo.Izquierdo = BalancearRecursivo(pacientes, inicio, medio - 1);
            nodo.Derecho = BalancearRecursivo(pacientes, medio + 1, fin);
            return nodo;
        }
    }
}
