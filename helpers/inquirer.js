const { white } = require('colors');
const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?'.white,
        choices: [
            {
                value: '1',
                name: `${'1.'.blue} Crear reserva`
            },
            {
                value: '2',
                name: `${'2.'.blue} Ver lista de reservas`
            },
            {
                value: '3',
                name: `${'3.'.blue} Registrar ingeso`
            },
            {
                value: '4',
                name: `${'4.'.blue} Registrar salida`
            },
            {
                value: '5',
                name: `${'5.'.blue} Gestionar servicios`
            },
            {
                value: '0',
                name: `${'0.'.blue} Salir`
            },
        ]
    }
];
const inquirerMenu = async () => {
    console.clear();
    console.log('=========================='.white);
    console.log('  Recepcion del Hotel'.blue);
    console.log('==========================\n'.white);

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
}
const pausa = async () => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'enter'.red} para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
}

const leerInput = async (message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;
}
const crearReserva = async (reservas) => {
    console.log('Crear una nueva reserva:\n'.blue);

    const nombre = await leerInput('Nombre del huésped:'.white);
    const habitacion = await leerInput('Número de habitación:'.white);

    // Verificar si ya existe una reserva activa en la habitación
    const reservaExistente = reservas.find(r => r.habitacion === habitacion && !r.checkSalida);

    if (reservaExistente) {
        console.log(`\nYa existe una reserva activa en la habitación ${habitacion}. No se puede crear una nueva reserva.`.red);
    } else {
        const fechaInicio = await leerInput('Fecha de inicio (YYYY-MM-DD):'.white);
        const fechaFin = await leerInput('Fecha de fin (YYYY-MM-DD):'.white);

        const reserva = {
            nombre,
            habitacion,
            fechaInicio,
            fechaFin,
            checkIn: false,
            checkOut: false,
        };


        reservas.push(reserva);

        console.log('\nReserva creada exitosamente.'.magenta);
    }

    await pausa();
}

const verListaReservas = (reservas) => {
    console.log('Lista de Reservas:\n'.blue);
    reservas.forEach((reserva, index) => {
        const estado = reserva.salida ? 'Salida realizado' : reserva.entrada ? 'Ingreso realizada' : 'Pendiente';
        const servicios = reserva.servicios ? Object.keys(reserva.servicios).filter(servicio => reserva.servicios[servicio]).join(', ') : 'Ninguno';
        console.log(`${(index + 1 + '.').white} Nombre: ${reserva.nombre}, Habitación: ${reserva.habitacion}, Inicio: ${reserva.fechaInicio}, Fin: ${reserva.fechaFin}, Estado: ${estado}, Servicios: ${servicios}`);
    });
    console.log();
}
const registrarIngreso = async (reservas) => {
    console.log('Registrar Ingreso:\n'.white);
    const habitacion = await leerInput('Número de habitación para el ingreso:'.white);
    const reserva = reservas.find(r => r.habitacion === habitacion);

    if (reserva) {
        if (!reserva.Ingreso) {
            reserva.Ingreso = true;
            console.log('\nIngreso registrado exitosamente.'.magenta);
        } else {
            console.log('\nEl ingreso ya ha sido registrado anteriormente.'.magenta);
        }
    } else {
        console.log('\nHabitación no encontrada o ya ha sido registrada.'.magenta);
    }

    await pausa();
}

const registrarSalida = async (reservas) => {
    console.log('Registrar Salida:\n'.green);
    const habitacion = await leerInput('Número de habitación para el salida:');
    const reservaIndex = reservas.findIndex(r => r.habitacion === habitacion);

    if (reservaIndex !== -1) {
        const reserva = reservas[reservaIndex];

        if (reserva.Ingreso && !reserva.checkOut) {
            reserva.checkOut = true;
            console.log('\nCheck-out registrado exitosamente.'.green);
            console.log('Registro eliminado después del check-out.'.green);

            // Elimina la reserva del array
            reservas.splice(reservaIndex, 1);
        } else if (!reserva.checkIn) {
            console.log('\nPrimero debe realizar el check-in para esta habitación.'.magenta);
        } else if (reserva.checkOut) {
            console.log('\nEl check-out ya ha sido registrado anteriormente.'.magenta);
        }
    } else {
        console.log('\nHabitación no encontrada o no ha sido registrada.'.magenta);
    }

    await pausa();
}

const verHabitacionesDisponibles = (reservas) => {
    console.log('Habitaciones Disponibles:\n'.green);

    const habitacionesOcupadas = reservas.map(r => r.habitacion);

    // Supongamos que tienes un total de 100 habitaciones
    const totalHabitaciones = 10;

    for (let i = 1; i <= totalHabitaciones; i++) {
        if (!habitacionesOcupadas.includes(i.toString())) {
            console.log(`${i.toString().green} Disponible`);
        }
    }
}

const gestionarServiciosParaHabitacion = async (reservas) => {
    console.log('Gestionar Servicios para una Habitación Registrada:\n'.green);
    const habitacion = await leerInput('Número de habitación para gestionar servicios:');
    const reserva = reservas.find(r => r.habitacion === habitacion);

    if (reserva) {
        console.log(`Usted está gestionando servicios para la habitación ${habitacion}:\n`.green);

        const servicios = {
            turco: reserva.servicios && reserva.servicios.turco ? reserva.servicios.turco : false,
            piscina: reserva.servicios && reserva.servicios.piscina ? reserva.servicios.piscina : false,
            tenis: reserva.servicios && reserva.servicios.tenis ? reserva.servicios.tenis : false,
            gimnasio: reserva.servicios && reserva.servicios.gimnasio ? reserva.servicios.gimnasio : false
        };

        console.log(`Turco: ${servicios.turco ? 'Habilitado' : 'Deshabilitado'}`);
        console.log(`Piscina: ${servicios.piscina ? 'Habilitado' : 'Deshabilitado'}`);
        console.log(`Tenis: ${servicios.tenis ? 'Habilitado' : 'Deshabilitado'}`);
        console.log(`Gimnasio: ${servicios.gimnasio ? 'Habilitado' : 'Deshabilitado'}`);

        const seleccion = await leerInput('¿Desea habilitar o deshabilitar un servicio? (Sí/No):');

        if (seleccion.toLowerCase() === 'si' || seleccion.toLowerCase() === 'sí') {
            const servicio = await leerInput('Elija el servicio a habilitar/deshabilitar (turco/piscina/tenis/gimnasio):');
            if (servicio in servicios) {
                servicios[servicio] = !servicios[servicio];
                console.log(`El servicio ${servicio} ha sido ${servicios[servicio] ? 'habilitado' : 'deshabilitado'}.`);
                reserva.servicios = servicios;
            } else {
                console.log('Servicio no válido.');
            }
        } else {
            console.log('Operación de gestión de servicios cancelada.');
        }
    } else {
        console.log('\nHabitación no encontrada o no ha sido registrada.'.magenta);
    }

    await pausa();
}


module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    crearReserva,
    verListaReservas,
    registrarIngreso,
    registrarSalida,
    verHabitacionesDisponibles,
    gestionarServiciosParaHabitacion
};