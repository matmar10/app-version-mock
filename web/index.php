<?php

require_once __DIR__.'/../vendor/autoload.php';

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Yaml\Yaml as YamlParser;

$app = new Application();

$versionsPersistenceFilename = __DIR__.'/../db/versions.yml';
$templateFilename = __DIR__ . '/app.html';

$versionsData = YamlParser::parse(file_get_contents($versionsPersistenceFilename));

$app['debug'] = true;

$app->get('/', function() use ($templateFilename) {
    $response = new Response();
    $response->setStatusCode(200);
    $response->headers->add(array(
        'Content-Type' => 'text/html',
    ));
    $response->setContent(file_get_contents($templateFilename));
    return $response;
});

$app->put('/api/version/{platform}/{versionSpecifier}', function(Request $request, $platform, $versionSpecifier) use ($versionsPersistenceFilename) {

    $versionData = YamlParser::parse(file_get_contents($versionsPersistenceFilename));

    $versionData[$platform][$versionSpecifier] = $request->getContent();

    file_put_contents($versionsPersistenceFilename, YamlParser::dump($versionData));

    $response = new Response();
    $response->setStatusCode(200);
    $response->headers->add(array(
        'Content-Type' => 'application/json',
    ));
    $response->setContent(json_encode($versionData));
    return $response;
});

$app->get('/api/version', function() use ($versionsData) {
    $response = new Response();
    $response->setStatusCode(200);
    $response->headers->add(array(
        'Content-Type' => 'application/json',
    ));
    $response->setContent(json_encode($versionsData));
    return $response;
});


$app->run();



