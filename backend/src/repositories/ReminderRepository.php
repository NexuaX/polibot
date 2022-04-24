<?php

namespace Classes\Repositories;

use Classes\Controllers\ReminderController;
use DateTime;

class ReminderRepository extends Repository {

    public function addNewReminder(object $data) : bool{

        $time = date_create($data->deadline);
        $time2 = new DateTime('now');
        $diff = date_diff($time2, $time)->format('%d');
        if ($diff >= 7) $amount = 3;
        elseif ($diff >= 3) $amount = 2;
        elseif ($diff >= 1) $amount = 1;
        else return false;

        $query = $this->dbref->connect()->prepare(
            "INSERT INTO public.reminders 
                    (guild_id, name, who, deadline, channel, message, reminders_amount)
                    values('$data->guild_id',
                           '$data->name',
                           '$data->who',
                           '$data->deadline',
                           '$data->channel',
                           '$data->message',
                           '$amount')"
        );

        if(!$query->execute()){
            return false;
        }
        return true;
    }

    public function getReminder(string $guild_id) : array{
        $query = $this->dbref->connect()->prepare(
          "SELECT * FROM public.reminders WHERE guild_id = '$guild_id' AND 
                                     ((DATE_PART('day', deadline - now()) = 7 AND reminders_amount = 3) OR 
                                      (DATE_PART('day', deadline - now()) = 3 AND reminders_amount = 2) OR 
                                      (DATE_PART('day', deadline - now()) = 1 AND reminders_amount = 1))"
        );
        $query->execute();

        $result_list = [];

        while($result = $query->fetch(\PDO::FETCH_ASSOC)){
            $id = $result['reminder_id'];
            $amount = $result['reminders_amount'] - 1;

            if ($amount > 0){
                $query2 = $this->dbref->connect()->prepare(
                    "UPDATE reminders SET reminders_amount = '$amount'
                            WHERE reminder_id = '$id'"
                );
                $query2->execute();
            }
            else{
                $query3 = $this->dbref->connect()->prepare(
                    "DELETE FROM reminders WHERE reminder_id = '$id'"
                );
                $query3->execute();
            }

            array_push($result_list, $result);
        }

        return($result_list);
    }
}