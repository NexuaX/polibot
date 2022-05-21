<?php

    namespace Classes\Controllers;

    use Classes\Controllers\Controller;
    use Classes\Repositories\SetupCommandRepository;

    class SetupComandController extends Controller{

        public function setupServer() : void{
            
            $validation = $this->validator->validateFields([
                'guild_id',
                'faculty',
                'year',
                'department'
            ],$this->data);

            if(!$validation)
                $this->response->responseError("Invalid request fields");

            $repository = new SetupCommandRepository();
            if(!$repository->guildExists($this->data->guild_id)){
                $repository->addNewGuild($this->data);
            }
            else{
                $repository->updateGuild($this->data);
            }

            $this->response->responseOk();
        }

        public function setupGroups() : void{
            $validation = $this->validator->validateFields([
                'guild_id',
                'message_id',
                'roles'
            ],$this->data);
            
            if(!$validation)
                $this->response->responseError("Invalid request fields");

            $repository = new SetupCommandRepository();
            
            if($repository->groupAssignmentExist($this->data))
                $repository->removeGroupAssignment($this->data);

            $repository->addGroupAssignment($this->data);

            $this->response->responseOk();
        }

        public function getReactionMessage() : void{
            $validation = $this->validator->validateFields([
                'guild_id',
                'message_id'
            ],$this->data);

            if(!$validation)
                $this->response->responseError("Invalid request fields");

            $repository = new SetupCommandRepository();
            $groups = $repository->getGroupAssignmentMessage($this->data);
            $response = [
                'guild_id'  =>$this->data->guild_id,
                'message_id'=>$this->data->message_id,
                'roles' => $groups
            ];

            $this->response->responseOk($response);
        }

        public function getReactionRole() : void {
            $validation = $this->validator->validateFields([
                'guild_id',
                'message_id',
                'emoji_name'
            ],$this->data);
            
            if(!$validation)
                $this->response->responseError("Invalid request fields");

            $repository = new SetupCommandRepository();
            $role = $repository->getGroupAssignmentRole($this->data);

            $this->response->responseOk($role);
        }

        public function getServerInfo() : void {

            $validation = $this->validator->validateFields(['guild_id'],$this->data);

            if(!$validation)
                $this->response->responseError("Invalid request fields");

            $repository = new SetupCommandRepository();
            $servInfo = $repository->getServerInfo($this->data->guild_id);
            if($servInfo == null)
                $this->response->responseError("No data found");

            $this->response->responseOk($servInfo);
        }

        public function getGroupsInfo() : void {

            $validation = $this->validator->validateFields(['guild_id'],$this->data);

            if(!$validation)
                $this->response->responseError("invalid request fields");
            
            $repository = new SetupCommandRepository();
            $groupInfo = $repository->getGroupsInfo($this->data->guild_id);

            if($groupInfo == null)
                $this->response->responseError("No data found");
            
            $this->response->responseOk($groupInfo);
        }
    }