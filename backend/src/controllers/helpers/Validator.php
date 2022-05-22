<?php

    namespace Classes\Controllers\Helpers;

    class Validator {

        public function validateFields(array $fields,object $data) : bool{
            foreach($fields as $fieldname){
                if(!isset($data->$fieldname)){
                    return false;
                }
            }
            return true;
        }

    }