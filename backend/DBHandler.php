<?php

namespace Classes\Handlers;

use PDOException;

class DBHandler{
        private \PDO $conn;
        private string $host;
        private int $port;
        private string $dbname;
        private string $user;
        private string $passwd;

        //host=sheep port=5432 dbname=test user=lamb password=bar
        public function __construct()
        {
            $this->host = \HOST;
            $this->port = \PORT;
            $this->dbname = \DATABASE;
            $this->user = \USERNAME;
            $this->passwd = \PASSWORD;
        }
        public function connect() : \PDO{
            if(isset($this->conn))
                return $this->conn;
            try{
                // var_dump("pgsql:host=$this->host port=$this->port dbname=$this->dbname",$this->user, $this->passwd);
                $conn_config = "pgsql:host=$this->host port=$this->port dbname=$this->dbname";
                $this->conn = new \PDO(
                    $conn_config,
                    $this->user,
                    $this->passwd,
                    ["sslmode" => "prefer"]
                );

                $this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
                return $this->conn;
            }
            catch(PDOException $e){
                die("Connection failed". $e->getMessage());
            }
        }
    }
