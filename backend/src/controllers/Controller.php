<?php

namespace Classes\Controllers;

class Controller
{
    private $method;
    protected $data;

    public function __construct()
    {
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
