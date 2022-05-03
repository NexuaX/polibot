<?php

namespace Classes\Controllers;

use Classes\Repositories\ReminderRepository;
use DateTime;

class ReminderController extends Controller {

    public function setReminder() : void {
        $this->validateFields([
            'guild_id',
            'name',
            'who',
            'deadline',
            'channel',
            'message'
        ]);

        $repository = new ReminderRepository();
        if(!$repository->addNewReminder($this->data)){
            $this->responseError('DB error');
            die();
        }
        $this->responseOk();
    }

    public function getReminders() : void {
        $this->validateFields([
            'guild_id',
        ]);

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