<?php

namespace App\Ldap;

use App\Ldap\User as LdapUser;
use App\Models\User as DatabaseUser;

class AttributeHandler
{
    public function handle(LdapUser $ldap, DatabaseUser $database)
    {
        // Set admin flag based on teacher status
        $database->is_admin = $ldap->isTeacher();
        
        // Sync class for students
        if ($ldap->isStudent() && $ldap->getClass()) {
            $database->class = $ldap->getClass();
        }

        if ($ldap->isTeacher() && $ldap->getClass()) {
            $database->default_room = $ldap->getClass();
        }
    }
}
