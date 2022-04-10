<?php

    namespace Classes\Repositories;
    use Classes\Handlers\DBHandler;

    class Repository{

        protected DBHandler $dbref;

        public function __construct()
        {
            $this->dbref = new DBHandler();
        }
    }