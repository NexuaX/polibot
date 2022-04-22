<?php

    namespace Classes\Controllers;

    use Classes\Controllers\Controller;
    use Classes\Repositories\SetupCommandRepository;

    class SetupComandController extends Controller{

        public function setupServer() : void{
            $this->validateFields([
                'guild_id',
                'faculty',
                'year',
                'department'
            ]);

            $repository = new SetupCommandRepository();
            if(!$repository->guildExists($this->data->guild_id)){
                $repository->addNewGuild($this->data);
            }
            else{
                $repository->updateGuild($this->data);
            }
            $this->responseOk();
        }

        public function setupGroups() : void{
            $this->validateFields([
                'guild_id',
                'message_id',
                'roles'
            ]);

            $repository = new SetupCommandRepository();
            
            if($repository->groupAssignmentExist($this->data))
                $repository->removeGroupAssignment($this->data);

            $repository->addGroupAssignment($this->data);

            $this->responseOk();
        }

        public function getReactionMessage() : void{
            $this->validateFields([
                'guild_id',
                'message_id'
            ]);

            $repository = new SetupCommandRepository();
            $groups = $repository->getGroupAssignmentMessage($this->data);
            $response = [
                'guild_id'  =>$this->data->guild_id,
                'message_id'=>$this->data->message_id,
                'roles' => $groups
            ];

            echo json_encode([
                'code'      => '200',
                'response'  => $response
            ]);
        }

        public function getReactionRole() : void {
            $this->validateFields([
                'guild_id',
                'message_id',
                'emoji_name'
            ]);

            $repository = new SetupCommandRepository();
            $response = $repository->getGroupAssignmentRole($this->data);

            echo json_encode([
                'code'      => '200',
                'response'  => $response
            ]);
        }

        private function validateFields(array $fields){
            foreach($fields as $fieldname){
                if(!isset($this->data->$fieldname)){
                    $this->responseError();
                    die();
                }
            }
        }

        private function responseError() : void {
            echo json_encode([
                'code'      => '400',
                'response'  => 'invalid request fields'
            ]);
        }

        private function responseOk() : void {
            echo json_encode([
                'code'      => '200',
                'response'  => 'success!'
            ]);
        }
    }