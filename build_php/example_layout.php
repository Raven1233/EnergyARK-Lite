<!doctype html>
<html>

<head style="position: absolute;">
    <?= $template->meta() ?>
    <?= $template->styles() ?>
    <?= $template->scripts() ?>
    <title>Energiebedarfsrechner</title>
    <link href="/dist/main.2f7455c2.css" type="text/css" rel="stylesheet"/>
    <div style="position: relative;
            padding-top: 50px;
            padding-left: 224px;
            z-index: 1000;">
        <a title="Zur Startseite der RPTU" href="https://rptu.de/">
            <img src="/images/RPTU_logo.svg"  height="30" width="122">
        </a>
    </div>
   
</head>
<body <?= $template->body_attributes() ?>>
<?= $template->content_before() ?>


<div class="w-100 page-main-content rptu">
    <!-- own content here -->
    <div class="container-fluid">
        <br/><br/>
        <div id="javascriptExample"></div>
        <script src="/dist/787.ec704a7a.chunk.js" crossorigin></script>
        <script src="/dist/main.d10274ee.js" crossorigin></script>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <br/><br/><br/><br/><br/><br/>
    </div>
</div>

<?= $template->content_after() ?>

</body>


</html>
