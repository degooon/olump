<?php
/**
 * Запасной шаблон. WordPress требует его наличия, но сайт одностраничный:
 * всё рисует front-page.php. Если сюда всё же попали — уводим на главную.
 *
 * @package Olimp
 */

defined( 'ABSPATH' ) || exit;

wp_safe_redirect( home_url( '/' ) );
exit;
