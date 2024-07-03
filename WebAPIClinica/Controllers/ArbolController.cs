using System.Collections.Generic;
using System.Web.Http;
using CapaDatos;
using Capanegocios;

namespace TuProyecto.Controllers
{
    [RoutePrefix("api/arbol")]
    public class ArbolController : ApiController
    {
        private static ArbolBinario arbol = new ArbolBinario();

        // POST api/arbol/agregar
        [HttpPost]
        [Route("agregar")]
        public IHttpActionResult Agregar([FromBody] Paciente paciente)
        {
            arbol.Agregar(paciente);
            return Ok();
        }

        // GET api/arbol/mostrar
        [HttpGet]
        [Route("mostrar")]
        public IHttpActionResult Mostrar()
        {
            return Ok(arbol.Mostrar());
        }

        // GET api/arbol/buscar/{numSocial}
        [HttpGet]
        [Route("buscar/{numSocial}")]
        public IHttpActionResult Buscar(string numSocial)
        {
            Paciente paciente = arbol.Buscar(numSocial);
            if (paciente == null)
            {
                return NotFound();
            }
            return Ok(paciente);
        }

        // DELETE api/arbol/eliminar/{numSocial}
        [HttpDelete]
        [Route("eliminar/{numSocial}")]
        public IHttpActionResult Eliminar(string numSocial)
        {
            arbol.Eliminar(numSocial);
            return Ok();
        }

        // POST api/arbol/balancear
        [HttpPost]
        [Route("balancear")]
        public IHttpActionResult Balancear()
        {
            arbol.Balancear();
            return Ok();
        }
    }
}
