<?php
require_once './backend/vendor/autoload.php';
require_once './backend/Router.php';
$path = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($path, PHP_URL_PATH);

Router::post('setupServer', 'SetupComandController');
Router::post('setupGroups', 'SetupComandController');
Router::post('getReactionMessage', 'SetupComandController');
Router::post('getReactionRole', 'SetupComandController');
Router::post('getReminders', 'ReminderController');
Router::post('setReminder', 'ReminderController');

Router::run($path);

