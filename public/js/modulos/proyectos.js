import Swal from 'sweetalert2';
import axios from 'axios';


// id="eliminar-proyecto"

const btnElimininar = document.querySelector('#eliminar-proyecto');

if (btnElimininar) {
    btnElimininar.addEventListener('click', ({ target }) => {
        const urlProyecto = target.dataset.proyectoUrl;
        console.log(urlProyecto);

        Swal.fire({
            title: 'Deseas borrar este proyecto?',
            text: "Un proyecto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'SI, Borrar!',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

                // Enviar peticion a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                axios.delete(url, { params: { urlProyecto } })
                    .then(function (respuesta) {
                        console.log(respuesta);
                        // return;
                        Swal.fire(
                            'Eliminado!',
                            respuesta.data,
                            'success'
                        );

                        // Redirect at Home
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 2000);
                    })
                    .catch(() => {
                        Swal.fire({
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el Proyecto'
                        })
                    });
            }
        })
    })
}
export default btnElimininar;