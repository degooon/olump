<?php
/**
 * Шаблон отдельной страницы — политики конфиденциальности и подобных.
 *
 * Сайт одностраничный, но документы, которые требует закон, обязаны
 * открываться по своему адресу: страница, до которой нельзя дойти,
 * обязанность не закрывает. Поэтому здесь не переадресация, как в index.php,
 * а настоящий вывод содержимого.
 *
 * Шапку с каталогом и корзиной не повторяем: на странице с текстом закона
 * они лишние, достаточно ссылки обратно на сайт.
 *
 * @package Olimp
 */

defined( 'ABSPATH' ) || exit;

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="<?php echo esc_url( olimp_asset( 'favicon.svg' ) ); ?>" type="image/svg+xml">
<meta name="theme-color" content="#B14E2B">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<main class="doc">
	<div class="container">
		<a class="doc__back" href="<?php echo esc_url( home_url( '/' ) ); ?>">← Мебельный склад «Олимп»</a>

		<?php while ( have_posts() ) : ?>
			<?php the_post(); ?>
			<h1 class="doc__title"><?php the_title(); ?></h1>
			<div class="doc__body"><?php the_content(); ?></div>
		<?php endwhile; ?>
	</div>
</main>

<?php wp_footer(); ?>
</body>
</html>
