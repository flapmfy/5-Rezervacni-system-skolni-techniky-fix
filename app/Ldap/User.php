<?php

namespace App\Ldap;

use LdapRecord\Models\OpenLDAP\User as BaseUser;

class User extends BaseUser
{
    // Add 'array' type declaration to match parent class
    static array $objectClasses = [
        'inetOrgPerson',
        'organizationalPerson',
        'person',
        'top',
    ];

    protected array $casts = [
        'mail' => 'string',
        'cn' => 'string',
        'uid' => 'string',
        'givenName' => 'string',
        'sn' => 'string',
        'l' => 'string',
    ];

    protected string $guidKey = 'cn';

    public function isTeacher()
    {
        $baseFormat = env('APP_ENV') === 'production' 
            ? 'ou=U,o=SPSE' 
            : 'ou=U,dc=spse,dc=local';

        // Check if user is in the Teachers OU
        return strpos($this->getDn(), $baseFormat) !== false;
    }

    public function isStudent()
    {
        $baseFormat = env('APP_ENV') === 'production' 
            ? 'ou=Z,o=SPSE' 
            : 'ou=Z,dc=spse,dc=local';

        // Check if user is in the Students OU
        return strpos($this->getDn(), $baseFormat) !== false;
    }

    public function getClass()
    {
        // Return the class attribute if it exists
        return $this->l;
    }
}