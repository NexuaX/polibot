<?php

    namespace Classes\Repositories;

    class SetupCommandRepository extends Repository{
        //DO SPRAWDZENIA NIE WIEM CZY COKOLWIEK DZIALA PISZE NA WYCZUCIE
        public function guildExists(string $guildID) : bool{
            $query = $this->dbref->connect()->prepare(
                "SELECT * from public.group_server WHERE guild_id='$guildID'"
            );
            $query->execute();
            
            $result = $query->fetch(\PDO::FETCH_ASSOC);
            var_dump($result);
            if(!$result)
                return false;

            return true;
        }

        public function addNewGuild(object $guildDetails) : bool {

            $query = $this->dbref->connect()->prepare(
                "INSERT INTO public.setup_server (guild_id, faculty, year, department)
                 values ('$guildDetails->guild_id', 
                         '$guildDetails->faculty', 
                         '$guildDetails->year', 
                         '$guildDetails->department');
                "
            );
            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            var_dump($result);
            if(!$result)
                return false;
            
            return true;
        }

        public function updateGuild(object $guildDetails) : bool {
            $query = $this->dbref->connect()->prepare(
                "UPDATE public.setup_server 
                 SET faculty='$guildDetails->faculty',
                     year='$guildDetails->year',
                     department='$guildDetails->department'
                 WHERE guild_id='$guildDetails->guild_id'
                "
            );
            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            var_dump($result);
            if(!$result)
                return false;
            
            return true;
        }

        public function groupAssignmentExist($assigmentDetails){
            $query = $this->dbref->connect()->prepare(
                "SELECT * FROM public.group_server 
                 WHERE guild_id='$assigmentDetails->guild_id' 
                 AND message_id='$assigmentDetails->message_id'"
            );

            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            var_dump($result);
            if(!$result)
                return false;
            
            return true;
        }

        public function removeGroupAssignment($assigmentDetails){
            $query = $this->dbref->connect()->prepare(
                "DELETE * FROM public.group_server 
                 WHERE guild_id='$assigmentDetails->guild_id' 
                 AND message_id='$assigmentDetails->message_id'"
            );
            
            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            var_dump($result);
            if(!$result)
                return false;
            
            return true;
        }

        public function addGroupAssignment($assigmentDetails){
            $insertSql = "";

            if(empty($assigmentDetails->roles))
                return false;

            foreach($assigmentDetails->roles as $role){
                $insertSql .= "('$assigmentDetails->guild_id','$assigmentDetails->message_id','$role->role_name','$role->emoji_name'),";
            }
            $insertSql = rtrim($insertSql,", ");

            $query = $this->dbref->connect()->prepare(
                "INSERT INTO public.group_server (guild_id, message_id, role_name, emoji_name) 
                 $insertSql
                 "
            );
            
            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            var_dump($result);
            if(!$result)
                return false;
            
            return true;
        }

        public function getGroupAssignment($assigmentDetails) : ?array{
            $query = $this->dbref->connect()->prepare(
                "SELECT * FROM public.group_server 
                 WHERE guild_id='$assigmentDetails->guild_id' 
                 AND message_id='$assigmentDetails->message_id'"
            );
            $roles = [];
            $query->execute();
            while($result = $query->fetch(\PDO::FETCH_ASSOC)){
                $roles[] = [
                    'role_name'     => $result['role_name'],
                    'emoji_name'    => $result['emoji_name']
                ];
            }

            if(empty($roles))
                return null;
                
            return $roles;
        }
    }