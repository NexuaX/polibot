<?php

namespace Classes\Repositories;

class ScheduleRepository extends Repository {

    public function getScheduleForGroup(object $data) {

        $query = $this->dbref->connect()->prepare(
            "select c.name name, type, r.name room, time_from, time_to from schedule s
            join courses c using(schedule_id)
            join rooms r using(room_id)
            where day = '$data->day' and \"group\" = '$data->group'
            order by time_from"
        );
        $query->execute();

        return $query->fetchAll(\PDO::FETCH_ASSOC);

    }

    public function getLastUpdate(object $data) {

        $query = $this->dbref->connect()->prepare(
            "select last_update from schedule 
            where day = '$data->day' and \"group\" = '$data->group'"
        );
        $query->execute();

        return $query->fetch(\PDO::FETCH_ASSOC);

    }

}