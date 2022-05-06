<?php

namespace Classes\Controllers;

use Classes\Repositories\ScheduleRepository;

class ScheduleController extends Controller {

    public function getScheduleForGroup() {

        $this->validateFields([
            'day',
            'group'
        ]);

        $repository = new ScheduleRepository();
        $resultSchedule = $repository->getScheduleForGroup($this->data);
        $resultLastUpdate = $repository->getLastUpdate($this->data);

        $response = [
            "day" => $this->data->day,
            "group" => $this->data->group,
            "schedule" => $resultSchedule,
            "last_update" => $resultLastUpdate["last_update"]
        ];

        echo json_encode([
            'code'      => '200',
            'response'  => $response
        ]);

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

    private function responseOk() : void {
        echo json_encode([
            'code'      => '200',
            'response'  => 'ok'
        ]);
    }

}