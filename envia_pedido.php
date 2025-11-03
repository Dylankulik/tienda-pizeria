<?php

// 1. Recibir los datos del formulario (vía GET)
$local = $_GET['local-selector'] ?? 'Local No Especificado';
$numeroLocal = $_GET['numero_local'] ?? '5491125159506'; // Número de fallback
$nombre = $_GET['nombre'] ?? 'Cliente Desconocido';
$telefono = $_GET['telefono'] ?? 'No Disponible';
$direccion = $_GET['direccion'] ?? 'Sin Dirección';
$metodoPago = $_GET['metodo_pago'] ?? 'Sin Especificar';
$detallePedido = $_GET['detalle'] ?? 'No se pudo obtener el detalle del pedido.';
$totalFinal = $_GET['total_final'] ?? '$0';

// 2. Construir el mensaje de texto
$mensaje = "¡Hola! 🍕 Tengo un pedido para " . $local . ".\n";
$mensaje .= "Nombre: " . $nombre . "\n";
$mensaje .= "Teléfono: " . $telefono . "\n";
$mensaje .= "Dirección: " . $direccion . "\n";
$mensaje .= "Método de Pago: " . $metodoPago . "\n";
$mensaje .= "\n---\nDETALLE DEL PEDIDO:\n" . $detallePedido . "\n";
$mensaje .= "---\nTOTAL FINAL: $" . $totalFinal . "\n";

// 3. Codificar el mensaje para la URL
$mensajeCodificado = urlencode($mensaje);

// 4. Generar el enlace de WhatsApp
$urlWhatsApp = "https://api.whatsapp.com/send?phone=" . $numeroLocal . "&text=" . $mensajeCodificado;

// 5. Redirigir al usuario al enlace de WhatsApp
header("Location: " . $urlWhatsApp);
exit;

?>