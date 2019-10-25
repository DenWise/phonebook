<?php

    require_once "../vendor/autoload.php";

    use \App\Phonebook;

    $app = new Phonebook();

    /*
     * Routing section
     */

    $router = new \Klein\Klein();

    $router->respond('GET', '/', function () use ($app) {
        $app->view();
    });

    // Returns contact list
    $router->respond('GET', '/list', function () use ($app) {
        $app->numbersList();
    });

    // Returns single contact data
    $router->respond('GET', '/contact/[i:id]', function ($request) use ($app) {
        $app->get($request->id);
    });

    // Create new contact
    $router->respond('POST', '/contact', function ($request) use ($app) {
        $app->create($request->params());
    });

    // Delete single contact data
    $router->respond('DELETE', '/contact/[i:id]', function ($request) use ($app) {
        $app->remove($request->id);
    });

    // Edit contact data
    $router->respond('POST', '/contact/[i:id]', function ($request) use ($app) {
        $app->edit($request->id,$request->params());
    });

    $router->dispatch();
