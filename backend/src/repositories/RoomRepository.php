<?php

namespace Classes\Repositories;

class RoomRepository extends Repository {

    public function getRoomFromDB(object $data) {

        $query = $this->dbref->connect()->prepare(
            "SELECT * FROM rooms WHERE name like '%$data->name%'"
        );
        $query->execute();

        $result = $query->fetch(\PDO::FETCH_ASSOC);
        if(!$result){
            return false;
        }
        return $result;
    }
}