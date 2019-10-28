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
    $router->respond('GET', '/list?/[i:page]?', function ($request) use ($app) {
        $app->contactsList($request->page);
    });

    // Returns single contact data
    $router->respond('GET', '/contact/[i:id]', function ($request) use ($app) {
        $app->get($request->id);
    });

    // Create new contact
    $router->respond('POST', '/contact', function ($request) use ($app) {
        $params = json_decode(file_get_contents("php://input"));
        $app->create($params);
    });

    // Delete single contact data
    $router->respond('DELETE', '/contact/[i:id]', function ($request) use ($app) {
        $app->remove($request->id);
    });

    // Edit contact data
    $router->respond('POST', '/contact/[i:id]', function ($request) use ($app) {
        $params = json_decode(file_get_contents("php://input"));
        $app->edit($request->id,$params);
    });

    // Search contact by value
    $router->respond('GET', '/search', function ($request) use ($app) {
        $params = array('type' => $request->type, 'value' => $request->value);
        $app->search($params,$request->page);
    });

    $router->dispatch();
