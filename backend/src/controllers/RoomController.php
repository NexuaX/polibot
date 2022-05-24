<?php

namespace Classes\Controllers;

use Classes\Repositories\RoomRepository;

class RoomController extends Controller {

    public function getRoomData() {

        $validation = $this->validator->validateFields([
            'name'
        ],$this->data);

        if(!$validation)
            $this->response->responseError("Invalid request fields");
            
        $repository = new RoomRepository();
        $response = $repository->getRoomFromDB($this->data);
        if(!$response)
            $this->response->responseError("Room not found");

        $this->response->responseOk($response);
    }
}