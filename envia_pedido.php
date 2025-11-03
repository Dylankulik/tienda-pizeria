<?php

// 1. Recoger los datos del cliente enviados por el formulario (método GET)
$numeroLocal = isset($_GET['numero_local']) ? htmlspecialchars($_GET['numero_local']) : '5491100000000'; // Fallback
$nombre = isset($_GET['nombre']) ? htmlspecialchars($_GET['nombre']) : '';
$telefono = isset($_GET['telefono']) ? htmlspecialchars($_GET['telefono']) : '';
$direccion = isset($_GET['direccion']) ? htmlspecialchars($_GET['direccion']) : '';
$metodo_pago = isset($_GET['metodo_pago']) ? htmlspecialchars($_GET['metodo_pago']) : '';
$detalle = isset($_GET['detalle']) ? htmlspecialchars($_GET['detalle']) : '';
$total_final = isset($_GET['total_final']) ? htmlspecialchars($_GET['total_final']) : '';

// 🚨 RECOGER EL CAMPO DE NOTAS
$notas = isset($_GET['notas']) ? htmlspecialchars($_GET['notas']) : '';


// 2. Construir el mensaje de WhatsApp
$mensaje = 
    "🔔 *¡NUEVO PEDIDO WEB!* 🔔\n\n" .
    "--- *DATOS DEL CLIENTE* ---\n" .
    "*Local Seleccionado:* " . ucfirst($_GET['local-selector']) . "\n" .
    "*Nombre:* " . $nombre . "\n" .
    "*Teléfono:* " . $telefono . "\n" .
    "*Dirección:* " . $direccion . "\n" .
    "*Método de Pago:* " . $metodo_pago . "\n" .
    // 🚨 INCLUIR LAS NOTAS EN EL MENSAJE FINAL
    "*Notas/Comentarios:* " . ($notas ? $notas : 'Sin notas adicionales') . "\n\n" . 
    "--- *DETALLE DEL PEDIDO* ---\n" .
    $detalle . "\n" .
    "*TOTAL A PAGAR:* $" . $total_final . "\n\n" .
    "¡Por favor, confirma el pedido!";

// 3. Codificar el mensaje para la URL
$mensajeCodificado = urlencode($mensaje);

// 4. Crear la URL final de WhatsApp
$urlWhatsApp = "https://wa.me/{$numeroLocal}?text={$mensajeCodificado}";

// 5. Redirigir al cliente a WhatsApp
header("Location: {$urlWhatsApp}");
exit();

?>