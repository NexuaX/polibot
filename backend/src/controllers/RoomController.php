<?php

namespace Classes\Controllers;

use Classes\Repositories\RoomRepository;

class RoomController extends Controller {

    public function getRoomData() {

        $this->validateFields([
            'name'
        ]);

        $repository = new RoomRepository();
        $resultRoomInfo = $repository->getRoomFromDB($this->data);
        if(!$resultRoomInfo){
            $this->responseError("Room not found");
        }
        else{
            $response = [
                "building" => $resultRoomInfo["building"],
                "name" => $resultRoomInfo["name"],
                "floor" => $resultRoomInfo["floor"],
                "description" => $resultRoomInfo["description"],
                "image_url" => $resultRoomInfo["image_url"]
            ];

            echo json_encode([
                'code'      => '200',
                'response'  => $response
            ]);
        }
    }

    private function validateFields(array $fields){
        foreach($fields as $fieldname){
            if(!isset($this->data->$fieldname)){
                $this->responseError('Invalid request fields');
                die();
            }
        }
    }

    private function responseError(string $error) : void {
        echo json_encode([
            'code'      => '400',
            'response'  => $error
        ]);
    }
}