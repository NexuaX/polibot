<?php

namespace Classes\Repositories;

class ScheduleRepository extends Repository {

    public function getScheduleForGroup(object $data) {

        $query = $this->dbref->connect()->prepare(
            "select name, type, room, time_from, time_to from nexuax_schedule 
            join nexuax_courses using(schedule_id)
            where day = '$data->day' and \"group\" = '$data->group'
            order by time_from"
        );
        $query->execute();

        return $query->fetchAll(\PDO::FETCH_ASSOC);

    }

    public function getLastUpdate(object $data) {

        $query = $this->dbref->connect()->prepare(
            "select last_update from nexuax_schedule 
            where day = '$data->day' and \"group\" = '$data->group'"
        );
        $query->execute();

        return $query->fetch(\PDO::FETCH_ASSOC);

    }

}