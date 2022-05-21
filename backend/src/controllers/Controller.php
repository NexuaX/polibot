<?php

namespace Classes\Controllers;

use Classes\Controllers\Helpers\Response;
use Classes\Controllers\Helpers\Validator;

class Controller
{
    private $method;
    protected $data;
    protected $validator;
    protected $response;

    public function __construct()
    {
        $this->validator = new Validator();
        $this->response = new Response();
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->getData();
    }

    protected function isPost(): bool
    {
        return $this->method == 'POST';
    }

    protected function isGet(): bool
    {
        return $this->method == 'GET';
    }

    private function getData() : void {
        $this->data = json_decode(file_get_contents('php://input'));
    }

}
