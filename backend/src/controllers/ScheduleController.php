<?php

namespace Classes\Controllers;

use Classes\Repositories\ScheduleRepository;

class ScheduleController extends Controller {

    public function getScheduleForGroup() {

        $validation = $this->validator->validateFields([
            'day',
            'group'
        ],$this->data);

        if(!$validation)
            $this->response->responseError("Invalid request fields");

        $repository = new ScheduleRepository();
        $resultSchedule = $repository->getScheduleForGroup($this->data);
        $resultLastUpdate = $repository->getLastUpdate($this->data);

        $response = [
            "day" => $this->data->day,
            "group" => $this->data->group,
            "schedule" => $resultSchedule,
            "last_update" => $resultLastUpdate["last_update"]
        ];

        $this->response->responseOk($response);

    }

}