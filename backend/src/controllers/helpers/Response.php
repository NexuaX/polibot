<?php

    namespace Classes\Controllers\Helpers;

    class Response {

        public function responseOk(array $data = null){
            echo json_encode([
                'code'      => '200',
                'response'  => $data ?: 'ok'
            ]);
            die();
        }

        public function responseError(string $error){
            echo json_encode([
                'code'      => '400',
                'response'  => $error
            ]);
            die();
        }

    }