<?php

    namespace Classes\Repositories;

    class SetupCommandRepository extends Repository{
        //DO SPRAWDZENIA NIE WIEM CZY COKOLWIEK DZIALA PISZE NA WYCZUCIE
        public function guildExists(string $guildID) : bool{
            $query = $this->dbref->connect()->prepare(
                "SELECT * from public.guilds WHERE guild_id='$guildID'"
            );
            $query->execute();
            
            $result = $query->fetch(\PDO::FETCH_ASSOC);
            // var_dump($result);
            if(!$result)
                return false;

            return true;
        }

        public function addNewGuild(object $guildDetails) : bool {

            $query = $this->dbref->connect()->prepare(
                "INSERT INTO public.guilds (guild_id, faculty, year, department)
                 values ('$guildDetails->guild_id', 
                         '$guildDetails->faculty', 
                         '$guildDetails->year', 
                         '$guildDetails->department');
                "
            );
            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            // var_dump($result);
            if(!$result)
                return false;
            
            return true;
        }

        public function updateGuild(object $guildDetails) : bool {
            $query = $this->dbref->connect()->prepare(
                "UPDATE public.guilds
                 SET faculty='$guildDetails->faculty',
                     year='$guildDetails->year',
                     department='$guildDetails->department'
                 WHERE guild_id='$guildDetails->guild_id'
                "
            );
            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            // var_dump($result);
            if(!$result)
                return false;
            
            return true;
        }

        public function groupAssignmentExist($assigmentDetails){
            $query = $this->dbref->connect()->prepare(
                "select guild_id, message_id from public.group_panels
                WHERE guild_id='$assigmentDetails->guild_id'"
            );

            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            // var_dump($result);
            if(!$result)
                return false;
            
            return true;
        }

        public function removeGroupAssignment($assigmentDetails){
            $query = $this->dbref->connect()->prepare(
                "delete from public.group_panels
                where guild_id='$assigmentDetails->guild_id'"
            );
            
            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            // var_dump($result);
            if(!$result)
                return false;
            
            return true;
        }

        public function addGroupAssignment($assigmentDetails){
            $insertSql = "";

            if(empty($assigmentDetails->roles))
                return false;

            $query = $this->dbref->connect()->prepare(
                "INSERT INTO public.group_panels (guild_id, message_id)
                VALUES ('$assigmentDetails->guild_id', '$assigmentDetails->message_id')
                returning group_panel_id"
            );

            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            // var_dump($result);
            if(!$result)
                return false;

            $id = $result['group_panel_id'];

            foreach($assigmentDetails->roles as $role){
                $insertSql .= "('$id','$role->role_name','$role->emoji_name'),";
            }
            $insertSql = rtrim($insertSql,", ");

            $query = $this->dbref->connect()->prepare(
                "INSERT INTO public.group_reactions (group_panel_id, role_name, emoji_name)
                VALUES $insertSql"
            );
            
            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            // var_dump($result);
            if(!$result)
                return false;
            
            return true;
        }

        public function getGroupAssignmentMessage($assigmentDetails) : ?array{
            $query = $this->dbref->connect()->prepare(
                "SELECT * FROM public.group_reactions
                join group_panels gp on gp.group_panel_id = group_reactions.group_panel_id
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

        public function getGroupAssignmentRole($assigmentDetails) {
            $query = $this->dbref->connect()->prepare(
                "SELECT guild_id, message_id, role_name, emoji_name FROM public.group_reactions
                join group_panels gp on gp.group_panel_id = group_reactions.group_panel_id
                WHERE guild_id='$assigmentDetails->guild_id' 
                AND message_id='$assigmentDetails->message_id'
                AND emoji_name='$assigmentDetails->emoji_name'"
            );

            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            if(!$result)
                return false;

            return $result;
        }

        public function getServerInfo($guildID){
            $query = $this->dbref->connect()->prepare(
                "SELECT guild_id,faculty,year,department FROM public.group_panels NATURAL JOIN guilds where guild_id = '$guildID'"
            );

            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);

            if(!$result)
                return null;
            
            return $result;
        }

        public function getGroupsInfo($guildID){
            $query = $this->dbref->connect()->prepare(
                "SELECT guild_id,message_id FROM public.group_panels where guild_id = '$guildID'"
            );

            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);
            
            if(!$result)
                return null;
            
            $result['roles'] = $this->getGroupAssignmentMessage((object)$result);
            return $result;
        }

        public function test(){
            $query = $this->dbref->connect()->prepare(
                "SELECT * FROM group_panels NATURAL JOIN guilds where guild_id = '948547267319722026'"
            );

            $query->execute();
            $result = $query->fetch(\PDO::FETCH_ASSOC);
            return $result;
        }
    }