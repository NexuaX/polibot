<?php

namespace Classes\Controllers;

use Classes\Repositories\ReminderRepository;
use DateTime;

class ReminderController extends Controller {

    public function setReminder() : void {
        $validation = $this->validator->validateFields([
            'guild_id',
            'name',
            'who',
            'deadline',
            'channel',
            'message'
        ],$this->data);

        if(!$validation)
            $this->response->responseError("Invalid request fields");

        $repository = new ReminderRepository();
        if(!$repository->addNewReminder($this->data)){
            $this->response->responseError('DB error');
            die();
        }
        $this->response->responseOk();
    }

    public function getReminders() : void {
        $validation = $this->validator->validateFields([
            'guild_id',
        ],$this->data);

        if(!$validation)
            $this->response->responseError("Invalid request fields");

        $repository = new ReminderRepository();
        $results = $repository->getReminder($this->data->guild_id);
        $reminders = [];

        foreach ($results as $tmp){
            $result = [
                'name' => $tmp['name'],
                'who' => $tmp['who'],
                'deadline' => $tmp['deadline'],
                'channel' => $tmp['channel'],
                'message' => $tmp['message']
            ];

            array_push($reminders, $result);
        }

        $response = [
            'guild_id' => $this->data->guild_id,
            'reminders' => $reminders
        ];

        $this->response->responseOk($response);
    }

}