<!doctype html>
<html>
<head>
    <?= $template->meta() ?>
    <?= $template->styles() ?>
    <?= $template->scripts() ?>

    <title>Template Tool</title>

</head>
<body <?= $template->body_attributes() ?>>

<?= $template->content_before() ?>


<div class="webdev-project">
    <!-- own content here -->
    <div class="container">
        <h1>Test Heading</h1>
    </div>
</div>

<?= $template->content() ?>

<?= $template->content_after() ?>

</body>
</html>
